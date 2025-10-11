// transactions/deploy_contract_direct.cdc
// Deploy FlowSubs contract directly to Flow testnet

transaction {
    prepare(signer: AuthAccount) {
        // Contract code for FlowSubs
        let contractCode = \`
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

/// Provider information structure
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

/// Main FlowSubs contract
pub contract FlowSubs {
    // Storage paths
    pub let SubscriptionsStoragePath: StoragePath
    pub let ProvidersStoragePath: StoragePath
    pub let SubscriptionCounterStoragePath: StoragePath

    // Public capabilities
    pub let SubscriptionsPublicPath: PublicPath
    pub let ProvidersPublicPath: PublicPath

    // State variables
    pub var subscriptionCounter: UInt64
    pub var subscriptions: {UInt64: Subscription}
    pub var providers: {Address: ProviderInfo}

    // Initialize the contract
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

    // Create a new subscription
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

    // Cancel a subscription
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

    // Execute a payment for a subscription
    pub fun executePayment(subscriptionId: UInt64) {
        if let subscription = self.subscriptions[subscriptionId] {
            if subscription.isActive {
                // Update next payment time
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

    // Update subscription amount
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

    // Register as a provider
    pub fun registerProvider(name: String, description: String) {
        let providerInfo = ProviderInfo(
            address: self.account.address,
            name: name,
            description: description,
            isActive: true
        )

        self.providers[self.account.address] = providerInfo
    }

    // Get subscription by ID
    pub fun getSubscription(subscriptionId: UInt64): Subscription? {
        return self.subscriptions[subscriptionId]
    }

    // Get all subscriptions for a subscriber
    pub fun getSubscriberSubscriptions(subscriber: Address): [Subscription] {
        var subscriberSubscriptions: [Subscription] = []
        
        for subscription in self.subscriptions.values {
            if subscription.subscriber == subscriber {
                subscriberSubscriptions.append(subscription)
            }
        }
        
        return subscriberSubscriptions
    }

    // Get all subscriptions for a provider
    pub fun getProviderSubscriptions(provider: Address): [Subscription] {
        var providerSubscriptions: [Subscription] = []
        
        for subscription in self.subscriptions.values {
            if subscription.provider == provider {
                providerSubscriptions.append(subscription)
            }
        }
        
        return providerSubscriptions
    }

    // Get all providers
    pub fun getAllProviders(): [ProviderInfo] {
        var allProviders: [ProviderInfo] = []
        
        for provider in self.providers.values {
            allProviders.append(provider)
        }
        
        return allProviders
    }

    // Get provider by address
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
