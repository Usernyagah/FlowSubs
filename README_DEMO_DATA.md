# FlowSubs Demo Data Setup

This directory contains scripts and transactions to pre-populate FlowSubs with demo data for testing and demonstration purposes.

## Overview

The demo data setup creates:
- **3 Providers**: Premium Streaming Service, Basic Cloud Storage, Enterprise Analytics
- **8 Subscriptions**: Distributed across providers with monthly payments of 5-10 FLOW tokens
- **Realistic Data**: Proper intervals, amounts, and relationships for testing

## Files

### Transactions
- `register_demo_provider.cdc` - Register a provider with name and description
- `create_demo_subscription.cdc` - Create a subscription to a provider
- `setup_demo_data.cdc` - Simulation script (doesn't interact with contract)
- `setup_demo_data_real.cdc` - Real contract interaction script

### Scripts
- `get_demo_data.cdc` - Query demo data from the contract
- `setup_demo_data.sh` - Bash setup script for Linux/Mac
- `setup_demo_data.ps1` - PowerShell setup script for Windows

## Quick Start

### 1. Deploy Your Contract
First, deploy the FlowSubs contract to Flow testnet:

```bash
flow contracts deploy contracts/FlowSubs.cdc --network testnet
```

### 2. Update Contract Address
Replace `0xYOUR_CONTRACT_ADDRESS` in all transaction files with your deployed contract address.

### 3. Run Setup Script
Choose your platform:

**Linux/Mac:**
```bash
chmod +x scripts/setup_demo_data.sh
./scripts/setup_demo_data.sh
```

**Windows:**
```powershell
.\scripts\setup_demo_data.ps1 -ContractAddress 0xYourContractAddress
```

## Manual Setup

Since FlowSubs requires each user to create their own subscriptions, you'll need to run transactions with different accounts:

### Step 1: Register Providers (3 accounts needed)

```bash
# Provider 1: Premium Streaming Service
flow transactions send transactions/register_demo_provider.cdc \
  --args-json '[{"type": "String", "value": "Premium Streaming Service"}, {"type": "String", "value": "High-quality video streaming with premium content"}]' \
  --network testnet

# Provider 2: Basic Cloud Storage  
flow transactions send transactions/register_demo_provider.cdc \
  --args-json '[{"type": "String", "value": "Basic Cloud Storage"}, {"type": "String", "value": "Reliable cloud storage with basic features"}]' \
  --network testnet

# Provider 3: Enterprise Analytics
flow transactions send transactions/register_demo_provider.cdc \
  --args-json '[{"type": "String", "value": "Enterprise Analytics"}, {"type": "String", "value": "Advanced analytics and business intelligence tools"}]' \
  --network testnet
```

### Step 2: Create Subscriptions (8 accounts needed)

```bash
# Subscription 1: 5.0 FLOW monthly to Premium Streaming Service
flow transactions send transactions/create_demo_subscription.cdc \
  --args-json '[{"type": "Address", "value": "0x1234567890abcdef"}, {"type": "UFix64", "value": "5.0"}, {"type": "UFix64", "value": "2592000"}]' \
  --network testnet

# Subscription 2: 7.5 FLOW monthly to Premium Streaming Service
flow transactions send transactions/create_demo_subscription.cdc \
  --args-json '[{"type": "Address", "value": "0x1234567890abcdef"}, {"type": "UFix64", "value": "7.5"}, {"type": "UFix64", "value": "2592000"}]' \
  --network testnet

# Subscription 3: 10.0 FLOW monthly to Premium Streaming Service
flow transactions send transactions/create_demo_subscription.cdc \
  --args-json '[{"type": "Address", "value": "0x1234567890abcdef"}, {"type": "UFix64", "value": "10.0"}, {"type": "UFix64", "value": "2592000"}]' \
  --network testnet

# Continue with remaining subscriptions...
```

### Step 3: Query Demo Data

```bash
flow scripts execute scripts/get_demo_data.cdc --network testnet
```

## Demo Data Structure

### Providers (3)
1. **Premium Streaming Service** (`0x1234567890abcdef`)
   - Description: High-quality video streaming with premium content
   - Subscribers: 3

2. **Basic Cloud Storage** (`0xfedcba0987654321`)
   - Description: Reliable cloud storage with basic features
   - Subscribers: 3

3. **Enterprise Analytics** (`0x9876543210fedcba`)
   - Description: Advanced analytics and business intelligence tools
   - Subscribers: 2

### Subscriptions (8)
| ID | Subscriber | Provider | Amount | Interval |
|----|------------|----------|--------|----------|
| 1  | 0x1111111111111111 | Premium Streaming | 5.0 FLOW | 30 days |
| 2  | 0x2222222222222222 | Premium Streaming | 7.5 FLOW | 30 days |
| 3  | 0x3333333333333333 | Premium Streaming | 10.0 FLOW | 30 days |
| 4  | 0x4444444444444444 | Basic Cloud Storage | 6.0 FLOW | 30 days |
| 5  | 0x5555555555555555 | Basic Cloud Storage | 8.0 FLOW | 30 days |
| 6  | 0x6666666666666666 | Basic Cloud Storage | 9.0 FLOW | 30 days |
| 7  | 0x7777777777777777 | Enterprise Analytics | 5.5 FLOW | 30 days |
| 8  | 0x8888888888888888 | Enterprise Analytics | 7.0 FLOW | 30 days |

## Frontend Integration

Once the demo data is set up, your React hooks can query it:

```typescript
import { useFlowSubs } from '@/hooks/useFlowSubs';

function DemoComponent() {
  const { subscriptions, providers, fetchSubscriptions, fetchProviders } = useFlowSubs();

  useEffect(() => {
    // Fetch demo data
    fetchProviders();
    fetchSubscriptions('0x1111111111111111'); // Demo subscriber address
  }, []);

  return (
    <div>
      <h2>Demo Providers</h2>
      {providers.map(provider => (
        <div key={provider.address}>
          <h3>{provider.name}</h3>
          <p>{provider.description}</p>
        </div>
      ))}

      <h2>Demo Subscriptions</h2>
      {subscriptions.map(subscription => (
        <div key={subscription.id}>
          <p>Amount: {subscription.amount} FLOW</p>
          <p>Provider: {subscription.provider}</p>
        </div>
      ))}
    </div>
  );
}
```

## Testing Workflow

### 1. Contract Testing
Test with real contracts:

```bash
# Visit http://localhost:3000/contract-testing
# Requires wallet connection and demo data setup
```

### 2. Demo Data Setup
Set up demo data for realistic testing:

```bash
# Run the setup script
./scripts/setup_demo_data.sh
```

## Account Management

### Creating Test Accounts
Use Flow Port to create test accounts:

1. Visit [Flow Port](https://testnet.flowport.io/)
2. Create multiple accounts for testing
3. Fund accounts with testnet FLOW tokens
4. Use account addresses in demo data setup

### Account Requirements
- **3 Provider Accounts**: For registering providers
- **8 Subscriber Accounts**: For creating subscriptions
- **FLOW Tokens**: Each account needs FLOW for transaction fees

## Troubleshooting

### Common Issues

1. **"Contract not found"**
   - Verify contract address is correct
   - Ensure contract is deployed to testnet

2. **"Insufficient balance"**
   - Fund accounts with testnet FLOW tokens
   - Check account has enough FLOW for transaction fees

3. **"Invalid address"**
   - Use valid Flow testnet addresses
   - Ensure addresses are properly formatted

### Debug Mode
Enable FCL debug mode for detailed logging:

```typescript
import { config } from '@onflow/fcl';

config({
  'fcl.debug': true,
});
```

## Events

The demo data setup emits the following events:

- `SubscriptionCreated`: When each subscription is created
- `ProviderRegistered`: When each provider is registered

Monitor these events in your frontend:

```typescript
// Listen for subscription events
fcl.events('SubscriptionCreated').subscribe((event) => {
  console.log('New subscription created:', event);
});
```

## Next Steps

1. **Set up demo data** using the provided scripts
2. **Test frontend** with real contract data
3. **Monitor events** for real-time updates
4. **Implement payment processing** with Forte Workflows
5. **Deploy to mainnet** when ready for production

## Support

For issues or questions:
- Check the [Flow documentation](https://docs.onflow.org/)
- Review [FCL documentation](https://docs.onflow.org/fcl/)
- Open an issue on GitHub
