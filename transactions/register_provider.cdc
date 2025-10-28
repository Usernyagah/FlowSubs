// register_provider.cdc
// Transaction to register as a provider

// Import the Flow standard library
import "FlowToken"
import "FungibleToken"

// Import contract and token interfaces
import FlowSubs from 0xFlowSubs
import FungibleToken from 0x9a0766d93b6608b7  // Testnet FungibleToken
import FlowToken from 0x7e60df042a9c0868    // Testnet FlowToken

transaction(
    name: String,
    description: String
) {
    prepare(acct: AuthAccount) {
        // Verify the account has the required capabilities
        if !acct.getCapability<&FlowToken.Vault{FungibleToken.Balance}>(/public/flowTokenBalance).check() {
            panic("Account does not have a valid FlowToken Vault. Make sure the account is set up with a Flow token vault.")
        }

        // Input validation
        if name.length == 0 {
            panic("Provider name cannot be empty. Please provide a valid name.")
        }
        
        if name.length > 50 {
            panic("Provider name is too long. Maximum 50 characters allowed.")
        }
        
        if description.length > 200 {
            panic("Provider description is too long. Maximum 200 characters allowed.")
        }

        // Register as a provider on the contract
        FlowSubs.registerProvider(name: name, description: description)
        
        log("Successfully registered as provider: ".concat(name))
    }
    
    execute {
        log("Provider registration transaction executed successfully")
    }
}

