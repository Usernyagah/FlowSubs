// tests/FlowSubs_DemoData_test.cdc
// Comprehensive tests for FlowSubs demo data functionality

import Test
import FlowSubs from 0x01
import FlowToken from 0x02
import FungibleToken from 0x03

pub fun testContractDeployment() {
    // Test that FlowSubs contract deploys successfully
    let flowSubs = Test.deployContract(
        name: "FlowSubs",
        path: "contracts/FlowSubs.cdc",
        arguments: []
    )
    
    // Verify contract is deployed
    assert(flowSubs != nil, message: "FlowSubs contract failed to deploy")
    
    // Test basic contract functionality
    let providers = flowSubs.getAllProviders()
    assert(providers.length == 0, message: "Initial providers should be empty")
    
    log("✅ Contract deployment test passed")
}

pub fun testProviderRegistration() {
    // Setup test accounts
    let provider1 = Test.createAccount()
    let provider2 = Test.createAccount()
    let provider3 = Test.createAccount()
    
    // Deploy contract
    let flowSubs = Test.deployContract(
        name: "FlowSubs",
        path: "contracts/FlowSubs.cdc",
        arguments: []
    )
    
    // Register providers
    Test.runTransaction(
        transaction: {
            prepare(acct: AuthAccount) {
                let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                flowSubs.registerProvider(
                    name: "Premium Streaming Service",
                    description: "High-quality video streaming with premium content"
                )
            }
        },
        signers: [provider1]
    )
    
    Test.runTransaction(
        transaction: {
            prepare(acct: AuthAccount) {
                let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                flowSubs.registerProvider(
                    name: "Basic Cloud Storage",
                    description: "Reliable cloud storage with basic features"
                )
            }
        },
        signers: [provider2]
    )
    
    Test.runTransaction(
        transaction: {
            prepare(acct: AuthAccount) {
                let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                flowSubs.registerProvider(
                    name: "Enterprise Analytics",
                    description: "Advanced analytics and business intelligence tools"
                )
            }
        },
        signers: [provider3]
    )
    
    // Verify providers are registered
    let providers = flowSubs.getAllProviders()
    assert(providers.length == 3, message: "Expected 3 providers, got ".concat(providers.length.toString()))
    
    // Verify provider details
    let provider1Info = flowSubs.getProvider(provider: provider1.address)
    assert(provider1Info != nil, message: "Provider 1 not found")
    assert(provider1Info!.name == "Premium Streaming Service", message: "Wrong provider 1 name")
    
    let provider2Info = flowSubs.getProvider(provider: provider2.address)
    assert(provider2Info != nil, message: "Provider 2 not found")
    assert(provider2Info!.name == "Basic Cloud Storage", message: "Wrong provider 2 name")
    
    let provider3Info = flowSubs.getProvider(provider: provider3.address)
    assert(provider3Info != nil, message: "Provider 3 not found")
    assert(provider3Info!.name == "Enterprise Analytics", message: "Wrong provider 3 name")
    
    log("✅ Provider registration test passed")
}

pub fun testSubscriptionCreation() {
    // Setup test accounts
    let provider = Test.createAccount()
    let subscriber1 = Test.createAccount()
    let subscriber2 = Test.createAccount()
    let subscriber3 = Test.createAccount()
    
    // Deploy contract
    let flowSubs = Test.deployContract(
        name: "FlowSubs",
        path: "contracts/FlowSubs.cdc",
        arguments: []
    )
    
    // Register provider
    Test.runTransaction(
        transaction: {
            prepare(acct: AuthAccount) {
                let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                flowSubs.registerProvider(
                    name: "Test Provider",
                    description: "Test service provider"
                )
            }
        },
        signers: [provider]
    )
    
    // Create subscriptions with valid amounts (5-10 FLOW)
    let amounts: [UFix64] = [5.0, 7.5, 10.0]
    let subscribers: [Address] = [subscriber1.address, subscriber2.address, subscriber3.address]
    let monthlyInterval: UFix64 = 2592000.0 // 30 days
    
    for i in 0..<amounts.length {
        Test.runTransaction(
            transaction: {
                prepare(acct: AuthAccount) {
                    // Ensure FlowToken vault exists
                    if acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) == nil {
                        acct.save(FlowToken.createEmptyVault(), to: /storage/flowTokenVault)
                        acct.link<&{FungibleToken.Receiver}>(
                            /public/flowTokenReceiver,
                            target: /storage/flowTokenVault
                        )
                        acct.link<&{FungibleToken.Balance}>(
                            /public/flowTokenBalance,
                            target: /storage/flowTokenVault
                        )
                    }
                    
                    let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                    let subscriptionId = flowSubs.createSubscription(
                        provider: provider.address,
                        amount: amounts[i],
                        interval: monthlyInterval
                    )
                    
                    log("Created subscription ID: ".concat(subscriptionId.toString()))
                }
            },
            signers: [subscribers[i]]
        )
    }
    
    // Verify subscriptions are created
    let providerSubscriptions = flowSubs.getProviderSubscriptions(provider: provider.address)
    assert(providerSubscriptions.length == 3, message: "Expected 3 subscriptions, got ".concat(providerSubscriptions.length.toString()))
    
    // Verify subscription details
    for i in 0..<providerSubscriptions.length {
        let subscription = providerSubscriptions[i]
        assert(subscription.amount >= 5.0, message: "Amount too low: ".concat(subscription.amount.toString()))
        assert(subscription.amount <= 10.0, message: "Amount too high: ".concat(subscription.amount.toString()))
        assert(subscription.interval == monthlyInterval, message: "Wrong interval")
        assert(subscription.provider == provider.address, message: "Wrong provider")
        assert(subscription.isActive, message: "Subscription should be active")
    }
    
    log("✅ Subscription creation test passed")
}

