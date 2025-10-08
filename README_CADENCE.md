# FlowSubs Cadence Smart Contract

A comprehensive Cadence smart contract for recurring subscription payments on the Flow blockchain, designed to work with Forte Workflows for automated payment processing.

## Features

- ✅ **Recurring Payments**: Automated subscription billing with configurable intervals
- ✅ **Provider Management**: Register and manage service providers
- ✅ **Subscription Management**: Create, cancel, and update subscriptions
- ✅ **Event Logging**: Comprehensive event system for tracking
- ✅ **Forte Workflows Integration**: Ready for automated payment processing
- ✅ **Security**: Built-in validation and access controls

## Contract Structure

### Core Components

1. **Subscription Struct**: Stores subscription details including payment amount, interval, and timing
2. **Provider Management**: Registration and management of service providers
3. **Payment Execution**: Automated payment processing with Forte Workflows
4. **Event System**: Comprehensive logging for all contract interactions

### Key Functions

- `createSubscription()`: Create a new subscription
- `cancelSubscription()`: Cancel an active subscription
- `updateSubscriptionAmount()`: Update payment amount
- `executePayment()`: Process recurring payments (called by Forte Workflows)
- `registerProvider()`: Register as a service provider

## Deployment

### Prerequisites

- Flow CLI installed
- Flow testnet account with FLOW tokens
- Access to Flow testnet

### Deploy to Testnet

1. **Deploy the contract:**
```bash
flow accounts create
flow contracts deploy contracts/FlowSubs.cdc --network testnet
```

2. **Update contract addresses in transaction files:**
Replace `0xYOUR_CONTRACT_ADDRESS` with your deployed contract address in:
- `transactions/create_subscription.cdc`
- `transactions/cancel_subscription.cdc`
- `transactions/register_provider.cdc`
- `scripts/get_subscription.cdc`
- `scripts/get_provider_subscriptions.cdc`

## Usage Examples

### 1. Register as a Provider

```bash
flow transactions send transactions/register_provider.cdc \
  --args-json '[
    {"type": "String", "value": "My Service"},
    {"type": "String", "value": "Premium subscription service"}
  ]' \
  --network testnet
```

### 2. Create a Subscription

```bash
flow transactions send transactions/create_subscription.cdc \
  --args-json '[
    {"type": "Address", "value": "0xPROVIDER_ADDRESS"},
    {"type": "UFix64", "value": "1.0"},
    {"type": "UFix64", "value": "2592000.0"}
  ]' \
  --network testnet
```

### 3. Cancel a Subscription

```bash
flow transactions send transactions/cancel_subscription.cdc \
  --args-json '[
    {"type": "UInt64", "value": "1"}
  ]' \
  --network testnet
```

## Forte Workflows Integration

The contract is designed to work with Forte Workflows for automated payment processing:

1. **Payment Scheduling**: Use `getDueSubscriptions()` to find subscriptions ready for payment
2. **Payment Execution**: Call `executePayment()` for each due subscription
3. **Event Monitoring**: Listen for `PaymentExecuted` events to track successful payments

### Workflow Example

```javascript
// Pseudo-code for Forte Workflow
const dueSubscriptions = await contract.getDueSubscriptions();

for (const subscriptionId of dueSubscriptions) {
  try {
    const success = await contract.executePayment(subscriptionId);
    if (success) {
      console.log(`Payment executed for subscription ${subscriptionId}`);
    }
  } catch (error) {
    console.error(`Payment failed for subscription ${subscriptionId}:`, error);
  }
}
```

## Security Features

- **Access Control**: Only subscribers can cancel/update their subscriptions
- **Input Validation**: Comprehensive validation of payment amounts and intervals
- **Balance Checks**: Ensures sufficient funds before payment execution
- **Provider Verification**: Only registered providers can receive payments

## Events

The contract emits the following events:

- `SubscriptionCreated`: When a new subscription is created
- `SubscriptionCancelled`: When a subscription is cancelled
- `PaymentExecuted`: When a payment is successfully processed
- `SubscriptionUpdated`: When subscription amount is updated

## Configuration

### Constants

- `MINIMUM_PAYMENT_AMOUNT`: 0.01 FLOW
- `MINIMUM_INTERVAL`: 1 day (86400 seconds)
- `MAXIMUM_INTERVAL`: 1 year (31536000 seconds)

### Storage Paths

- Subscription data: `/storage/flowSubsSubscriptions`
- Provider data: `/storage/flowSubsProviders`
- Public access: `/public/flowSubsSubscriptions`, `/public/flowSubsProviders`

## Testing

Use Flow CLI to test the contract:

```bash
# Run tests
flow test tests/FlowSubs_test.cdc

# Test on testnet
flow transactions send transactions/create_subscription.cdc --network testnet
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For questions or support, please open an issue on GitHub or contact the development team.
