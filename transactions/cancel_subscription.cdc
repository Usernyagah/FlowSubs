// cancel_subscription.cdc
// Transaction to cancel a subscription

// Import the Flow standard library
import "FlowToken"
import "FungibleToken"

// Import contract and token interfaces
import FlowSubs from 0xFlowSubs
import FungibleToken from 0x9a0766d93b6608b7  // Testnet FungibleToken
import FlowToken from 0x7e60df042a9c0868    // Testnet FlowToken

transaction(subscriptionId: UInt64) {
    prepare(acct: AuthAccount) {
        // Verify the account has the required capabilities
        if !acct.getCapability<&FlowToken.Vault{FungibleToken.Balance}>(/public/flowTokenBalance).check() {
            panic("Account does not have a valid FlowToken Vault. Make sure the account is set up with a Flow token vault.")
        }

        // Cancel the subscription on the contract
        FlowSubs.cancelSubscription(subscriptionId: subscriptionId)
        
        log("Successfully cancelled subscription with ID: ".concat(subscriptionId.toString()))
    }
    
    execute {
        log("Subscription cancellation transaction executed successfully")
    }
}