pub fun testInvalidSubscriptionAmounts() {
    // Setup test accounts
    let provider = Test.createAccount()
    let subscriber = Test.createAccount()
    
    // Deploy contract
    let flowSubs = Test.deployContract(
        name: "FlowSubs",
        path: "contracts/FlowSubs.cdc",
        arguments: []
    )
    
    // Register provider
    Test.runTransaction(
        transaction: {
            prepare(acct: AuthAccount) {
                let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                flowSubs.registerProvider(
                    name: "Test Provider",
                    description: "Test service provider"
                )
            }
        },
        signers: [provider]
    )
    
    // Test negative amount
    Test.expectFailure(
        fun() {
            Test.runTransaction(
                transaction: {
                    prepare(acct: AuthAccount) {
                        let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                        flowSubs.createSubscription(
                            provider: provider.address,
                            amount: -1.0,
                            interval: 2592000.0
                        )
                    }
                },
                signers: [subscriber]
            )
        },
        message: "Should reject negative amount"
    )
    
    // Test zero amount
    Test.expectFailure(
        fun() {
            Test.runTransaction(
                transaction: {
                    prepare(acct: AuthAccount) {
                        let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                        flowSubs.createSubscription(
                            provider: provider.address,
                            amount: 0.0,
                            interval: 2592000.0
                        )
                    }
                },
                signers: [subscriber]
            )
        },
        message: "Should reject zero amount"
    )
    
    // Test amount below minimum
    Test.expectFailure(
        fun() {
            Test.runTransaction(
                transaction: {
                    prepare(acct: AuthAccount) {
                        let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                        flowSubs.createSubscription(
                            provider: provider.address,
                            amount: 0.005, // Below 0.01 minimum
                            interval: 2592000.0
                        )
                    }
                },
                signers: [subscriber]
            )
        },
        message: "Should reject amount below minimum"
    )
    
    log("✅ Invalid subscription amounts test passed")
}

pub fun testDuplicateSubscriptions() {
    // Setup test accounts
    let provider = Test.createAccount()
    let subscriber = Test.createAccount()
    
    // Deploy contract
    let flowSubs = Test.deployContract(
        name: "FlowSubs",
        path: "contracts/FlowSubs.cdc",
        arguments: []
    )
    
    // Register provider
    Test.runTransaction(
        transaction: {
            prepare(acct: AuthAccount) {
                let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                flowSubs.registerProvider(
                    name: "Test Provider",
                    description: "Test service provider"
                )
            }
        },
        signers: [provider]
    )
    
    // Create first subscription
    Test.runTransaction(
        transaction: {
            prepare(acct: AuthAccount) {
                // Ensure FlowToken vault exists
                if acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) == nil {
                    acct.save(FlowToken.createEmptyVault(), to: /storage/flowTokenVault)
                    acct.link<&{FungibleToken.Receiver}>(
                        /public/flowTokenReceiver,
                        target: /storage/flowTokenVault
                    )
                    acct.link<&{FungibleToken.Balance}>(
                        /public/flowTokenBalance,
                        target: /storage/flowTokenVault
                    )
                }
                
                let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                flowSubs.createSubscription(
                    provider: provider.address,
                    amount: 5.0,
                    interval: 2592000.0
                )
            }
        },
        signers: [subscriber]
    )
    
    // Verify first subscription exists
    let subscriptions = flowSubs.getSubscriberSubscriptions(subscriber: subscriber.address)
    assert(subscriptions.length == 1, message: "First subscription not created")
    
    // Note: In the current contract implementation, duplicate subscriptions are allowed
    // If you want to prevent duplicates, you'd need to add that logic to the contract
    // For now, we'll test that multiple subscriptions to the same provider are allowed
    
    // Create second subscription to same provider (this should work in current implementation)
    Test.runTransaction(
        transaction: {
            prepare(acct: AuthAccount) {
                let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                flowSubs.createSubscription(
                    provider: provider.address,
                    amount: 7.5,
                    interval: 2592000.0
                )
            }
        },
        signers: [subscriber]
    )
    
    // Verify both subscriptions exist
    let updatedSubscriptions = flowSubs.getSubscriberSubscriptions(subscriber: subscriber.address)
    assert(updatedSubscriptions.length == 2, message: "Second subscription not created")
    
    log("✅ Duplicate subscriptions test passed (multiple subscriptions allowed)")
}

