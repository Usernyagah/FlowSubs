// app/contract-testing/page.tsx
// Example component demonstrating FlowSubs hooks usage

'use client';

import { useState } from 'react';
import { useFlowWallet } from '@/hooks/useFlowWallet';
import { useFlowSubs } from '@/hooks/useFlowSubs';
import WalletConnector from '@/components/WalletConnector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Wallet, Plus, X, RefreshCw } from 'lucide-react';

export default function ContractTestingPage() {
  const [providerAddress, setProviderAddress] = useState('');
  const [subscriptionAmount, setSubscriptionAmount] = useState('1.0');
  const [subscriptionInterval, setSubscriptionInterval] = useState('2592000'); // 30 days
  const [providerName, setProviderName] = useState('');
  const [providerDescription, setProviderDescription] = useState('');

  const {
    user,
    connected,
    connecting,
    disconnecting,
    error: walletError,
    connect,
    disconnect,
    clearError: clearWalletError,
  } = useFlowWallet();

  const {
    subscriptions,
    payments,
    providers,
    loading,
    error: contractError,
    createSubscription,
    cancelSubscription,
    registerProvider,
    fetchSubscriptions,
    fetchPayments,
    fetchProviders,
    clearError: clearContractError,
  } = useFlowSubs();

  const handleCreateSubscription = async () => {
    if (!providerAddress || !subscriptionAmount || !subscriptionInterval) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const result = await createSubscription({
        provider: providerAddress,
        amount: parseFloat(subscriptionAmount),
        interval: parseFloat(subscriptionInterval),
      });

      if (result.status === 'SEALED') {
        alert('Subscription created successfully!');
        setProviderAddress('');
        setSubscriptionAmount('1.0');
        setSubscriptionInterval('2592000');
      } else {
        alert(`Transaction ${result.status}: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    try {
      const result = await cancelSubscription(subscriptionId);
      
      if (result.status === 'SEALED') {
        alert('Subscription cancelled successfully!');
      } else {
        alert(`Transaction ${result.status}: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleRegisterProvider = async () => {
    if (!providerName || !providerDescription) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const result = await registerProvider(providerName, providerDescription);
      
      if (result.status === 'SEALED') {
        alert('Provider registered successfully!');
        setProviderName('');
        setProviderDescription('');
      } else {
        alert(`Transaction ${result.status}: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleRefresh = async () => {
    if (user?.addr) {
      await Promise.all([
        fetchSubscriptions(user.addr),
        fetchPayments(user.addr),
        fetchProviders(),
      ]);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">FlowSubs Contract Testing</h1>
        <p className="text-muted-foreground">
          Test your FlowSubs Cadence contract interactions
        </p>
      </div>

      {/* Wallet Connection */}
      <WalletConnector />

      {connected && user?.addr && !walletError?.includes('Invalid wallet address') && (
        <>
          {/* Create Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Subscription
              </CardTitle>
              <CardDescription>
                Subscribe to a provider with recurring payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="provider-address">Provider Address</Label>
                  <Input
                    id="provider-address"
                    value={providerAddress}
                    onChange={(e) => setProviderAddress(e.target.value)}
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount (FLOW)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={subscriptionAmount}
                    onChange={(e) => setSubscriptionAmount(e.target.value)}
                    placeholder="1.0"
                  />
                </div>
                <div>
                  <Label htmlFor="interval">Interval (seconds)</Label>
                  <Input
                    id="interval"
                    type="number"
                    value={subscriptionInterval}
                    onChange={(e) => setSubscriptionInterval(e.target.value)}
                    placeholder="2592000"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    2592000 = 30 days
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleCreateSubscription}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Subscription'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Register Provider */}
          <Card>
            <CardHeader>
              <CardTitle>Register as Provider</CardTitle>
              <CardDescription>
                Register your address as a service provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider-name">Provider Name</Label>
                  <Input
                    id="provider-name"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    placeholder="My Service"
                  />
                </div>
                <div>
                  <Label htmlFor="provider-description">Description</Label>
                  <Input
                    id="provider-description"
                    value={providerDescription}
                    onChange={(e) => setProviderDescription(e.target.value)}
                    placeholder="Premium subscription service"
                  />
                </div>
              </div>
              <Button 
                onClick={handleRegisterProvider}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register Provider'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Data Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscriptions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Subscriptions</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Your active subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscriptions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No subscriptions found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {subscriptions.map((subscription) => (
                      <div key={subscription.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Subscription #{subscription.id}</p>
                            <p className="text-sm text-muted-foreground">
                              Provider: {subscription.provider}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Amount: {subscription.amount} FLOW
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Interval: {Math.floor(subscription.interval / 86400)} days
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={subscription.isActive ? "default" : "secondary"}>
                              {subscription.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelSubscription(subscription.id)}
                              disabled={loading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Providers */}
            <Card>
              <CardHeader>
                <CardTitle>Available Providers</CardTitle>
                <CardDescription>
                  Registered service providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {providers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No providers found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {providers.map((provider) => (
                      <div key={provider.address} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{provider.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {provider.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {provider.address}
                            </p>
                          </div>
                          <Badge variant={provider.isActive ? "default" : "secondary"}>
                            {provider.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>
                Your payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No payments found
                </p>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            Payment #{payment.subscriptionId}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Amount: {payment.amount} FLOW
                          </p>
                          <p className="text-sm text-muted-foreground">
                            To: {payment.provider}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(payment.timestamp * 1000).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {payment.amount} FLOW
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

