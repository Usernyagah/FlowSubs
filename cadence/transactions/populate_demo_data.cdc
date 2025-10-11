import FlowSubs from 0xYOUR_CONTRACT_ADDRESS

transaction {
    prepare(signer: AuthAccount) {
        // Register as a provider first
        FlowSubs.registerProvider(name: "Demo Provider", description: "A demo subscription provider")
        
        // Create some demo subscriptions
        let demoSubscribers: [Address] = [
            0x01, 0x02, 0x03, 0x04, 0x05
        ]
        
        let amounts: [UFix64] = [5.0, 7.5, 10.0, 12.5, 15.0]
        let intervals: [UFix64] = [86400.0, 172800.0, 259200.0] // 1, 2, 3 days
        
        for i in 0..<demoSubscribers.length {
            let amount = amounts[i % amounts.length]
            let interval = intervals[i % intervals.length]
            
            FlowSubs.createSubscription(
                subscriber: demoSubscribers[i],
                provider: signer.address,
                amount: amount,
                interval: interval
            )
        }
        
        log("Demo data populated successfully!")
        log("Provider: ".concat(signer.address.toString()))
        log("Subscriptions created: ".concat(demoSubscribers.length.toString()))
    }
}

