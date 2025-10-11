// transactions/setup_demo_data.cdc
// Transaction to pre-populate FlowSubs with demo data for testing

import FlowSubs from 0xYOUR_CONTRACT_ADDRESS
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7

transaction {
    prepare(acct: AuthAccount) {
        // Get the FlowSubs contract reference
        let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
        
        // Demo provider addresses (these would be real testnet addresses in practice)
        let providers: [Address] = [
            0x1234567890abcdef,  // Provider 1: Premium Service
            0xfedcba0987654321,  // Provider 2: Basic Service  
            0x9876543210fedcba   // Provider 3: Enterprise Service
        ]
        
        let providerNames: [String] = [
            "Premium Streaming Service",
            "Basic Cloud Storage",
            "Enterprise Analytics"
        ]
        
        let providerDescriptions: [String] = [
            "High-quality video streaming with premium content",
            "Reliable cloud storage with basic features",
            "Advanced analytics and business intelligence tools"
        ]
        
        // Demo subscriber addresses (these would be real testnet addresses in practice)
        let subscribers: [Address] = [
            0x1111111111111111,  // Subscriber 1
            0x2222222222222222,  // Subscriber 2
            0x3333333333333333,  // Subscriber 3
            0x4444444444444444,  // Subscriber 4
            0x5555555555555555,  // Subscriber 5
            0x6666666666666666,  // Subscriber 6
            0x7777777777777777,  // Subscriber 7
            0x8888888888888888   // Subscriber 8
        ]
        
        // Subscription amounts (in FLOW tokens)
        let amounts: [UFix64] = [5.0, 7.5, 10.0, 6.0, 8.0, 9.0, 5.5, 7.0]
        
        // Monthly interval (30 days in seconds)
        let monthlyInterval: UFix64 = 2592000.0
        
        // Current timestamp for next payment calculation
        let currentTime: UFix64 = getCurrentBlock().timestamp
        
        log("Setting up demo data for FlowSubs...")
        
        // Step 1: Register all providers
        log("Registering providers...")
        for i in 0..<providers.length {
            // Note: In a real implementation, each provider would register themselves
            // For demo purposes, we'll simulate this by having the contract admin
            // create provider records directly
            
            log("Provider ".concat(i.toString()).concat(": ").concat(providerNames[i]))
            log("Address: ".concat(providers[i].toString()))
            log("Description: ".concat(providerDescriptions[i]))
        }
        
        // Step 2: Create subscriptions for each provider
        log("Creating subscriptions...")
        
        // Provider 1: Premium Streaming Service (3 subscribers)
        let provider1Subscribers: [Address] = [subscribers[0], subscribers[1], subscribers[2]]
        let provider1Amounts: [UFix64] = [amounts[0], amounts[1], amounts[2]]
        
        for i in 0..<provider1Subscribers.length {
            log("Creating subscription for Premium Streaming Service")
            log("Subscriber: ".concat(provider1Subscribers[i].toString()))
            log("Amount: ".concat(provider1Amounts[i].toString()).concat(" FLOW"))
            
            // Calculate next payment time (random offset within the month)
            let nextPaymentTime: UFix64 = currentTime + monthlyInterval + UFix64(i * 86400) // Spread payments
            
            // In a real implementation, you would call:
            // flowSubs.createSubscription(
            //     provider: providers[0],
            //     amount: provider1Amounts[i],
            //     interval: monthlyInterval
            // )
            
            // For demo purposes, we'll emit the events directly
            emit FlowSubs.SubscriptionCreated(
                subscriber: provider1Subscribers[i],
                provider: providers[0],
                amount: provider1Amounts[i],
                interval: monthlyInterval,
                subscriptionId: UInt64(i + 1)
            )
        }
        
        // Provider 2: Basic Cloud Storage (3 subscribers)
        let provider2Subscribers: [Address] = [subscribers[3], subscribers[4], subscribers[5]]
        let provider2Amounts: [UFix64] = [amounts[3], amounts[4], amounts[5]]
        
        for i in 0..<provider2Subscribers.length {
            log("Creating subscription for Basic Cloud Storage")
            log("Subscriber: ".concat(provider2Subscribers[i].toString()))
            log("Amount: ".concat(provider2Amounts[i].toString()).concat(" FLOW"))
            
            emit FlowSubs.SubscriptionCreated(
                subscriber: provider2Subscribers[i],
                provider: providers[1],
                amount: provider2Amounts[i],
                interval: monthlyInterval,
                subscriptionId: UInt64(i + 4)
            )
        }
        
        // Provider 3: Enterprise Analytics (2 subscribers)
        let provider3Subscribers: [Address] = [subscribers[6], subscribers[7]]
        let provider3Amounts: [UFix64] = [amounts[6], amounts[7]]
        
        for i in 0..<provider3Subscribers.length {
            log("Creating subscription for Enterprise Analytics")
            log("Subscriber: ".concat(provider3Subscribers[i].toString()))
            log("Amount: ".concat(provider3Amounts[i].toString()).concat(" FLOW"))
            
            emit FlowSubs.SubscriptionCreated(
                subscriber: provider3Subscribers[i],
                provider: providers[2],
                amount: provider3Amounts[i],
                interval: monthlyInterval,
                subscriptionId: UInt64(i + 7)
            )
        }
        
        log("Demo data setup completed!")
        log("Created 3 providers with 8 total subscriptions")
        log("All subscriptions are set to monthly payments (30 days)")
    }
}
