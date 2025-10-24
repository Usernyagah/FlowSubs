// register_provider.cdc
// Transaction to register as a provider

import FlowSubs from 0xFlowSubs

transaction(
    name: String,
    description: String
) {
    prepare(acct: AuthAccount) {
        // Register as a provider directly on the contract
        FlowSubs.registerProvider(name: name, description: description)

        log("Registered as provider: ".concat(name))
    }
}

