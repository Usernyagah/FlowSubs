# 🚀 FLOWSUBS CONTRACT DEPLOYMENT

## Your Private Key
```
b9098df8816abc841a95eda6214e6cc95e6f4cf38bee0494e2e89fd36226efaf
```

## Quick Deployment Steps

### 1. Go to Flow Port
**URL**: https://testnet.flowport.io/

### 2. Connect Your Wallet
- Click "Connect Wallet"
- Select "Private Key" option
- Paste your private key: `b9098df8816abc841a95eda6214e6cc95e6f4cf38bee0494e2e89fd36226efaf`

### 3. Get Your Account Address
Execute this transaction to see your account address:
```cadence
transaction {
  prepare(signer: AuthAccount) {
    log("Account address: ".concat(signer.address.toString()))
  }
}
```

### 4. Deploy the Contract
Execute this deployment transaction:
```cadence
transaction {
    prepare(signer: AuthAccount) {
        // Contract code for FlowSubs
        let contractCode = \`
// FlowSubs.cdc - Complete contract code
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import MetadataViews from 0x631e88ae7f1d7c20
import NonFungibleToken from 0x631e88ae7f1d7c20

pub event SubscriptionCreated(
    subscriber: Address,
    provider: Address,
    amount: UFix64,
    interval: UFix64,
    subscriptionId: UInt64
)

pub event SubscriptionCancelled(
    subscriber: Address,
    provider: Address,
    subscriptionId: UInt64
)

pub event PaymentExecuted(
    subscriber: Address,
    provider: Address,
    amount: UFix64,
    subscriptionId: UInt64,
    timestamp: UFix64
)

pub event SubscriptionUpdated(
    subscriber: Address,
    provider: Address,
    subscriptionId: UInt64,
    newAmount: UFix64
)

pub struct Subscription {
    pub let id: UInt64
    pub let subscriber: Address
    pub let provider: Address
    pub let amount: UFix64
    pub let interval: UFix64
    pub let nextPaymentTime: UFix64
    pub let isActive: Bool
    pub let createdAt: UFix64

    init(
        id: UInt64,
        subscriber: Address,
        provider: Address,
        amount: UFix64,
        interval: UFix64,
        nextPaymentTime: UFix64,
        isActive: Bool,
        createdAt: UFix64
    ) {
        self.id = id
        self.subscriber = subscriber
        self.provider = provider
        self.amount = amount
        self.interval = interval
        self.nextPaymentTime = nextPaymentTime
        self.isActive = isActive
        self.createdAt = createdAt
    }
}

pub struct ProviderInfo {
    pub let address: Address
    pub let name: String
    pub let description: String
    pub let isActive: Bool

    init(address: Address, name: String, description: String, isActive: Bool) {
        self.address = address
        self.name = name
        self.description = description
        self.isActive = isActive
    }
}

pub contract FlowSubs {
    pub let SubscriptionsStoragePath: StoragePath
    pub let ProvidersStoragePath: StoragePath
    pub let SubscriptionCounterStoragePath: StoragePath
    pub let SubscriptionsPublicPath: PublicPath
    pub let ProvidersPublicPath: PublicPath

    pub var subscriptionCounter: UInt64
    pub var subscriptions: {UInt64: Subscription}
    pub var providers: {Address: ProviderInfo}

    init() {
        self.SubscriptionsStoragePath = /storage/FlowSubsSubscriptions
        self.ProvidersStoragePath = /storage/FlowSubsProviders
        self.SubscriptionCounterStoragePath = /storage/FlowSubsCounter
        self.SubscriptionsPublicPath = /public/FlowSubsSubscriptions
        self.ProvidersPublicPath = /public/FlowSubsProviders

        self.subscriptionCounter = 0
        self.subscriptions = {}
        self.providers = {}
    }

    pub fun createSubscription(
        subscriber: Address,
        provider: Address,
        amount: UFix64,
        interval: UFix64
    ): UInt64 {
        let subscriptionId = self.subscriptionCounter + 1
        self.subscriptionCounter = subscriptionId

        let subscription = Subscription(
            id: subscriptionId,
            subscriber: subscriber,
            provider: provider,
            amount: amount,
            interval: interval,
            nextPaymentTime: getCurrentBlock().timestamp + interval,
            isActive: true,
            createdAt: getCurrentBlock().timestamp
        )

        self.subscriptions[subscriptionId] = subscription

        emit SubscriptionCreated(
            subscriber: subscriber,
            provider: provider,
            amount: amount,
            interval: interval,
            subscriptionId: subscriptionId
        )

        return subscriptionId
    }

    pub fun cancelSubscription(subscriptionId: UInt64) {
        if let subscription = self.subscriptions[subscriptionId] {
            let cancelledSubscription = Subscription(
                id: subscription.id,
                subscriber: subscription.subscriber,
                provider: subscription.provider,
                amount: subscription.amount,
                interval: subscription.interval,
                nextPaymentTime: subscription.nextPaymentTime,
                isActive: false,
                createdAt: subscription.createdAt
            )

            self.subscriptions[subscriptionId] = cancelledSubscription

            emit SubscriptionCancelled(
                subscriber: subscription.subscriber,
                provider: subscription.provider,
                subscriptionId: subscriptionId
            )
        }
    }

    pub fun executePayment(subscriptionId: UInt64) {
        if let subscription = self.subscriptions[subscriptionId] {
            if subscription.isActive {
                let updatedSubscription = Subscription(
                    id: subscription.id,
                    subscriber: subscription.subscriber,
                    provider: subscription.provider,
                    amount: subscription.amount,
                    interval: subscription.interval,
                    nextPaymentTime: subscription.nextPaymentTime + subscription.interval,
                    isActive: subscription.isActive,
                    createdAt: subscription.createdAt
                )

                self.subscriptions[subscriptionId] = updatedSubscription

                emit PaymentExecuted(
                    subscriber: subscription.subscriber,
                    provider: subscription.provider,
                    amount: subscription.amount,
                    subscriptionId: subscriptionId,
                    timestamp: getCurrentBlock().timestamp
                )
            }
        }
    }

    pub fun updateSubscriptionAmount(subscriptionId: UInt64, newAmount: UFix64) {
        if let subscription = self.subscriptions[subscriptionId] {
            let updatedSubscription = Subscription(
                id: subscription.id,
                subscriber: subscription.subscriber,
                provider: subscription.provider,
                amount: newAmount,
                interval: subscription.interval,
                nextPaymentTime: subscription.nextPaymentTime,
                isActive: subscription.isActive,
                createdAt: subscription.createdAt
            )

            self.subscriptions[subscriptionId] = updatedSubscription

            emit SubscriptionUpdated(
                subscriber: subscription.subscriber,
                provider: subscription.provider,
                subscriptionId: subscriptionId,
                newAmount: newAmount
            )
        }
    }

    pub fun registerProvider(name: String, description: String) {
        let providerInfo = ProviderInfo(
            address: self.account.address,
            name: name,
            description: description,
            isActive: true
        )

        self.providers[self.account.address] = providerInfo
    }

    pub fun getSubscription(subscriptionId: UInt64): Subscription? {
        return self.subscriptions[subscriptionId]
    }

    pub fun getSubscriberSubscriptions(subscriber: Address): [Subscription] {
        var subscriberSubscriptions: [Subscription] = []
        
        for subscription in self.subscriptions.values {
            if subscription.subscriber == subscriber {
                subscriberSubscriptions.append(subscription)
            }
        }
        
        return subscriberSubscriptions
    }

    pub fun getProviderSubscriptions(provider: Address): [Subscription] {
        var providerSubscriptions: [Subscription] = []
        
        for subscription in self.subscriptions.values {
            if subscription.provider == provider {
                providerSubscriptions.append(subscription)
            }
        }
        
        return providerSubscriptions
    }

    pub fun getAllProviders(): [ProviderInfo] {
        var allProviders: [ProviderInfo] = []
        
        for provider in self.providers.values {
            allProviders.append(provider)
        }
        
        return allProviders
    }

    pub fun getProvider(address: Address): ProviderInfo? {
        return self.providers[address]
    }
}
\`

        // Deploy the contract
        let contract = Contract(name: "FlowSubs", code: contractCode)
        signer.contracts.add(name: "FlowSubs", code: contract.code)
        
        log("FlowSubs contract deployed successfully!")
        log("Contract address: ".concat(signer.address.toString()))
    }
}
```

### 5. After Deployment
1. **Copy the contract address** from the transaction logs
2. **Update your `.env.local`** file:
   ```env
   NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS=0xYourDeployedAddress
   ```
3. **Restart your development server**

## Expected Result
After deployment, you'll see logs like:
```
FlowSubs contract deployed successfully!
Contract address: 0x1234567890abcdef...
```

**Copy that address and update your configuration!**
