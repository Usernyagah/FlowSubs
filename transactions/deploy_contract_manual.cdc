// transactions/deploy_contract.cdc
// Deploy FlowSubs contract to Flow testnet

import FlowSubs from 0x1234567890123456

transaction {
    prepare(signer: AuthAccount) {
        // Read the contract code
        let contractCode = FlowSubs.getCode()
        
        // Deploy the contract
        let contract = Contract(name: "FlowSubs", code: contractCode)
        signer.contracts.add(name: "FlowSubs", code: contract.code)
        
        log("FlowSubs contract deployed successfully!")
    }
}
