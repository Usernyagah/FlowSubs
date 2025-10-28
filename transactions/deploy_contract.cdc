// deploy_contract.cdc
// Transaction to deploy the FlowSubs contract

// Import the contract code as a string
let contractCode: String = """
// FlowSubs.cdc
// Contract for managing subscriptions on Flow

import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

pub contract FlowSubs {
    // Contract events
    pub event ProviderRegistered(provider: Address, name: String, description: String)
    pub event SubscriptionCreated(subscriptionId: UInt64, subscriber: Address, provider: Address, amount: UFix64, interval: UFix64)
    pub event SubscriptionCancelled(subscriptionId: UInt64)
    
    // Provider resource
    pub resource Provider {
        pub let name: String
        pub let description: String
        pub let address: Address
        
        init(name: String, description: String, address: Address) {
            self.name = name
            self.description = description
            self.address = address
        }
    }
    
    // Subscription resource
    pub resource Subscription {
        pub let id: UInt64
        pub let subscriber: Address
        pub let provider: Address
        pub let amount: UFix64
        pub let interval: UFix64
        pub let createdAt: UFix64
        pub var active: Bool
        
        init(id: UInt64, subscriber: Address, provider: Address, amount: UFix64, interval: UFix64, timestamp: UFix64) {
            self.id = id
            self.subscriber = subscriber
            self.provider = provider
            self.amount = amount
            self.interval = interval
            self.createdAt = timestamp
            self.active = true
        }
    }
    
    // Storage paths
    pub let ProviderStoragePath: StoragePath
    pub let SubscriptionStoragePath: StoragePath
    
    // Public paths
    pub let ProviderPublicPath: PublicPath
    pub let SubscriptionPublicPath: PublicPath
    
    // Contract state
    pub var nextSubscriptionId: UInt64
    pub let admin: Address
    
    // Initialize the contract
    init() {
        self.ProviderStoragePath = /storage/flowSubsProviders
        self.SubscriptionStoragePath = /storage/flowSubsSubscriptions
        self.ProviderPublicPath = /public/flowSubsProviders
        self.SubscriptionPublicPath = /public/flowSubsSubscriptions
        self.nextSubscriptionId = 1
        self.admin = self.account.address
        
        // Initialize storage
        self.account.save<@FlowSubs.Provider>(<- create Provider(name: "", description: "", address: self.account.address), to: self.ProviderStoragePath)
        self.account.link<&FlowSubs.Provider>(self.ProviderPublicPath, target: self.ProviderStoragePath)
    }
    
    // Register a new provider
    pub fun registerProvider(name: String, description: String) {
        let provider = Provider(name: name, description: description, address: self.account.address)
        self.account.save(<- provider, to: self.ProviderStoragePath)
        emit ProviderRegistered(provider: self.account.address, name: name, description: description)
    }
    
    // Create a new subscription
    pub fun createSubscription(subscriber: Address, provider: Address, amount: UFix64, interval: UFix64): UInt64 {
        let subscriptionId = self.nextSubscriptionId
        self.nextSubscriptionId = self.nextSubscriptionId + 1
        
        let subscription = Subscription(
            id: subscriptionId,
            subscriber: subscriber,
            provider: provider,
            amount: amount,
            interval: interval,
            timestamp: getCurrentBlock().timestamp
        )
        
        // Store the subscription (implementation depends on your storage structure)
        // ...
        
        emit SubscriptionCreated(
            subscriptionId: subscriptionId,
            subscriber: subscriber,
            provider: provider,
            amount: amount,
            interval: interval
        )
        
        return subscriptionId
    }
    
    // Cancel a subscription
    pub fun cancelSubscription(subscriptionId: UInt64) {
        // Implementation to cancel subscription
        // ...
        
        emit SubscriptionCancelled(subscriptionId: subscriptionId)
    }
}
"""

transaction {
    prepare(acct: AuthAccount) {
        // Deploy the contract
        let err = acct.contracts.add(
            name: "FlowSubs",
            code: contractCode.decodeHex()
        )
        
        if err != nil {
            panic("Failed to deploy contract: ".concat(err!.message))
        }
        
        log("Successfully deployed FlowSubs contract")
    }
    
    execute {
        log("Contract deployment transaction executed")
    }
}