pub fun testDemoDataStructure() {
    // Setup test accounts
    let providers: [Address] = []
    let subscribers: [Address] = []
    
    // Create 3 providers
    for i in 0..<3 {
        let provider = Test.createAccount()
        providers.append(provider.address)
    }
    
    // Create 8 subscribers
    for i in 0..<8 {
        let subscriber = Test.createAccount()
        subscribers.append(subscriber.address)
    }
    
    // Deploy contract
    let flowSubs = Test.deployContract(
        name: "FlowSubs",
        path: "contracts/FlowSubs.cdc",
        arguments: []
    )
    
    // Register all providers
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
    
    for i in 0..<providers.length {
        Test.runTransaction(
            transaction: {
                prepare(acct: AuthAccount) {
                    let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                    flowSubs.registerProvider(
                        name: providerNames[i],
                        description: providerDescriptions[i]
                    )
                }
            },
            signers: [providers[i]]
        )
    }
    
    // Create subscriptions following demo data pattern
    let amounts: [UFix64] = [5.0, 7.5, 10.0, 6.0, 8.0, 9.0, 5.5, 7.0]
    let monthlyInterval: UFix64 = 2592000.0
    
    for i in 0..<subscribers.length {
        let providerIndex = i / 3 // Distribute across providers
        let providerAddress = providers[providerIndex]
        
        Test.runTransaction(
            transaction: {
                prepare(acct: AuthAccount) {
                    // Ensure FlowToken vault exists
                    if acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) == nil {
                        acct.save(FlowToken.createEmptyVault(), to: /storage/flowTokenVault)
                        acct.link<&{FungibleToken.Receiver}>(
                            /public/flowTokenReceiver,
                            target: /storage/flowTokenVault
                        )
                        acct.link<&{FungibleToken.Balance}>(
                            /public/flowTokenBalance,
                            target: /storage/flowTokenVault
                        )
                    }
                    
                    let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                    flowSubs.createSubscription(
                        provider: providerAddress,
                        amount: amounts[i],
                        interval: monthlyInterval
                    )
                }
            },
            signers: [subscribers[i]]
        )
    }
    
    // Verify demo data structure
    let allProviders = flowSubs.getAllProviders()
    assert(allProviders.length == 3, message: "Expected 3 providers, got ".concat(allProviders.length.toString()))
    
    // Verify each provider has 2-3 subscribers
    for provider in providers {
        let providerSubscriptions = flowSubs.getProviderSubscriptions(provider: provider)
        assert(providerSubscriptions.length >= 2, message: "Provider must have at least 2 subscribers")
        assert(providerSubscriptions.length <= 3, message: "Provider must have at most 3 subscribers")
        
        // Verify subscription amounts are within 5-10 FLOW range
        for subscription in providerSubscriptions {
            assert(subscription.amount >= 5.0, message: "Amount too low: ".concat(subscription.amount.toString()))
            assert(subscription.amount <= 10.0, message: "Amount too high: ".concat(subscription.amount.toString()))
            assert(subscription.interval == monthlyInterval, message: "Wrong interval")
            assert(subscription.isActive, message: "Subscription should be active")
        }
    }
    
    // Verify total subscriptions count
    let totalSubscriptions = 0
    for provider in providers {
        let providerSubscriptions = flowSubs.getProviderSubscriptions(provider: provider)
        totalSubscriptions = totalSubscriptions + providerSubscriptions.length
    }
    assert(totalSubscriptions == 8, message: "Expected 8 total subscriptions, got ".concat(totalSubscriptions.toString()))
    
    log("✅ Demo data structure test passed")
    log("  Providers: ".concat(allProviders.length.toString()))
    log("  Total Subscriptions: ".concat(totalSubscriptions.toString()))
}

