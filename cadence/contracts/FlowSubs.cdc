pub contract FlowSubs {
    pub var subscriptionCounter: UInt64
    pub var subscriptions: {UInt64: Subscription}
    pub var providers: {Address: ProviderInfo}

    pub struct Subscription {
        pub let id: UInt64
        pub let subscriber: Address
        pub let provider: Address
        pub let amount: UFix64
        pub let interval: UFix64
        pub let nextPaymentTime: UFix64
        pub let isActive: Bool
        pub let createdAt: UFix64

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

    init() {
        self.subscriptionCounter = 0
        self.subscriptions = {}
        self.providers = {}
    }

    pub fun createSubscription(subscriber: Address, provider: Address, amount: UFix64, interval: UFix64): UInt64 {
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

    pub fun getAllProviders(): [ProviderInfo] {
        var allProviders: [ProviderInfo] = []
        for provider in self.providers.values {
            allProviders.append(provider)
        }
        return allProviders
    }
}

