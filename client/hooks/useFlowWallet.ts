// hooks/useFlowWallet.ts
// React hook for Flow wallet connection management

import { useState, useEffect, useCallback } from 'react';
import { currentUser, authenticate, unauthenticate } from '@onflow/fcl';
import type { FlowUser, WalletState } from '@/types/flow';
import { validateWalletAddress } from '@/lib/wallet-validation';

export const useFlowWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    user: { addr: null, loggedIn: null },
    connected: false,
    connecting: false,
    disconnecting: false,
    error: null,
  });
  const [walletType, setWalletType] = useState<string | null>(null);

  // Detect wallet type from user data
  const detectWalletType = useCallback((user: FlowUser): string => {
    if (user.services && user.services.length > 0) {
      const service = user.services[0];
      if (service.provider?.name) {
        return service.provider.name;
      }
    }
    return 'Flow Wallet';
  }, []);

  // Update wallet state when user changes
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await currentUser.snapshot();
        const detectedType = user?.addr ? detectWalletType(user) : null;
        setWalletType(detectedType);
        
        // Validate wallet address
        const isValidAddress = validateWalletAddress(user?.addr);
        
        setWalletState(prev => ({
          ...prev,
          user: user as FlowUser,
          connected: Boolean(user?.addr && user?.loggedIn && isValidAddress),
          error: user?.addr && !isValidAddress ? 
            'Invalid wallet address. Please connect with a real Flow wallet address.' : 
            null,
        }));
      } catch (error) {
        console.error('Error checking user:', error);
        setWalletState(prev => ({
          ...prev,
          user: { addr: null, loggedIn: null },
          connected: false,
          error: error instanceof Error ? error.message : 'Failed to check user status',
        }));
      }
    };

    checkUser();

    // Subscribe to user changes
    const unsubscribe = currentUser.subscribe(checkUser);

    return () => {
      unsubscribe();
    };
  }, [detectWalletType, validateWalletAddress]);

  // Connect wallet
  const connect = useCallback(async () => {
    try {
      setWalletState(prev => ({ ...prev, connecting: true, error: null }));
      
      await authenticate();
      
      // Don't set connected to true here - let the useEffect handle validation
      setWalletState(prev => ({ 
        ...prev, 
        connecting: false,
        error: null 
      }));
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWalletState(prev => ({ 
        ...prev, 
        connecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet'
      }));
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      setWalletState(prev => ({ ...prev, disconnecting: true, error: null }));
      
      await unauthenticate();
      
      setWalletState(prev => ({ 
        ...prev, 
        disconnecting: false,
        connected: false,
        user: { addr: null, loggedIn: null },
        error: null 
      }));
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      setWalletState(prev => ({ 
        ...prev, 
        disconnecting: false,
        error: error instanceof Error ? error.message : 'Failed to disconnect wallet'
      }));
    }
  }, []);

  // Get user address
  const getAddress = useCallback((): string | null => {
    return walletState.user.addr;
  }, [walletState.user.addr]);

  // Check if wallet is connected
  const isConnected = useCallback((): boolean => {
    return walletState.connected;
  }, [walletState.connected]);

  // Clear error
  const clearError = useCallback(() => {
    setWalletState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    user: walletState.user,
    connected: walletState.connected,
    connecting: walletState.connecting,
    disconnecting: walletState.disconnecting,
    error: walletState.error,
    walletType,
    
    // Actions
    connect,
    disconnect,
    getAddress,
    isConnected,
    clearError,
  };
};

