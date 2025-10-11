# FlowSubs React Hooks

Comprehensive React hooks for interacting with the FlowSubs Cadence smart contract via FCL (Flow Client Library).

## Features

- 🔗 **Wallet Integration**: Connect/disconnect with Flow wallets (Blocto, etc.)
- 📝 **Contract Interactions**: Create, cancel, and manage subscriptions
- 🏢 **Provider Management**: Register and manage service providers
- 📊 **Data Fetching**: Retrieve subscriptions, payments, and provider data
- ⚡ **Real-time Updates**: Automatic data refresh on wallet connection
- 🛡️ **Error Handling**: Comprehensive error states and loading indicators
- 🔒 **Type Safety**: Full TypeScript support

## Installation

```bash
pnpm add @onflow/fcl @onflow/types
```

## Setup

1. **Initialize FCL** in your app:

```typescript
// lib/fcl-config.ts
import { initializeFCL } from '@/lib/fcl-config';

// Initialize FCL when your app starts
initializeFCL();
```

2. **Update Contract Address** in `lib/fcl-config.ts`:

```typescript
const fclConfig: FCLConfig = {
  // ... other config
  '0xFlowSubs': '0xYOUR_DEPLOYED_CONTRACT_ADDRESS', // Replace this
};
```

## Hooks

### useFlowWallet()

Manages Flow wallet connection and user state.

```typescript
import { useFlowWallet } from '@/hooks/useFlowWallet';

function MyComponent() {
  const {
    user,           // Current user object
    connected,      // Boolean: is wallet connected
    connecting,     // Boolean: is connecting
    disconnecting,  // Boolean: is disconnecting
    error,          // String: error message
    connect,        // Function: connect wallet
    disconnect,     // Function: disconnect wallet
    getAddress,     // Function: get user address
    isConnected,    // Function: check if connected
    clearError,     // Function: clear error state
  } = useFlowWallet();

  return (
    <div>
      {!connected ? (
        <button onClick={connect} disabled={connecting}>
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div>
          <p>Connected: {user?.addr}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
```

### useFlowSubs()

Manages FlowSubs contract interactions and data.

```typescript
import { useFlowSubs } from '@/hooks/useFlowSubs';

function MyComponent() {
  const {
    // State
    subscriptions,  // Array: user's subscriptions
    payments,       // Array: payment history
    providers,      // Array: available providers
    loading,        // Boolean: is loading
    error,          // String: error message
    
    // Actions
    createSubscription,    // Function: create new subscription
    cancelSubscription,    // Function: cancel subscription
    registerProvider,      // Function: register as provider
    fetchSubscriptions,    // Function: fetch user subscriptions
    fetchPayments,         // Function: fetch payment history
    fetchProviders,        // Function: fetch all providers
    clearError,            // Function: clear error state
  } = useFlowSubs();

  const handleCreateSubscription = async () => {
    try {
      const result = await createSubscription({
        provider: '0x1234567890abcdef',
        amount: 1.0,
        interval: 2592000, // 30 days in seconds
      });
      
      if (result.status === 'SEALED') {
        console.log('Subscription created successfully!');
      }
    } catch (error) {
      console.error('Failed to create subscription:', error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateSubscription} disabled={loading}>
        {loading ? 'Creating...' : 'Create Subscription'}
      </button>
      
      {subscriptions.map(subscription => (
        <div key={subscription.id}>
          <p>Provider: {subscription.provider}</p>
          <p>Amount: {subscription.amount} FLOW</p>
          <button onClick={() => cancelSubscription(subscription.id)}>
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Complete Example

```typescript
// app/subscriptions/page.tsx
'use client';

