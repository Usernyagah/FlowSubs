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
  "app.detail.title": string;
  "app.detail.icon": string;
  "accessNode.api": string;
  "discovery.wallet": string;
  "0xFlowSubs": string; // Contract address
  "discovery.wallet.method"?: string;
  "discovery.wallet.method.default"?: string;
  "discovery.wallet.method.walletconnect"?: string;
  "fcl.wallet.connect"?: string;
  "walletconnect.projectId"?: string;
  "app.detail.id"?: string;
  "app.detail.url"?: string;
  "fcl.walletConnect.projectId"?: string | null;
  "fcl.limit"?: number;
  "fcl.debug"?: boolean;
  [key: string]: any; // Allow additional string keys
}

// Transaction status
export type TransactionStatus = 'PENDING' | 'EXECUTED' | 'SEALED' | 'EXPIRED';

export interface TransactionResult {
  status: TransactionStatus;
  transactionId: string;
  error?: string;
}

