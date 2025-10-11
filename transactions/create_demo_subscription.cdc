// transactions/create_demo_subscription.cdc
// Transaction to create a demo subscription

import FlowSubs from 0xYOUR_CONTRACT_ADDRESS
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7

transaction(
    provider: Address,
    amount: UFix64,
    interval: UFix64
) {
    prepare(acct: AuthAccount) {
        // Ensure the account has a FlowToken vault
        if acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) == nil {
            acct.save(FlowToken.createEmptyVault(), to: /storage/flowTokenVault)
            acct.link<&FlowToken.Vault{FungibleToken.Receiver}>(
                /public/flowTokenReceiver,
                target: /storage/flowTokenVault
            )
            acct.link<&FlowToken.Vault{FungibleToken.Balance}>(
                /public/flowTokenBalance,
                target: /storage/flowTokenVault
            )
        }

        // Get the FlowSubs contract reference
        let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
        
        // Create the subscription
        let subscriptionId = flowSubs.createSubscription(
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
