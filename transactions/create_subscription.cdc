// create_subscription.cdc
// Transaction to create a new subscription

// Import the Flow standard library which contains AuthAccount
import "FlowToken"
import "FungibleToken"

// Import the contract and token types
import FlowSubs from 0xFlowSubs
import FungibleToken from 0x9a0766d93b6608b7  // Testnet FungibleToken
import FlowToken from 0x7e60df042a9c0868    // Testnet FlowToken

// Import built-in types
import "0x1"  // Import the built-in types including AuthAccount

transaction(
    provider: Address,
    amount: UFix64,
    interval: UFix64
) {
    // The provider's payment vault that will receive the subscription payments
    let paymentVault: @FungibleToken.Vault
    
    prepare(acct: AuthAccount) {
        // Get the FlowToken vault from the account
        let vaultRef = acct.getCapability<&FlowToken.Vault{FungibleToken.Balance}>(/public/flowTokenBalance)
            .borrow()
            ?? panic("Could not borrow FlowToken Vault reference. Ensure the account has a FlowToken Vault set up.")
            
        // Create the subscription on the contract
        let subscriptionId = FlowSubs.createSubscription(
            subscriber: acct.address,
            provider: provider,
            amount: amount,
            interval: interval
        )

        log("Created subscription with ID: ".concat(subscriptionId.toString()))
    }
    
    execute {
        log("Subscription creation transaction executed successfully")
    }
}

