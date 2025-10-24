// cancel_subscription.cdc
// Transaction to cancel a subscription

import FlowSubs from 0xFlowSubs

transaction(subscriptionId: UInt64) {
    prepare(acct: AuthAccount) {
        // Cancel the subscription directly on the contract
        FlowSubs.cancelSubscription(subscriptionId: subscriptionId)

        log("Cancelled subscription with ID: ".concat(subscriptionId.toString()))
    }
}

