// components/FlowSubsExample.tsx
// Simple example component showing basic hook usage

'use client';

import { useState } from 'react';
import { useFlowWallet } from '@/hooks/useFlowWallet';
import { useFlowSubs } from '@/hooks/useFlowSubs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FlowSubsExample() {
  const [providerAddress, setProviderAddress] = useState('0x1234567890abcdef');
  const [amount, setAmount] = useState('1.0');

  // Wallet hook
  const { 
    user, 
    connected, 
    connecting, 
    connect, 
    disconnect 
  } = useFlowWallet();

  // FlowSubs hook
  const { 
    subscriptions, 
    loading, 
    error, 
    createSubscription, 
    cancelSubscription 
  } = useFlowSubs();

  const handleCreateSubscription = async () => {
    try {
      const result = await createSubscription({
        provider: providerAddress,
        amount: parseFloat(amount),
        interval: 2592000, // 30 days
      });
      
      console.log('Subscription created:', result);
    } catch (error) {
      console.error('Failed to create subscription:', error);
    }
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    try {
      const result = await cancelSubscription(subscriptionId);
      console.log('Subscription cancelled:', result);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>FlowSubs Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wallet Connection */}
          <div>
            {!connected ? (
              <Button onClick={connect} disabled={connecting}>
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            ) : (
              <div className="space-y-2">
                <p>Connected: {user?.addr}</p>
                <Button variant="outline" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>
            )}
          </div>

          {/* Create Subscription */}
          {connected && (
            <div className="space-y-2">
              <input
                type="text"
                value={providerAddress}
                onChange={(e) => setProviderAddress(e.target.value)}
                placeholder="Provider Address"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount (FLOW)"
                className="w-full p-2 border rounded"
              />
              <Button 
                onClick={handleCreateSubscription}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating...' : 'Create Subscription'}
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-2 bg-red-100 text-red-700 rounded">
              Error: {error}
            </div>
          )}

          {/* Subscriptions List */}
          {connected && subscriptions.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Your Subscriptions:</h3>
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="p-2 border rounded">
                  <p>ID: {subscription.id}</p>
                  <p>Provider: {subscription.provider}</p>
                  <p>Amount: {subscription.amount} FLOW</p>
                  <p>Active: {subscription.isActive ? 'Yes' : 'No'}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancelSubscription(subscription.id)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

