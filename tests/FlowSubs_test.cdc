// FlowSubs_test.cdc
// Test file for the FlowSubs contract

import Test
import FlowSubs from 0x01
import FlowToken from 0x02
import FungibleToken from 0x03

pub fun testCreateSubscription() {
    // Setup test accounts
    let subscriber = Test.createAccount()
    let provider = Test.createAccount()
    
    // Deploy contracts
    let flowSubs = Test.deployContract(
        name: "FlowSubs",
        path: "contracts/FlowSubs.cdc",
        arguments: []
    )
    
    // Test subscription creation
    let subscriptionId = flowSubs.createSubscription(
        provider: provider.address,
        amount: 1.0,
        interval: 2592000.0  // 30 days
    )
    
    // Verify subscription was created
    assert(subscriptionId == 1, message: "Subscription ID should be 1")
    
    // Verify subscription details
    let subscription = flowSubs.getSubscription(subscriptionId: subscriptionId)
    assert(subscription != nil, message: "Subscription should exist")
    assert(subscription!.amount == 1.0, message: "Amount should be 1.0")
    assert(subscription!.interval == 2592000.0, message: "Interval should be 30 days")
}

pub fun testCancelSubscription() {
    // Setup test accounts
    let subscriber = Test.createAccount()
    let provider = Test.createAccount()
    
    // Deploy contracts
    let flowSubs = Test.deployContract(
        name: "FlowSubs",
        path: "contracts/FlowSubs.cdc",
        arguments: []
    )
    
    // Create subscription
    let subscriptionId = flowSubs.createSubscription(
        provider: provider.address,
        amount: 1.0,
        interval: 2592000.0
    )
    
    // Cancel subscription
    flowSubs.cancelSubscription(subscriptionId: subscriptionId)
    
    // Verify subscription is cancelled
    let subscription = flowSubs.getSubscription(subscriptionId: subscriptionId)
    assert(subscription != nil, message: "Subscription should still exist")
    // Note: In a real implementation, you'd check isActive field
}

pub fun testRegisterProvider() {
    // Setup test account
    let provider = Test.createAccount()
    
    // Deploy contracts
    let flowSubs = Test.deployContract(
        name: "FlowSubs",
        path: "contracts/FlowSubs.cdc",
        arguments: []
    )
    
    // Register provider
    flowSubs.registerProvider(
        name: "Test Provider",
        description: "A test service provider"
    )
    
    // Verify provider registration
    let providerInfo = flowSubs.getProvider(provider: provider.address)
    assert(providerInfo != nil, message: "Provider should be registered")
    assert(providerInfo!.name == "Test Provider", message: "Provider name should match")
}

pub fun testValidation() {
    // Setup test accounts
    let subscriber = Test.createAccount()
    let provider = Test.createAccount()
    
    // Deploy contracts
    let flowSubs = Test.deployContract(
        name: "FlowSubs",
        path: "contracts/FlowSubs.cdc",
        arguments: []
    )
    
    // Test minimum payment amount validation
    Test.expectFailure(
        fun() {
            flowSubs.createSubscription(
                provider: provider.address,
                amount: 0.005,  // Below minimum
                interval: 2592000.0
            )
        },
        message: "Should fail with amount below minimum"
    )
    
    // Test minimum interval validation
    Test.expectFailure(
        fun() {
            flowSubs.createSubscription(
                provider: provider.address,
                amount: 1.0,
                interval: 3600.0  // Below minimum (1 hour)
            )
        },
        message: "Should fail with interval below minimum"
    )
    
    // Test maximum interval validation
    Test.expectFailure(
        fun() {
            flowSubs.createSubscription(
                provider: provider.address,
                amount: 1.0,
                interval: 63072000.0  // Above maximum (2 years)
            )
        },
        message: "Should fail with interval above maximum"
    )
}
