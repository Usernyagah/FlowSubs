// hooks/useFlowSubs.ts
// React hook for FlowSubs contract interactions

import { useState, useEffect, useCallback } from 'react';
import * as fcl from '@onflow/fcl';
import { useFlowWallet } from './useFlowWallet';
import { TRANSACTION_TEMPLATES, SCRIPT_TEMPLATES, CONTRACT_ADDRESSES } from '@/lib/fcl-config';
import type { 
  Subscription, 
  ProviderInfo, 
  PaymentEvent, 
  CreateSubscriptionParams,
  FlowSubsState,
  TransactionResult 
} from '@/types/flow';

export const useFlowSubs = () => {
  const { user, connected } = useFlowWallet();
  const [state, setState] = useState<FlowSubsState>({
    subscriptions: [],
    payments: [],
    providers: [],
    loading: false,
    error: null,
  });

  // Check if we're using a mock contract address
  const isMockContract = useCallback(() => {
    return CONTRACT_ADDRESSES.FlowSubs === '0x1234567890123456';
  }, []);

  // Generic function to handle transactions
  const executeTransaction = useCallback(async (
    transactionCode: string,
    argsBuilder: any
  ): Promise<TransactionResult> => {
    // Skip transaction execution if using mock contract
    if (isMockContract()) {
      console.log('Contract deployed at 0xc1b85cc9470b7283 - check connection');
      setState(prev => ({ ...prev, loading: false }));
      return {
        status: 'PENDING',
        transactionId: 'mock-transaction-id',
        error: 'Contract deployed at 0xc1b85cc9470b7283. Please verify wallet connection and network configuration.'
      };
    }

    try {
      if (!user?.addr) {
        throw new Error('User wallet not connected');
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      // Build the transaction with proper argument formatting
      const transactionId = await fcl.send([
        fcl.transaction(transactionCode),
        fcl.args([
          fcl.arg(params.provider, t.Address),
          fcl.arg(params.amount.toString(), t.UFix64),
          fcl.arg(params.interval.toString(), t.UFix64)
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(999)
      ]);

      // Wait for transaction to be sealed
      const tx = await query(transactionId);
      
      if (tx.status === 4) { // Sealed
        return {
          status: 'SEALED',
          transactionId,
        };
      } else if (tx.status === 5) { // Expired
        return {
          status: 'EXPIRED',
          transactionId,
          error: 'Transaction expired',
        };
      } else {
        return {
          status: 'PENDING',
          transactionId,
        };
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error instanceof Error ? error.message : 'Transaction failed'
      }));
      return {
        status: 'PENDING',
        transactionId: '',
        error: error instanceof Error ? error.message : 'Transaction failed',
      };
    }
  }, [user, isMockContract]);

  // Generic function to handle scripts
  const executeScript = useCallback(async (
    scriptCode: string,
    argsBuilder: any = []
  ): Promise<any> => {
    // Skip script execution if using mock contract
    if (isMockContract()) {
      console.log('Skipping script execution - using mock contract');
      setState(prev => ({ ...prev, loading: false }));
      return null;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await query({
        cadence: scriptCode,
        args: typeof argsBuilder === 'function' ? argsBuilder : argsBuilder,
      });

      setState(prev => ({ ...prev, loading: false }));
      return result;
    } catch (error) {
      console.error('Script execution failed:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error instanceof Error ? error.message : 'Script execution failed'
      }));
      return null;
    }
  }, [isMockContract]);

  // Create a new subscription
  const createSubscription = useCallback(async (
    subscriptionParams: CreateSubscriptionParams
  ): Promise<TransactionResult> => {
    if (!connected || !user?.addr) {
      throw new Error('Wallet not connected');
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Format amount and interval as strings with decimal points for UFix64
      const formatUFix64 = (value: number | string) => {
        // Ensure the value has a decimal point for UFix64
        const str = typeof value === 'string' ? value : value.toString();
        return str.includes('.') ? str : `${str}.0`;
      };

      // Using fcl.mutate for a more straightforward transaction
      const transactionId = await fcl.mutate({
        cadence: TRANSACTION_TEMPLATES.createSubscription,
        args: (arg: any, t: any) => [
          arg(subscriptionParams.provider, t.Address),
          arg(formatUFix64(subscriptionParams.amount), t.UFix64),
          arg(formatUFix64(subscriptionParams.interval), t.UFix64)
        ],
        limit: 999
      });

      // Wait for transaction to be sealed
      const tx = await fcl.tx(transactionId).onceSealed();
      
      if (tx.status === 4) { // Sealed
        // Refresh subscriptions after successful creation
        await fetchSubscriptions(user.addr);
        return {
          status: 'SEALED',
          transactionId,
        };
      } else {
        throw new Error(`Transaction failed with status: ${tx.status}`);
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: errorMessage
      }));
      return {
        status: 'PENDING',
        transactionId: '',
        error: errorMessage,
      };
    }
  }, [connected, user, executeTransaction]);

  // Cancel a subscription
  const cancelSubscription = useCallback(async (
    subscriptionId: number
  ): Promise<TransactionResult> => {
    if (!connected || !user?.addr) {
      throw new Error('Wallet not connected');
    }

    const args = [
      { type: 'UInt64', value: subscriptionId.toString() },
    ];

    const result = await executeTransaction(TRANSACTION_TEMPLATES.cancelSubscription, args);
    
    if (result.status === 'SEALED') {
      // Refresh subscriptions after successful cancellation
      await fetchSubscriptions(user.addr);
    }

    return result;
  }, [connected, user, executeTransaction]);

  // Register as a provider
  const registerProvider = useCallback(async (
    name: string,
    description: string
  ): Promise<TransactionResult> => {
    if (!connected || !user?.addr) {
      throw new Error('Wallet not connected');
    }

    const args = [
      { type: 'String', value: name },
      { type: 'String', value: description },
    ];

    const result = await executeTransaction(TRANSACTION_TEMPLATES.registerProvider, args);
    
    if (result.status === 'SEALED') {
      // Refresh providers after successful registration
      await fetchProviders();
    }

    return result;
  }, [connected, user, executeTransaction]);

  // Fetch subscriptions for a user
  const fetchSubscriptions = useCallback(async (address: string): Promise<Subscription[]> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Skip script execution if using mock contract
      if (isMockContract()) {
        console.log('Skipping subscription fetch - using mock contract');
        setState(prev => ({ 
          ...prev, 
          subscriptions: [],
          loading: false 
        }));
        return [];
      }

      // Ensure the address is properly formatted
      const formattedAddress = address.startsWith('0x') ? address : `0x${address}`;
      
      console.log('Fetching subscriptions for address:', formattedAddress);
      
      const args = (arg: any, t: any) => [
        arg(formattedAddress, t.Address)
      ];

      const result = await executeScript(SCRIPT_TEMPLATES.getSubscriberSubscriptions, args);
      
      // Transform the result to match our Subscription interface
      const subscriptions: Subscription[] = result?.map((sub: any) => ({
        id: Number(sub.id),
        subscriber: sub.subscriber,
        provider: sub.provider,
        amount: Number(sub.amount),
        interval: Number(sub.interval),
        nextPaymentTime: Number(sub.nextPaymentTime),
        isActive: Boolean(sub.isActive),
        createdAt: Number(sub.createdAt),
      })) || [];

      setState(prev => ({ 
        ...prev, 
        subscriptions,
        loading: false 
      }));

      return subscriptions;
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch subscriptions'
      }));
      return [];
    }
  }, [executeScript, isMockContract]);

  // Fetch payments for a user
  const fetchPayments = useCallback(async (address: string): Promise<PaymentEvent[]> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Query payment events from the blockchain
      // This would typically query payment events from the blockchain
      // For now, return empty array until contract is deployed
      const payments: PaymentEvent[] = [];

      setState(prev => ({ 
        ...prev, 
        payments: payments,
        loading: false 
      }));

      return payments;
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payments'
      }));
      return [];
    }
  }, []);

  // Fetch all providers
  const fetchProviders = useCallback(async (): Promise<ProviderInfo[]> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Skip script execution if using mock contract
      if (isMockContract()) {
        console.log('Skipping providers fetch - using mock contract');
        setState(prev => ({
          ...prev,
          providers: [],
          loading: false,
        }));
        return [];
      }

      const result = await executeScript(SCRIPT_TEMPLATES.getAllProviders, (arg: any, t: any) => []);
      
      // Transform the result to match our ProviderInfo interface
      const providers: ProviderInfo[] = result?.map((provider: any) => ({
        address: provider.address,
        name: provider.name,
        description: provider.description,
        isActive: Boolean(provider.isActive),
      })) || [];

      setState(prev => ({ 
        ...prev, 
        providers,
        loading: false 
      }));

      return providers;
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch providers'
      }));
      return [];
    }
  }, [executeScript, isMockContract]);

  // Auto-fetch data when wallet connects
  useEffect(() => {
    if (connected && user?.addr) {
      fetchSubscriptions(user.addr);
      fetchPayments(user.addr);
      fetchProviders();
    }
  }, [connected, user?.addr, fetchSubscriptions, fetchPayments, fetchProviders]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    subscriptions: state.subscriptions,
    payments: state.payments,
    providers: state.providers,
    loading: state.loading,
    error: state.error,
    
    // Actions
    createSubscription,
    cancelSubscription,
    registerProvider,
    fetchSubscriptions,
    fetchPayments,
    fetchProviders,
    clearError,
  };
};

