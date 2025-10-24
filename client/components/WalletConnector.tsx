// components/WalletConnector.tsx
// Comprehensive wallet connection component for Flow-compatible wallets

'use client';

import { useState } from 'react';
import { useFlowWallet } from '@/hooks/useFlowWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Smartphone,
  Monitor
} from 'lucide-react';

interface WalletInfo {
  name: string;
  description: string;
  icon: string;
  type: 'mobile' | 'desktop' | 'both';
  popular?: boolean;
  official?: boolean;
}

const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    name: 'Blocto',
    description: 'Most popular Flow wallet with easy onboarding',
    icon: '🔵',
    type: 'both',
    popular: true,
    official: false
  },
  {
    name: 'Flow Port',
    description: 'Official Flow wallet by Flow Foundation',
    icon: '⚡',
    type: 'both',
    popular: true,
    official: true
  },
  {
    name: 'Dapper Wallet',
    description: 'Gaming-focused wallet with NFT support',
    icon: '🎮',
    type: 'both',
    popular: false,
    official: false
  },
  {
    name: 'Lilico Wallet',
    description: 'Lightweight mobile-first Flow wallet',
    icon: '🌸',
    type: 'mobile',
    popular: false,
    official: false
  }
];

export default function WalletConnector() {
  const [selectedWallet, setSelectedWallet] = useState<WalletInfo | null>(null);
  
  const {
    user,
    connected,
    connecting,
    disconnecting,
    error,
    connect,
    disconnect,
    clearError
  } = useFlowWallet();

  const handleWalletSelect = (wallet: WalletInfo) => {
    setSelectedWallet(wallet);
    // FCL will handle the wallet selection through discovery
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setSelectedWallet(null);
    } catch (err) {
      console.error('Wallet disconnection failed:', err);
    }
  };

  // Check if current address is valid
  const isAddressValid = user?.addr && !error?.includes('Invalid wallet address');

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {user?.addr && (
        <Card className={isAddressValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              {isAddressValid ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-600" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${isAddressValid ? 'text-green-800' : 'text-red-800'}`}>
                  {isAddressValid ? 'Wallet Connected' : 'Invalid Wallet Address'}
                </p>
                <p className={`text-sm font-mono ${isAddressValid ? 'text-green-600' : 'text-red-600'}`}>
                  {user.addr}
                </p>
                {!isAddressValid && (
                  <p className="text-xs text-red-600 mt-1">
                    This appears to be a placeholder or test address. Please connect with a real Flow wallet.
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="ml-auto"
              >
                {disconnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  'Disconnect'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearError}
                className="ml-2"
              >
                Clear
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Wallet Selection */}
      {!connected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Connect Your Flow Wallet
            </CardTitle>
            <CardDescription>
              Choose a Flow-compatible wallet to connect to FlowSubs. 
              Your private keys never leave your wallet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Popular Wallets */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Popular Wallets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SUPPORTED_WALLETS.filter(wallet => wallet.popular).map((wallet) => (
                  <Card
                    key={wallet.name}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedWallet?.name === wallet.name ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleWalletSelect(wallet)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{wallet.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{wallet.name}</h4>
                            {wallet.official && (
                              <Badge variant="secondary" className="text-xs">
                                Official
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              Popular
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {wallet.description}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {wallet.type === 'mobile' && (
                              <Smartphone className="h-3 w-3 text-muted-foreground" />
                            )}
                            {wallet.type === 'desktop' && (
                              <Monitor className="h-3 w-3 text-muted-foreground" />
                            )}
                            {wallet.type === 'both' && (
                              <>
                                <Smartphone className="h-3 w-3 text-muted-foreground" />
                                <Monitor className="h-3 w-3 text-muted-foreground" />
                              </>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {wallet.type === 'mobile' ? 'Mobile' : 
                               wallet.type === 'desktop' ? 'Desktop' : 'Mobile & Desktop'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Other Wallets */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Other Wallets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SUPPORTED_WALLETS.filter(wallet => !wallet.popular).map((wallet) => (
                  <Card
                    key={wallet.name}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedWallet?.name === wallet.name ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleWalletSelect(wallet)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{wallet.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{wallet.name}</h4>
                            {wallet.official && (
                              <Badge variant="secondary" className="text-xs">
                                Official
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {wallet.description}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {wallet.type === 'mobile' && (
                              <Smartphone className="h-3 w-3 text-muted-foreground" />
                            )}
                            {wallet.type === 'desktop' && (
                              <Monitor className="h-3 w-3 text-muted-foreground" />
                            )}
                            {wallet.type === 'both' && (
                              <>
                                <Smartphone className="h-3 w-3 text-muted-foreground" />
                                <Monitor className="h-3 w-3 text-muted-foreground" />
                              </>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {wallet.type === 'mobile' ? 'Mobile' : 
                               wallet.type === 'desktop' ? 'Desktop' : 'Mobile & Desktop'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Connect Button */}
            <div className="pt-4">
              <Button
                onClick={handleConnect}
                disabled={connecting}
                className="w-full"
                size="lg"
              >
                {connecting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </div>

            {/* Wallet Info */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Don't have a Flow wallet?{' '}
                <a
                  href="https://blocto.portto.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Get Blocto
                  <ExternalLink className="h-3 w-3" />
                </a>
                {' '}or{' '}
                <a
                  href="https://testnet.flowport.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Try Flow Port
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Features */}
      {isAddressValid && (
        <Card>
          <CardHeader>
            <CardTitle>Wallet Features</CardTitle>
            <CardDescription>
              Your connected wallet provides these capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">🔒</div>
                <h3 className="font-medium">Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Private keys never leave your wallet
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-medium">Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Instant transactions on Flow blockchain
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-medium">Affordable</h3>
                <p className="text-sm text-muted-foreground">
                  Low transaction fees
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