pub fun testSubscriptionEvents() {
    // Setup test accounts
    let provider = Test.createAccount()
    let subscriber = Test.createAccount()
    
    // Deploy contract
    let flowSubs = Test.deployContract(
        name: "FlowSubs",
        path: "contracts/FlowSubs.cdc",
        arguments: []
    )
    
    // Register provider
    Test.runTransaction(
        transaction: {
            prepare(acct: AuthAccount) {
                let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                flowSubs.registerProvider(
                    name: "Test Provider",
                    description: "Test service provider"
                )
            }
        },
        signers: [provider]
    )
    
    // Create subscription and verify event emission
    let result = Test.runTransaction(
        transaction: {
            prepare(acct: AuthAccount) {
                // Ensure FlowToken vault exists
                if acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) == nil {
                    acct.save(FlowToken.createEmptyVault(), to: /storage/flowTokenVault)
                    acct.link<&{FungibleToken.Receiver}>(
                        /public/flowTokenReceiver,
                        target: /storage/flowTokenVault
                    )
                    acct.link<&{FungibleToken.Balance}>(
                        /public/flowTokenBalance,
                        target: /storage/flowTokenVault
                    )
                }
                
                let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                flowSubs.createSubscription(
                    provider: provider.address,
                    amount: 8.0,
                    interval: 2592000.0
                )
            }
        },
        signers: [subscriber]
    )
    
    // Verify SubscriptionCreated event was emitted
    let events = result.events
    var subscriptionCreatedFound = false
    
    for event in events {
        if event.type == "A.01.FlowSubs.SubscriptionCreated" {
            subscriptionCreatedFound = true
            log("✅ SubscriptionCreated event emitted")
            break
        }
    }
    
    assert(subscriptionCreatedFound, message: "SubscriptionCreated event not emitted")
    
    log("✅ Subscription events test passed")
}

pub fun testQueryFunctions() {
    // Setup test accounts
    let provider = Test.createAccount()
    let subscriber1 = Test.createAccount()
    let subscriber2 = Test.createAccount()
    
    // Deploy contract
    let flowSubs = Test.deployContract(
        name: "FlowSubs",
        path: "contracts/FlowSubs.cdc",
        arguments: []
    )
    
    // Register provider
    Test.runTransaction(
        transaction: {
            prepare(acct: AuthAccount) {
                let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                flowSubs.registerProvider(
                    name: "Test Provider",
                    description: "Test service provider"
                )
            }
        },
        signers: [provider]
    )
    
    // Create subscriptions
    let amounts: [UFix64] = [5.0, 7.5]
    let subscribers: [Address] = [subscriber1.address, subscriber2.address]
    
    for i in 0..<subscribers.length {
        Test.runTransaction(
            transaction: {
                prepare(acct: AuthAccount) {
                    // Ensure FlowToken vault exists
                    if acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) == nil {
                        acct.save(FlowToken.createEmptyVault(), to: /storage/flowTokenVault)
                        acct.link<&{FungibleToken.Receiver}>(
                            /public/flowTokenReceiver,
                            target: /storage/flowTokenVault
                        )
                        acct.link<&{FungibleToken.Balance}>(
                            /public/flowTokenBalance,
                            target: /storage/flowTokenVault
                        )
                    }
                    
                    let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                    flowSubs.createSubscription(
                        provider: provider.address,
                        amount: amounts[i],
                        interval: 2592000.0
                    )
                }
            },
            signers: [subscribers[i]]
        )
    }
    
    // Test getAllProviders query
    let allProviders = flowSubs.getAllProviders()
    assert(allProviders.length == 1, message: "Expected 1 provider")
    assert(allProviders[0].name == "Test Provider", message: "Wrong provider name")
    
    // Test getProvider query
    let providerInfo = flowSubs.getProvider(provider: provider.address)
    assert(providerInfo != nil, message: "Provider not found")
    assert(providerInfo!.name == "Test Provider", message: "Wrong provider name")
    
    // Test getProviderSubscriptions query
    let providerSubscriptions = flowSubs.getProviderSubscriptions(provider: provider.address)
    assert(providerSubscriptions.length == 2, message: "Expected 2 subscriptions for provider")
    
    // Test getSubscriberSubscriptions query
    let subscriber1Subscriptions = flowSubs.getSubscriberSubscriptions(subscriber: subscriber1.address)
    assert(subscriber1Subscriptions.length == 1, message: "Expected 1 subscription for subscriber1")
    assert(subscriber1Subscriptions[0].amount == 5.0, message: "Wrong amount for subscriber1")
    
    let subscriber2Subscriptions = flowSubs.getSubscriberSubscriptions(subscriber: subscriber2.address)
    assert(subscriber2Subscriptions.length == 1, message: "Expected 1 subscription for subscriber2")
    assert(subscriber2Subscriptions[0].amount == 7.5, message: "Wrong amount for subscriber2")
    
    log("✅ Query functions test passed")
}
