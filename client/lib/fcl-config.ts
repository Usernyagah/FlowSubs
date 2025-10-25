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
  
  // WalletConnect configuration
  'discovery.wallet.method.walletconnect': 'WALLETCONNECT',
  'fcl.wallet.connect': 'https://fcl-ecosystem-walletconnect.vercel.app',
  'walletconnect.projectId': process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID',
  
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

        // Create the subscription directly on the contract
        let subscriptionId = FlowSubs.createSubscription(
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
        // Cancel the subscription directly on the contract
        FlowSubs.cancelSubscription(subscriptionId: subscriptionId)

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
        // Register as a provider directly on the contract
        FlowSubs.registerProvider(name: name, description: description)

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
      return FlowSubs.getSubscription(subscriptionId: subscriptionId)
    }
  `,

  getSubscriberSubscriptions: `
    import FlowSubs from ${fclConfig['0xFlowSubs']}

    access(all) fun main(subscriber: Address): [FlowSubs.Subscription] {
      return FlowSubs.getSubscriberSubscriptions(subscriber: subscriber)
    }
  `,

  getProviderSubscriptions: `
    import FlowSubs from ${fclConfig['0xFlowSubs']}

    access(all) fun main(provider: Address): [FlowSubs.Subscription] {
      return FlowSubs.getProviderSubscriptions(provider: provider)
    }
  `,

  getAllProviders: `
    import FlowSubs from ${fclConfig['0xFlowSubs']}

    access(all) fun main(): [FlowSubs.ProviderInfo] {
      return FlowSubs.getAllProviders()
    }
  `,
} as const;