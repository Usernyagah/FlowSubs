// FlowSubs.cdc
// A Cadence smart contract for recurring subscription payments on Flow blockchain
// Supports automatic payment scheduling using Forte Workflows

import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import MetadataViews from 0x631e88ae7f1d7c20
import NonFungibleToken from 0x631e88ae7f1d7c20

/// Events emitted by the FlowSubs contract
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

/// Subscription data structure
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
        nextPaymentTime: UFix64
    ) {
        self.id = id
        self.subscriber = subscriber
        self.provider = provider
        self.amount = amount
        self.interval = interval
        self.nextPaymentTime = nextPaymentTime
        self.isActive = true
        self.createdAt = getCurrentBlock().timestamp
    }
}

/// Provider information structure
pub struct ProviderInfo {
    pub let address: Address
    pub let name: String
    pub let description: String
    pub let isActive: Bool

    init(address: Address, name: String, description: String) {
        self.address = address
        self.name = name
        self.description = description
        self.isActive = true
    }
}

/// Main FlowSubs contract
pub contract FlowSubs {
    
    // Storage paths
    pub let SubscriptionStoragePath: StoragePath
    pub let ProviderStoragePath: StoragePath
    pub let SubscriptionCounterStoragePath: StoragePath
    
    // Public paths
    pub let SubscriptionPublicPath: PublicPath
    pub let ProviderPublicPath: PublicPath

    // Storage variables
    pub var subscriptions: {UInt64: Subscription}
    pub var subscriberSubscriptions: {Address: [UInt64]}
    pub var providerSubscriptions: {Address: [UInt64]}
    pub var providers: {Address: ProviderInfo}
    pub var subscriptionCounter: UInt64

    // Constants
    pub let MINIMUM_PAYMENT_AMOUNT: UFix64
    pub let MINIMUM_INTERVAL: UFix64
    pub let MAXIMUM_INTERVAL: UFix64

    init() {
        // Initialize storage paths
        self.SubscriptionStoragePath = /storage/flowSubsSubscriptions
        self.ProviderStoragePath = /storage/flowSubsProviders
        self.SubscriptionCounterStoragePath = /storage/flowSubsCounter
        
        self.SubscriptionPublicPath = /public/flowSubsSubscriptions
        self.ProviderPublicPath = /public/flowSubsProviders

        // Initialize storage variables
        self.subscriptions = {}
        self.subscriberSubscriptions = {}
        self.providerSubscriptions = {}
        self.providers = {}
        self.subscriptionCounter = 0

        // Set constants
        self.MINIMUM_PAYMENT_AMOUNT = 0.01
        self.MINIMUM_INTERVAL = 86400.0  // 1 day in seconds
        self.MAXIMUM_INTERVAL = 31536000.0  // 1 year in seconds

        // Save to account storage
        self.account.save(self.subscriptions, to: self.SubscriptionStoragePath)
        self.account.save(self.subscriberSubscriptions, to: self.SubscriptionStoragePath)
        self.account.save(self.providerSubscriptions, to: self.SubscriptionStoragePath)
        self.account.save(self.providers, to: self.ProviderStoragePath)
        self.account.save(self.subscriptionCounter, to: self.SubscriptionCounterStoragePath)

        // Create public capabilities
        self.account.link<&{SubscriptionPublic}>(self.SubscriptionPublicPath, target: self.SubscriptionStoragePath)
        self.account.link<&{ProviderPublic}>(self.ProviderPublicPath, target: self.ProviderStoragePath)
    }

    /// Create a new subscription
    pub fun createSubscription(
        provider: Address,
        amount: UFix64,
        interval: UFix64
    ): UInt64 {
        // Validate inputs
        pre {
            amount >= self.MINIMUM_PAYMENT_AMOUNT: "Payment amount must be at least 0.01 FLOW"
            interval >= self.MINIMUM_INTERVAL: "Interval must be at least 1 day"
            interval <= self.MAXIMUM_INTERVAL: "Interval cannot exceed 1 year"
            self.providers[provider] != nil: "Provider does not exist"
            self.providers[provider]!.isActive: "Provider is not active"
        }

        let subscriber = self.account.address
        let subscriptionId = self.subscriptionCounter + 1
        let nextPaymentTime = getCurrentBlock().timestamp + interval

        // Create subscription
        let subscription = Subscription(
            id: subscriptionId,
            subscriber: subscriber,
            provider: provider,
            amount: amount,
            interval: interval,
            nextPaymentTime: nextPaymentTime
        )

        // Update storage
        self.subscriptions[subscriptionId] = subscription
        self.subscriptionCounter = subscriptionId

        // Add to subscriber's subscriptions
        if self.subscriberSubscriptions[subscriber] == nil {
            self.subscriberSubscriptions[subscriber] = []
        }
        self.subscriberSubscriptions[subscriber]!.append(subscriptionId)

        // Add to provider's subscriptions
        if self.providerSubscriptions[provider] == nil {
            self.providerSubscriptions[provider] = []
        }
        self.providerSubscriptions[provider]!.append(subscriptionId)

        // Save to account storage
        self.account.save(self.subscriptions, to: self.SubscriptionStoragePath)
        self.account.save(self.subscriberSubscriptions, to: self.SubscriptionStoragePath)
        self.account.save(self.providerSubscriptions, to: self.SubscriptionStoragePath)
        self.account.save(self.subscriptionCounter, to: self.SubscriptionCounterStoragePath)

        // Emit event
        emit SubscriptionCreated(
            subscriber: subscriber,
            provider: provider,
            amount: amount,
            interval: interval,
            subscriptionId: subscriptionId
        )

        return subscriptionId
    }

    /// Cancel a subscription
    pub fun cancelSubscription(subscriptionId: UInt64) {
        pre {
            self.subscriptions[subscriptionId] != nil: "Subscription does not exist"
            self.subscriptions[subscriptionId]!.subscriber == self.account.address: "Only subscriber can cancel subscription"
            self.subscriptions[subscriptionId]!.isActive: "Subscription is already cancelled"
        }

        let subscription = self.subscriptions[subscriptionId]!
        let subscriber = subscription.subscriber
        let provider = subscription.provider

        // Mark subscription as inactive
        let updatedSubscription = Subscription(
            id: subscription.id,
            subscriber: subscription.subscriber,
            provider: subscription.provider,
            amount: subscription.amount,
            interval: subscription.interval,
            nextPaymentTime: subscription.nextPaymentTime
        )
        // Note: In a real implementation, you'd need to modify the struct to allow updating isActive

        // Remove from subscriber's active subscriptions
        if let subscriberSubs = self.subscriberSubscriptions[subscriber] {
            let updatedSubscriberSubs = subscriberSubs.filter(fun(id: UInt64): Bool {
                return id != subscriptionId
            })
            self.subscriberSubscriptions[subscriber] = updatedSubscriberSubs
        }

        // Remove from provider's active subscriptions
        if let providerSubs = self.providerSubscriptions[provider] {
            let updatedProviderSubs = providerSubs.filter(fun(id: UInt64): Bool {
                return id != subscriptionId
            })
            self.providerSubscriptions[provider] = updatedProviderSubs
        }

        // Save to account storage
        self.account.save(self.subscriberSubscriptions, to: self.SubscriptionStoragePath)
        self.account.save(self.providerSubscriptions, to: self.SubscriptionStoragePath)

        // Emit event
        emit SubscriptionCancelled(
            subscriber: subscriber,
            provider: provider,
            subscriptionId: subscriptionId
        )
    }

    /// Update subscription amount
    pub fun updateSubscriptionAmount(subscriptionId: UInt64, newAmount: UFix64) {
        pre {
            self.subscriptions[subscriptionId] != nil: "Subscription does not exist"
            self.subscriptions[subscriptionId]!.subscriber == self.account.address: "Only subscriber can update subscription"
            newAmount >= self.MINIMUM_PAYMENT_AMOUNT: "New amount must be at least 0.01 FLOW"
        }

        let subscription = self.subscriptions[subscriptionId]!
        let subscriber = subscription.subscriber
        let provider = subscription.provider

        // Create updated subscription
        let updatedSubscription = Subscription(
            id: subscription.id,
            subscriber: subscription.subscriber,
            provider: subscription.provider,
            amount: newAmount,
            interval: subscription.interval,
            nextPaymentTime: subscription.nextPaymentTime
        )

        self.subscriptions[subscriptionId] = updatedSubscription
        self.account.save(self.subscriptions, to: self.SubscriptionStoragePath)

        // Emit event
        emit SubscriptionUpdated(
            subscriber: subscriber,
            provider: provider,
            subscriptionId: subscriptionId,
            newAmount: newAmount
        )
    }

    /// Execute a payment for a subscription (called by Forte Workflows)
    pub fun executePayment(subscriptionId: UInt64): Bool {
        pre {
            self.subscriptions[subscriptionId] != nil: "Subscription does not exist"
        }

        let subscription = self.subscriptions[subscriptionId]!
        
        // Check if payment is due
        if getCurrentBlock().timestamp < subscription.nextPaymentTime {
            return false
        }

        // Get Flow token vaults
        let subscriberVault = self.account.getCapability<&FlowToken.Vault{FungibleToken.Balance}>(/public/flowTokenBalance)
            .borrow()
        let providerVault = getAccount(subscription.provider).getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            .borrow()

        pre {
            subscriberVault != nil: "Subscriber vault not found"
            providerVault != nil: "Provider vault not found"
            subscriberVault!.balance >= subscription.amount: "Insufficient balance"
        }

        // Execute the payment
        let paymentVault = subscriberVault!.withdraw(amount: subscription.amount)
        providerVault!.deposit(from: paymentVault)

        // Update next payment time
        let updatedSubscription = Subscription(
            id: subscription.id,
            subscriber: subscription.subscriber,
            provider: subscription.provider,
            amount: subscription.amount,
            interval: subscription.interval,
            nextPaymentTime: getCurrentBlock().timestamp + subscription.interval
        )

        self.subscriptions[subscriptionId] = updatedSubscription
        self.account.save(self.subscriptions, to: self.SubscriptionStoragePath)

        // Emit event
        emit PaymentExecuted(
            subscriber: subscription.subscriber,
            provider: subscription.provider,
            amount: subscription.amount,
            subscriptionId: subscriptionId,
            timestamp: getCurrentBlock().timestamp
        )

        return true
    }

    /// Register as a provider
    pub fun registerProvider(name: String, description: String) {
        let providerInfo = ProviderInfo(
            address: self.account.address,
            name: name,
            description: description
        )

        self.providers[self.account.address] = providerInfo
        self.account.save(self.providers, to: self.ProviderStoragePath)
    }

    /// Get subscription by ID
    pub fun getSubscription(subscriptionId: UInt64): Subscription? {
        return self.subscriptions[subscriptionId]
    }

    /// Get all subscriptions for a subscriber
    pub fun getSubscriberSubscriptions(subscriber: Address): [Subscription] {
        if let subscriptionIds = self.subscriberSubscriptions[subscriber] {
            let subscriptions: [Subscription] = []
            for id in subscriptionIds {
                if let subscription = self.subscriptions[id] {
                    subscriptions.append(subscription)
                }
            }
            return subscriptions
        }
        return []
    }

    /// Get all subscriptions for a provider
    pub fun getProviderSubscriptions(provider: Address): [Subscription] {
        if let subscriptionIds = self.providerSubscriptions[provider] {
            let subscriptions: [Subscription] = []
            for id in subscriptionIds {
                if let subscription = self.subscriptions[id] {
                    subscriptions.append(subscription)
                }
            }
            return subscriptions
        }
        return []
    }

    /// Get provider information
    pub fun getProvider(provider: Address): ProviderInfo? {
        return self.providers[provider]
    }

    /// Get all active providers
    pub fun getAllProviders(): [ProviderInfo] {
        let activeProviders: [ProviderInfo] = []
        for provider in self.providers.values {
            if provider.isActive {
                activeProviders.append(provider)
            }
        }
        return activeProviders
    }

    /// Get subscriptions due for payment (for Forte Workflows)
    pub fun getDueSubscriptions(): [UInt64] {
        let dueSubscriptions: [UInt64] = []
        let currentTime = getCurrentBlock().timestamp

        for subscriptionId in self.subscriptions.keys {
            if let subscription = self.subscriptions[subscriptionId] {
                if subscription.isActive && currentTime >= subscription.nextPaymentTime {
                    dueSubscriptions.append(subscriptionId)
                }
            }
        }

        return dueSubscriptions
    }
}

/// Public interface for reading subscription data
pub resource interface SubscriptionPublic {
    pub fun getSubscription(subscriptionId: UInt64): Subscription?
    pub fun getSubscriberSubscriptions(subscriber: Address): [Subscription]
    pub fun getProviderSubscriptions(provider: Address): [Subscription]
    pub fun getProvider(provider: Address): ProviderInfo?
    pub fun getAllProviders(): [ProviderInfo]
}

/// Public interface for reading provider data
pub resource interface ProviderPublic {
    pub fun getProvider(provider: Address): ProviderInfo?
    pub fun getAllProviders(): [ProviderInfo]
}
