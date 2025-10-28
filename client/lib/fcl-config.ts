// lib/fcl-config.ts
// FCL configuration for Flow blockchain — ensure only 1 config and correct settings
import { config } from '@onflow/fcl';
import type { FCLConfig } from '@/types/flow';

const getContractAddress = (): string => {
  // Use Vercel env var or real testnet fallback; never a dummy value
  return process.env.NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS || '0xc1b85cc9470b7283';
};

// Get app URL with proper fallback
const getAppUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use current location
    return window.location.origin;
  }
  // Server-side: use env var or default
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

// Create a function to get FCL config with proper URL
const getFCLConfig = (): FCLConfig => {
  const appUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

  return {
    'app.detail.title': 'FlowSubs - Subscription Management',
    'app.detail.icon': 'https://placehold.co/600x400/000000/FFFFFF/png?text=FlowSubs',
    'accessNode.api': 'https://rest-testnet.onflow.org',
    '0xFlowSubs': getContractAddress(),

    // Discovery endpoints (required for wallet authentication, legacy+modern)
    'discovery.authn.endpoint': 'https://fcl-discovery.onflow.org/testnet/authn',
    'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn', // legacy, required by some wallets

    // WalletConnect plugin, using env project ID
    'discovery.wallet.method.walletconnect': 'WALLETCONNECT',
    'fcl.wallet.connect': 'https://fcl-ecosystem-walletconnect.vercel.app',
    'walletconnect.projectId': process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '2b9573d0cfcd983bc65de6e956573f28',

    'app.detail.id': 'flowsubs-app',
    'app.detail.url': appUrl,

    'fcl.limit': 9999,
    'fcl.debug': process.env.NODE_ENV === 'development',
  };
};

// Get the config for use in templates
const fclConfig = getFCLConfig();

// Only call this ONCE, at global/module scope
let initialized = false;
export const initializeFCL = () => {
  if (initialized) {
    console.log('⚠️ FCL already initialized, skipping...');
    return;
  }
  
  console.log('🔧 Initializing FCL...');
  
  // Get fresh config with current URL
  const fclConfigInstance = getFCLConfig();
  
  config(fclConfigInstance);
  console.log('✅ FCL initialized');
  console.log('🔧 FCL Config (subset in use):', {
    'discovery.authn.endpoint': fclConfigInstance['discovery.authn.endpoint'],
    'accessNode.api': fclConfigInstance['accessNode.api'],
    '0xFlowSubs': fclConfigInstance['0xFlowSubs'],
    'walletconnect.projectId': fclConfigInstance['walletconnect.projectId'],
    'app.detail.url': fclConfigInstance['app.detail.url']
  });
  // Print the actual contract address explicitly for debugging runtime env
  console.warn('[DEBUG] FlowSubs Contract Address in use:', fclConfigInstance['0xFlowSubs']);
  initialized = true;
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

transaction(
  provider: Address,
  amount: UFix64,
  interval: UFix64
) {
  prepare(acct: AuthAccount) {
    let subscriptionId = FlowSubs.createSubscription(
      subscriber: acct.address,
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