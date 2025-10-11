// cancel_subscription.cdc
// Transaction to cancel a subscription

import FlowSubs from 0xYOUR_CONTRACT_ADDRESS

transaction(subscriptionId: UInt64) {
    prepare(acct: AuthAccount) {
        // Get the FlowSubs contract reference
        let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
        
        // Cancel the subscription
        flowSubs.cancelSubscription(subscriptionId: subscriptionId)

        log("Cancelled subscription with ID: ".concat(subscriptionId.toString()))
    }
}

