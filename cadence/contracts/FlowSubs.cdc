access(all) contract FlowSubs {
    access(all) var subscriptionCounter: UInt64
    access(all) var subscriptions: {UInt64: Subscription}
    access(all) var providers: {Address: ProviderInfo}

    access(all) struct Subscription {
        access(all) let id: UInt64
        access(all) let subscriber: Address
        access(all) let provider: Address
        access(all) let amount: UFix64
        access(all) let interval: UFix64
        access(all) let nextPaymentTime: UFix64
        access(all) let isActive: Bool
        access(all) let createdAt: UFix64

        init(id: UInt64, subscriber: Address, provider: Address, amount: UFix64, interval: UFix64, nextPaymentTime: UFix64, isActive: Bool, createdAt: UFix64) {
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

    access(all) struct ProviderInfo {
        access(all) let address: Address
        access(all) let name: String
        access(all) let description: String
        access(all) let isActive: Bool

        init(address: Address, name: String, description: String, isActive: Bool) {
            self.address = address
            self.name = name
            self.description = description
            self.isActive = isActive
        }
    }

    init() {
        self.subscriptionCounter = 0
        self.subscriptions = {}
        self.providers = {}
    }

    access(all) fun createSubscription(subscriber: Address, provider: Address, amount: UFix64, interval: UFix64): UInt64 {
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
        return subscriptionId
    }

    access(all) fun cancelSubscription(subscriptionId: UInt64) {
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
        }
    }

    access(all) fun registerProvider(name: String, description: String) {
        let providerInfo = ProviderInfo(
            address: self.account.address,
            name: name,
            description: description,
            isActive: true
        )

        self.providers[self.account.address] = providerInfo
    }

    access(all) fun getSubscription(subscriptionId: UInt64): Subscription? {
        return self.subscriptions[subscriptionId]
    }

    access(all) fun getSubscriberSubscriptions(subscriber: Address): [Subscription] {
        var subscriberSubscriptions: [Subscription] = []
        for subscription in self.subscriptions.values {
            if subscription.subscriber == subscriber {
                subscriberSubscriptions.append(subscription)
            }
        }
        return subscriberSubscriptions
    }

    access(all) fun getProviderSubscriptions(provider: Address): [Subscription] {
        var providerSubs: [Subscription] = []
        for subscription in self.subscriptions.values {
            if subscription.provider == provider && subscription.isActive {
                providerSubs.append(subscription)
            }
        }
        return providerSubs
    }

    access(all) fun getAllProviders(): [ProviderInfo] {
        var allProviders: [ProviderInfo] = []
        for provider in self.providers.values {
            allProviders.append(provider)
        }
        return allProviders
    }

    access(all) fun getDueSubscriptions(): [UInt64] {
        var dueSubscriptionIds: [UInt64] = []
        let currentTime = getCurrentBlock().timestamp
        
        for subscriptionId in self.subscriptions.keys {
            if let subscription = self.subscriptions[subscriptionId] {
                if subscription.isActive && currentTime >= subscription.nextPaymentTime {
                    dueSubscriptionIds.append(subscriptionId)
                }
            }
        }
        return dueSubscriptionIds
    }
}