import { useState } from 'react';
import { useFlowWallet } from '@/hooks/useFlowWallet';
import { useFlowSubs } from '@/hooks/useFlowSubs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionsPage() {
  const [providerAddress, setProviderAddress] = useState('');
  const [amount, setAmount] = useState('1.0');

  // Wallet hook
  const { user, connected, connect, disconnect } = useFlowWallet();
  
  // FlowSubs hook
  const { 
    subscriptions, 
    loading, 
    error, 
    createSubscription, 
    cancelSubscription 
  } = useFlowSubs();

  const handleCreateSubscription = async () => {
    if (!providerAddress || !amount) return;
    
    try {
      const result = await createSubscription({
        provider: providerAddress,
        amount: parseFloat(amount),
        interval: 2592000, // 30 days
      });
      
      if (result.status === 'SEALED') {
        alert('Subscription created!');
        setProviderAddress('');
        setAmount('1.0');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>FlowSubs Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wallet Connection */}
          {!connected ? (
            <Button onClick={connect}>Connect Wallet</Button>
          ) : (
            <div className="space-y-4">
              <p>Connected: {user?.addr}</p>
              <Button variant="outline" onClick={disconnect}>
                Disconnect
              </Button>
              
              {/* Create Subscription Form */}
              <div className="space-y-2">
                <Input
                  value={providerAddress}
                  onChange={(e) => setProviderAddress(e.target.value)}
                  placeholder="Provider Address"
                />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount (FLOW)"
                />
                <Button 
                  onClick={handleCreateSubscription}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Creating...' : 'Create Subscription'}
                </Button>
              </div>
              
              {/* Error Display */}
              {error && (
                <div className="p-2 bg-red-100 text-red-700 rounded">
                  Error: {error}
                </div>
              )}
              
              {/* Subscriptions List */}
              <div className="space-y-2">
                <h3 className="font-medium">Your Subscriptions:</h3>
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="p-3 border rounded">
                    <p><strong>ID:</strong> {subscription.id}</p>
                    <p><strong>Provider:</strong> {subscription.provider}</p>
                    <p><strong>Amount:</strong> {subscription.amount} FLOW</p>
                    <p><strong>Active:</strong> {subscription.isActive ? 'Yes' : 'No'}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancelSubscription(subscription.id)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

## Type Definitions

```typescript
// types/flow.ts

export interface Subscription {
  id: number;
  subscriber: string;
  provider: string;
  amount: number;
  interval: number;
  nextPaymentTime: number;
  isActive: boolean;
  createdAt: number;
}

export interface ProviderInfo {
  address: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface PaymentEvent {
  subscriber: string;
  provider: string;
  amount: number;
  subscriptionId: number;
  timestamp: number;
  transactionId: string;
}

export interface CreateSubscriptionParams {
  provider: string;
  amount: number;
  interval: number;
}
```

## Error Handling

All hooks include comprehensive error handling:

```typescript
const { error, clearError } = useFlowSubs();

// Display error
{error && (
  <div className="error">
    Error: {error}
    <button onClick={clearError}>Clear</button>
  </div>
)}

// Handle errors in async functions
try {
  const result = await createSubscription(params);
  // Handle success
} catch (error) {
  console.error('Subscription failed:', error);
  // Handle error
}
```

## Loading States

All hooks provide loading states:

```typescript
const { loading } = useFlowSubs();

<Button disabled={loading}>
  {loading ? 'Processing...' : 'Create Subscription'}
</Button>
```

## Best Practices

1. **Always check wallet connection** before contract interactions
2. **Handle errors gracefully** with try-catch blocks
3. **Show loading states** during async operations
4. **Clear errors** when user takes action
5. **Refresh data** after successful transactions
6. **Validate inputs** before sending transactions

## Troubleshooting

### Common Issues

1. **"Wallet not connected"**: Ensure wallet is connected before contract calls
2. **"Transaction failed"**: Check if user has sufficient FLOW tokens
3. **"Contract not found"**: Verify contract address in fcl-config.ts
4. **"Invalid address"**: Ensure provider address is valid Flow address

### Debug Mode

Enable FCL debug mode:

```typescript
import { config } from '@onflow/fcl';

config({
  'fcl.limit': 9999,
  'fcl.debug': true,
});
```

## Support

For issues or questions:
- Check the [Flow documentation](https://docs.onflow.org/)
- Review [FCL documentation](https://docs.onflow.org/fcl/)
- Open an issue on GitHub
