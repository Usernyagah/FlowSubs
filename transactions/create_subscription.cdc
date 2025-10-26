// create_subscription.cdc
// Transaction to create a new subscription

import FlowSubs from 0xFlowSubs
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
            acct.link<&FlowToken.Vault & FungibleToken.Receiver>(
                /public/flowTokenReceiver,
                target: /storage/flowTokenVault
            )
            acct.link<&FlowToken.Vault & FungibleToken.Balance>(
                /public/flowTokenBalance,
                target: /storage/flowTokenVault
            )
        }

        // Create the subscription directly on the contract
        let subscriptionId = FlowSubs.createSubscription(
            provider: provider,
            amount: amount,
            interval: interval
        )

        log("Created subscription with ID: ".concat(subscriptionId.toString()))
    }
}

