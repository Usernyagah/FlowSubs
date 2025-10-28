// create_subscription.cdc
// Transaction to create a new subscription

import FlowSubs from 0xFlowSubs

transaction(
    provider: Address,
    amount: UFix64,
    interval: UFix64
) {
    prepare(acct: AuthAccount) {
        // Create the subscription directly on the contract
        // Note: User must have a FlowToken vault set up before using this transaction
        let subscriptionId = FlowSubs.createSubscription(
            subscriber: acct.address,
            provider: provider,
            amount: amount,
            interval: interval
        )

        log("Created subscription with ID: ".concat(subscriptionId.toString()))
    }
}

