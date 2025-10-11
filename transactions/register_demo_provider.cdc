// transactions/register_demo_provider.cdc
// Transaction to register a demo provider

import FlowSubs from 0xYOUR_CONTRACT_ADDRESS

transaction(
    name: String,
    description: String
) {
    prepare(acct: AuthAccount) {
        // Get the FlowSubs contract reference
        let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
        
        // Register as a provider
        flowSubs.registerProvider(name: name, description: description)
        
        log("Registered as provider: ".concat(name))
        log("Description: ".concat(description))
        log("Provider address: ".concat(acct.address.toString()))
    }
}
