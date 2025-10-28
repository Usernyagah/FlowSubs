// types/flow.ts
// TypeScript types for Flow blockchain integration

export interface FlowUser {
  addr: string | null;
  loggedIn: boolean | null;
}

export interface Subscription {
  id: number;
  subscriber: string;
  provider: string;
  amount: number;
  interval: number;
  nextPaymentTime: number;
  isActive: boolean;
  createdAt: number;
}

export interface ProviderInfo {
  address: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface PaymentEvent {
  subscriber: string;
  provider: string;
  amount: number;
  subscriptionId: number;
  timestamp: number;
  transactionId: string;
}

export interface CreateSubscriptionParams {
  provider: string;
  amount: number;
  interval: number;
}

export interface FlowSubsHookState {
  loading: boolean;
  error: string | null;
  data: any;
}

export interface WalletState {
  user: FlowUser;
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  error: string | null;
}

export interface FlowSubsState {
  subscriptions: Subscription[];
  payments: PaymentEvent[];
  providers: ProviderInfo[];
  loading: boolean;
  error: string | null;
}

// FCL Configuration
export interface FCLConfig {
  // Required properties
  "accessNode.api": string;
  "discovery.wallet": string;
  "0xFlowSubs": string;
  
  // App metadata
  "app.detail.title"?: string;
  "app.detail.icon"?: string;
  "app.detail.id"?: string;
  "app.detail.url"?: string;
  
  // Network configuration
  "flow.network"?: 'testnet' | 'mainnet' | 'emulator' | 'sandboxnet';
  
  // Wallet configuration
  "discovery.authn.endpoint"?: string;
  "discovery.wallet.method"?: string;
  "discovery.wallet.method.default"?: string;
  "discovery.wallet.method.walletconnect"?: string;
  "fcl.wallet.connect"?: string;
  "walletconnect.projectId"?: string;
  // This property is allowed to be null for type compatibility
  "fcl.walletConnect.projectId"?: string | null;
  
  // FCL settings
  "fcl.limit"?: number;
  "fcl.debug"?: boolean;
  "fcl.eventsPollRate"?: number;
  
  // WebSocket configuration
  "fcl.ws"?: string;
  "fcl.ws.opts"?: {
    retry?: number;
    timeout?: number;
  };
  
  // CORS and domain settings
  "fcl.wallet.post.includeDomain"?: boolean;
  "fcl.wallet.post.origin"?: string;
  
  // Add index signature to allow any string key with string, number, boolean, object, or null values
  [key: string]: string | number | boolean | object | null | undefined;
}

// Transaction status
export type TransactionStatus = 'PENDING' | 'EXECUTED' | 'SEALED' | 'EXPIRED';

export interface TransactionResult {
  status: TransactionStatus;
  transactionId: string;
  error?: string;
}

