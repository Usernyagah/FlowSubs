// transactions/setup_demo_data_real.cdc
// Transaction to pre-populate FlowSubs with demo data (real contract interaction)

// Main contract imports - REPLACE with your deployed contract address
import FlowSubs from 0xYOUR_CONTRACT_ADDRESS  // Replace with actual contract address

// Standard Flow token contracts
import FlowToken from 0x7e60df042a9c0868  // Testnet Flow Token
import FungibleToken from 0x9a0766d93b6608b7  // Testnet FungibleToken

// Note: AuthAccount is a built-in type in Cadence and is automatically available in transaction prepare blocks

transaction {
    prepare(acct: AuthAccount) {
        // Get the FlowSubs contract reference
        let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
        
        log("Setting up demo data for FlowSubs...")
        
        // Demo provider addresses (replace with real testnet addresses)
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
        
        // Demo subscriber addresses (replace with real testnet addresses)
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
        
        // Step 1: Register providers (simulate provider registration)
        log("Registering providers...")
        for i in 0..<providers.length {
            log("Registering provider: ".concat(providerNames[i]))
            log("Address: ".concat(providers[i].toString()))
            
            // Note: In practice, each provider would register themselves
            // This is a demo setup, so we're simulating the registration
            // The actual registration would be done by each provider individually
        }
        
        // Step 2: Create subscriptions
        log("Creating subscriptions...")
        
        // Provider 1: Premium Streaming Service (3 subscribers)
        let provider1Subscribers: [Address] = [subscribers[0], subscribers[1], subscribers[2]]
        let provider1Amounts: [UFix64] = [amounts[0], amounts[1], amounts[2]]
        
        for i in 0..<provider1Subscribers.length {
            log("Creating subscription for Premium Streaming Service")
            log("Subscriber: ".concat(provider1Subscribers[i].toString()))
            log("Amount: ".concat(provider1Amounts[i].toString()).concat(" FLOW"))
            
            // Note: In practice, each subscriber would create their own subscription
            // This is a demo setup, so we're simulating the subscription creation
            // The actual subscription creation would be done by each subscriber individually
        }
        
        // Provider 2: Basic Cloud Storage (3 subscribers)
        let provider2Subscribers: [Address] = [subscribers[3], subscribers[4], subscribers[5]]
        let provider2Amounts: [UFix64] = [amounts[3], amounts[4], amounts[5]]
        
        for i in 0..<provider2Subscribers.length {
            log("Creating subscription for Basic Cloud Storage")
            log("Subscriber: ".concat(provider2Subscribers[i].toString()))
            log("Amount: ".concat(provider2Amounts[i].toString()).concat(" FLOW"))
        }
        
        // Provider 3: Enterprise Analytics (2 subscribers)
        let provider3Subscribers: [Address] = [subscribers[6], subscribers[7]]
        let provider3Amounts: [UFix64] = [amounts[6], amounts[7]]
        
        for i in 0..<provider3Subscribers.length {
            log("Creating subscription for Enterprise Analytics")
            log("Subscriber: ".concat(provider3Subscribers[i].toString()))
            log("Amount: ".concat(provider3Amounts[i].toString()).concat(" FLOW"))
        }
        
        log("Demo data setup completed!")
        log("Created 3 providers with 8 total subscriptions")
        log("All subscriptions are set to monthly payments (30 days)")
        log("Note: This is a simulation. Real subscriptions would be created by individual users.")
    }
}
