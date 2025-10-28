// transactions/create_demo_subscription.cdc
// Transaction to create a demo subscription

import FlowSubs from 0xYOUR_CONTRACT_ADDRESS

transaction(
    provider: Address,
    amount: UFix64,
    interval: UFix64
) {
    prepare(acct: AuthAccount) {
        // Note: User must have a FlowToken vault set up before using this transaction
        
        // Get the FlowSubs contract reference
        let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
        
        // Create the subscription
        let subscriptionId = flowSubs.createSubscription(
            subscriber: acct.address,
            provider: provider,
            amount: amount,
            interval: interval
        )

        log("Created subscription with ID: ".concat(subscriptionId.toString()))
        log("Provider: ".concat(provider.toString()))
        log("Amount: ".concat(amount.toString()).concat(" FLOW"))
        log("Interval: ".concat(interval.toString()).concat(" seconds"))
        log("Subscriber: ".concat(acct.address.toString()))
    }
}
