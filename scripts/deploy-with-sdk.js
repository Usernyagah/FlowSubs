// scripts/deploy-with-sdk.js
const elliptic = require('elliptic');
const { SHA3 } = require('sha3');
const fcl = require('@onflow/fcl');

// Configure FCL for testnet
fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
});

const curve = new elliptic.ec('p256');

const hashMessageHex = (msgHex) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(msgHex, 'hex'));
  return sha.digest();
};

const signWithKey = (privateKey, msgHex) => {
  const key = curve.keyFromPrivate(Buffer.from(privateKey, 'hex'));
  const sig = key.sign(hashMessageHex(msgHex));

  const n = 32;
  const r = sig.r.toArrayLike(Buffer, 'be', n);
  const s = sig.s.toArrayLike(Buffer, 'be', n);

  return Buffer.concat([r, s]).toString('hex');
};

const sansPrefix = (address) => address.replace(/^0x/, '');
const withPrefix = (address) => (address.startsWith('0x') ? address : `0x${address}`);

async function deployContract() {
  try {
    console.log('🚀 Attempting contract deployment...');
    
    // First, we need to get the account address from the private key
    // For now, let's try to deploy and see what happens
    const privateKey = 'b9098df8816abc841a95eda6214e6cc95e6f4cf38bee0494e2e89fd36226efaf';
    
    // We need to derive the public key and account address
    const key = curve.keyFromPrivate(Buffer.from(privateKey, 'hex'));
    const publicKey = key.getPublic();
    const publicKeyHex = publicKey.encode('hex', false);
    
    console.log('Public key derived:', publicKeyHex);
    
    // For Flow, we need to create an account first or use an existing one
    // Let's try a different approach - use Flow Port instructions
    
    console.log('⚠️  Direct SDK deployment requires account setup...');
    console.log('');
    console.log('📋 MANUAL DEPLOYMENT REQUIRED:');
    console.log('');
    console.log('1. Go to: https://testnet.flowport.io/');
    console.log('2. Connect with private key: b9098df8816abc841a95eda6214e6cc95e6f4cf38bee0494e2e89fd36226efaf');
    console.log('3. Execute this transaction:');
    console.log('');
    
    const contractCode = `
pub contract FlowSubs {
    pub var subscriptionCounter: UInt64
    pub var subscriptions: {UInt64: Subscription}
    pub var providers: {Address: ProviderInfo}

    pub struct Subscription {
        pub let id: UInt64
        pub let subscriber: Address
        pub let provider: Address
        pub let amount: UFix64
        pub let interval: UFix64
        pub let nextPaymentTime: UFix64
        pub let isActive: Bool
        pub let createdAt: UFix64

        init(id: UInt64, subscriber: Address, provider: Address, amount: UFix64, interval: UFix64, nextPaymentTime: UFix64, isActive: Bool, createdAt: UFix64) {
            self.id = id
            self.subscriber = subscriber
            self.provider = provider
            self.amount = amount
            self.interval = interval
            self.nextPaymentTime = nextPaymentTime
            self.isActive = isActive
            self.createdAt = createdAt
        }
    }

    pub struct ProviderInfo {
        pub let address: Address
        pub let name: String
        pub let description: String
        pub let isActive: Bool

        init(address: Address, name: String, description: String, isActive: Bool) {
            self.address = address
            self.name = name
            self.description = description
            self.isActive = isActive
        }
    }

    init() {
        self.subscriptionCounter = 0
        self.subscriptions = {}
        self.providers = {}
    }

    pub fun createSubscription(subscriber: Address, provider: Address, amount: UFix64, interval: UFix64): UInt64 {
        let subscriptionId = self.subscriptionCounter + 1
        self.subscriptionCounter = subscriptionId

        let subscription = Subscription(
            id: subscriptionId,
            subscriber: subscriber,
            provider: provider,
            amount: amount,
            interval: interval,
            nextPaymentTime: getCurrentBlock().timestamp + interval,
            isActive: true,
            createdAt: getCurrentBlock().timestamp
        )

        self.subscriptions[subscriptionId] = subscription
        return subscriptionId
    }

    pub fun cancelSubscription(subscriptionId: UInt64) {
        if let subscription = self.subscriptions[subscriptionId] {
            let cancelledSubscription = Subscription(
                id: subscription.id,
                subscriber: subscription.subscriber,
                provider: subscription.provider,
                amount: subscription.amount,
                interval: subscription.interval,
                nextPaymentTime: subscription.nextPaymentTime,
                isActive: false,
                createdAt: subscription.createdAt
            )

            self.subscriptions[subscriptionId] = cancelledSubscription
        }
    }

    pub fun registerProvider(name: String, description: String) {
        let providerInfo = ProviderInfo(
            address: self.account.address,
            name: name,
            description: description,
            isActive: true
        )

        self.providers[self.account.address] = providerInfo
    }

    pub fun getSubscription(subscriptionId: UInt64): Subscription? {
        return self.subscriptions[subscriptionId]
    }

    pub fun getSubscriberSubscriptions(subscriber: Address): [Subscription] {
        var subscriberSubscriptions: [Subscription] = []
        for subscription in self.subscriptions.values {
            if subscription.subscriber == subscriber {
                subscriberSubscriptions.append(subscription)
            }
        }
        return subscriberSubscriptions
    }

    pub fun getAllProviders(): [ProviderInfo] {
        var allProviders: [ProviderInfo] = []
        for provider in self.providers.values {
            allProviders.append(provider)
        }
        return allProviders
    }
}`;

    const deployTransaction = `
transaction {
  prepare(signer: AuthAccount) {
    let contractCode = \`${contractCode}\`
    
    let contract = Contract(name: "FlowSubs", code: contractCode)
    signer.contracts.add(name: "FlowSubs", code: contract.code)
    
    log("CONTRACT_DEPLOYED_SUCCESSFULLY!")
    log("CONTRACT_ADDRESS: ".concat(signer.address.toString()))
  }
}`;

    console.log(deployTransaction);
    console.log('');
    console.log('4. Copy the CONTRACT_ADDRESS from the logs');
    console.log('5. Tell me the address and I will update your configuration!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.log('');
    console.log('📋 Manual deployment required:');
    console.log('1. Go to: https://testnet.flowport.io/');
    console.log('2. Connect with private key: b9098df8816abc841a95eda6214e6cc95e6f4cf38bee0494e2e89fd36226efaf');
    console.log('3. Execute the deployment transaction');
    console.log('4. Copy the contract address from the logs');
  }
}

deployContract();