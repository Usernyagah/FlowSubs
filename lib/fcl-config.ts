// lib/fcl-config.ts
// FCL configuration for Flow blockchain

import { config } from '@onflow/fcl';
import type { FCLConfig } from '@/types/flow';

const getContractAddress = (): string => {
  return process.env.NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS || '0x1234567890123456';
};

// Simple FCL Configuration for Flow testnet
const fclConfig: FCLConfig = {
  'app.detail.title': 'FlowSubs - Subscription Management',
  'app.detail.icon': 'https://placehold.co/600x400/000000/FFFFFF/png?text=FlowSubs',
  'accessNode.api': 'https://rest-testnet.onflow.org',
  '0xFlowSubs': getContractAddress(),
  
  // Discovery service configuration
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  'discovery.wallet.method': 'IFRAME/RPC',
  'discovery.wallet.method.default': 'IFRAME/RPC',
  
  // App details
  'app.detail.id': 'flowsubs-app',
  'app.detail.url': 'https://flowsubs.com',
  
  // Flow Port configuration
  'fcl.limit': 9999,
  'fcl.debug': process.env.NODE_ENV === 'development',
};

// Initialize FCL with configuration
export const initializeFCL = () => {
  console.log('🔧 Initializing FCL...');
  
  // Configure FCL with our settings
  config(fclConfig);
  
  console.log('✅ FCL initialized');
  console.log('🔧 FCL Config:', {
    'discovery.wallet': fclConfig['discovery.wallet'],
    'discovery.wallet.method': fclConfig['discovery.wallet.method'],
    'discovery.wallet.method.default': fclConfig['discovery.wallet.method.default'],
  });
};

// Contract addresses
export const CONTRACT_ADDRESSES = {
  FlowSubs: fclConfig['0xFlowSubs'],
  FlowToken: '0x7e60df042a9c0868',
  FungibleToken: '0x9a0766d93b6608b7',
} as const;

// Transaction templates
export const TRANSACTION_TEMPLATES = {
  createSubscription: `
    import FlowSubs from ${fclConfig['0xFlowSubs']}
    import FlowToken from ${CONTRACT_ADDRESSES.FlowToken}
    import FungibleToken from ${CONTRACT_ADDRESSES.FungibleToken}

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
      }
    }
  `,
  
  cancelSubscription: `
    import FlowSubs from ${fclConfig['0xFlowSubs']}

    transaction(subscriptionId: UInt64) {
      prepare(acct: AuthAccount) {
        // Get the FlowSubs contract reference
        let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
        
        // Cancel the subscription
        flowSubs.cancelSubscription(subscriptionId: subscriptionId)

        log("Cancelled subscription with ID: ".concat(subscriptionId.toString()))
      }
    }
  `,

  registerProvider: `
    import FlowSubs from ${fclConfig['0xFlowSubs']}

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
      }
    }
  `,
} as const;

// Script templates
export const SCRIPT_TEMPLATES = {
  getSubscription: `
    import FlowSubs from ${fclConfig['0xFlowSubs']}

    access(all) fun main(subscriptionId: UInt64): FlowSubs.Subscription? {
      // This would call the contract's getSubscription function
      // In practice, you'd need to implement this in Cadence
      return nil
    }
  `,

  getSubscriberSubscriptions: `
    import FlowSubs from ${fclConfig['0xFlowSubs']}

    access(all) fun main(subscriber: Address): [FlowSubs.Subscription] {
      // This would call the contract's getSubscriberSubscriptions function
      // In practice, you'd need to implement this in Cadence
      return []
    }
  `,

  getProviderSubscriptions: `
    import FlowSubs from ${fclConfig['0xFlowSubs']}

    access(all) fun main(provider: Address): [FlowSubs.Subscription] {
      // This would call the contract's getProviderSubscriptions function
      // In practice, you'd need to implement this in Cadence
      return []
    }
  `,

  getAllProviders: `
    import FlowSubs from ${fclConfig['0xFlowSubs']}

    access(all) fun main(): [FlowSubs.ProviderInfo] {
      // This would call the contract's getAllProviders function
      // In practice, you'd need to implement this in Cadence
      return []
    }
  `,
} as const;