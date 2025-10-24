// get_subscription.cdc
// Script to get subscription details

import FlowSubs from 0xFlowSubs

pub fun main(subscriptionId: UInt64): FlowSubs.Subscription? {
    return FlowSubs.getSubscription(subscriptionId: subscriptionId)
}

