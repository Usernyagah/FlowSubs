// lib/fcl-config.ts
import { config } from '@onflow/fcl';
import type { FCLConfig } from '@/types/flow';

// Environment variable validation
const requiredEnvVars = [
  'NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS',
  'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'
];

// Validate environment variables on server-side
if (typeof window === 'undefined') {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

const getContractAddress = (): string => {
  const contractAddress = process.env.NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.warn('No contract address found in environment variables. Using testnet fallback.');
    return '0xc1b85cc9470b7283'; // Testnet fallback
  }
  return contractAddress;
};

const getAppUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

const getFCLConfig = (): FCLConfig => {
  const appUrl = getAppUrl();
  const isDevelopment = process.env.NODE_ENV === 'development';
  // Default to testnet if not specified
  const isTestnet = process.env.NEXT_PUBLIC_FLOW_NETWORK !== 'mainnet';

  // Base configuration with required properties
  const config: FCLConfig = {
    // Required properties
    'accessNode.api': isTestnet ? 'https://rest-testnet.onflow.org' : 'https://rest-mainnet.onflow.org',
    'discovery.wallet': isTestnet 
      ? 'https://fcl-discovery.onflow.org/testnet/authn'
      : 'https://fcl-discovery.onflow.org/authn',
    '0xFlowSubs': getContractAddress(),
    
    // App metadata
    'app.detail.title': 'FlowSubs - Subscription Management',
    'app.detail.icon': `${appUrl}/logo.png`,
    'app.detail.id': 'flowsubs-app',
    'app.detail.url': appUrl,
    'flow.network': isTestnet ? 'testnet' : 'mainnet',
    
    // FCL settings
    'fcl.limit': 9999,
    'fcl.debug': isDevelopment,
  };

  // Use testnet by default
  if (isTestnet) {
    config['app.detail.icon'] = `${appUrl}/flow-logo.png`;
    config['discovery.wallet'] = 'https://fcl-discovery.onflow.org/testnet/authn';
    config['accessNode.api'] = 'https://rest-testnet.onflow.org';
    config['0xFlowToken'] = '0x7e60df042a9c0868';
    config['0xFungibleToken'] = '0x9a0766d93b6608b7';
  } else {
    // Mainnet configuration
    config['accessNode.api'] = 'https://rest-mainnet.onflow.org';
    config['discovery.wallet'] = 'https://fcl-discovery.onflow.org/authn';
    config['discovery.authn.endpoint'] = 'https://fcl-discovery.onflow.org/api/testnet/authn';
  }

  // Development-specific configuration
  if (isDevelopment) {
    // Use local discovery service in development
    config['discovery.wallet'] = 'http://localhost:8701/flow/dapp';
    config['discovery.authn.endpoint'] = 'http://localhost:8701/flow/authenticate';
    
    // Enable CORS for local development
    config['fcl.wallet.post.includeDomain'] = true;
    config['fcl.wallet.post.origin'] = appUrl;
  }

  // WalletConnect configuration
  if (process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
    config['discovery.wallet.method.walletconnect'] = 'WALLETCONNECT';
    config['fcl.wallet.connect'] = 'https://fcl-ecosystem-walletconnect.vercel.app';
    config['walletconnect.projectId'] = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  }

  // WebSocket configuration
  config['fcl.ws'] = isTestnet ? 'wss://rest-testnet.onflow.org/ws' : 'wss://rest-mainnet.onflow.org/ws';
  config['fcl.ws.opts'] = {
    retry: 3,
    timeout: 10000,
  };

  return config;
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
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

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
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

transaction(subscriptionId: UInt64) {
  prepare(acct: AuthAccount) {
    FlowSubs.cancelSubscription(subscriptionId: subscriptionId)

    log("Cancelled subscription with ID: ".concat(subscriptionId.toString()))
  }
}
  `,

  registerProvider: `
import FlowSubs from ${fclConfig['0xFlowSubs']}
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

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