// scripts/get_demo_data.cdc
// Script to retrieve demo data from FlowSubs contract

import FlowSubs from 0xYOUR_CONTRACT_ADDRESS

pub fun main(): {String: [String]} {
    // This script would retrieve all demo data
    // In practice, you'd implement the actual contract queries here
    
    let demoData: {String: [String]} = {}
    
    // Mock data structure for demo purposes
    demoData["providers"] = [
        "0x1234567890abcdef - Premium Streaming Service",
        "0xfedcba0987654321 - Basic Cloud Storage", 
        "0x9876543210fedcba - Enterprise Analytics"
    ]
    
    demoData["subscriptions"] = [
        "ID: 1, Subscriber: 0x1111111111111111, Provider: 0x1234567890abcdef, Amount: 5.0 FLOW",
        "ID: 2, Subscriber: 0x2222222222222222, Provider: 0x1234567890abcdef, Amount: 7.5 FLOW",
        "ID: 3, Subscriber: 0x3333333333333333, Provider: 0x1234567890abcdef, Amount: 10.0 FLOW",
        "ID: 4, Subscriber: 0x4444444444444444, Provider: 0xfedcba0987654321, Amount: 6.0 FLOW",
        "ID: 5, Subscriber: 0x5555555555555555, Provider: 0xfedcba0987654321, Amount: 8.0 FLOW",
        "ID: 6, Subscriber: 0x6666666666666666, Provider: 0xfedcba0987654321, Amount: 9.0 FLOW",
        "ID: 7, Subscriber: 0x7777777777777777, Provider: 0x9876543210fedcba, Amount: 5.5 FLOW",
        "ID: 8, Subscriber: 0x8888888888888888, Provider: 0x9876543210fedcba, Amount: 7.0 FLOW"
    ]
    
    demoData["payments"] = [
        "Subscriber: 0x1111111111111111, Provider: 0x1234567890abcdef, Amount: 5.0 FLOW, Time: 2024-01-01",
        "Subscriber: 0x2222222222222222, Provider: 0x1234567890abcdef, Amount: 7.5 FLOW, Time: 2024-01-02",
        "Subscriber: 0x3333333333333333, Provider: 0x1234567890abcdef, Amount: 10.0 FLOW, Time: 2024-01-03",
        "Subscriber: 0x4444444444444444, Provider: 0xfedcba0987654321, Amount: 6.0 FLOW, Time: 2024-01-04",
        "Subscriber: 0x5555555555555555, Provider: 0xfedcba0987654321, Amount: 8.0 FLOW, Time: 2024-01-05"
    ]
    
    return demoData
}
