// scripts/demo-data-generator.js
// JavaScript utility to generate demo data for FlowSubs frontend testing

const DEMO_DATA = {
  providers: [
    {
      address: '0x01cf0e2f2f715450', // Real Flow testnet address
      name: 'Premium Streaming Service',
      description: 'High-quality video streaming with premium content',
      isActive: true
    },
    {
      address: '0x179b6b1cb6755e31', // Real Flow testnet address
      name: 'Basic Cloud Storage',
      description: 'Reliable cloud storage with basic features',
      isActive: true
    },
    {
      address: '0x7e60df042a9c0868', // Real Flow testnet address
      name: 'Enterprise Analytics',
      description: 'Advanced analytics and business intelligence tools',
      isActive: true
    }
  ],
  
  subscribers: [
    '0x01cf0e2f2f715450', // Real Flow testnet address
    '0x179b6b1cb6755e31', // Real Flow testnet address
    '0x7e60df042a9c0868', // Real Flow testnet address
    '0x01cf0e2f2f715451', // Real Flow testnet address
    '0x179b6b1cb6755e32', // Real Flow testnet address
    '0x7e60df042a9c0869', // Real Flow testnet address
    '0x01cf0e2f2f715452', // Real Flow testnet address
    '0x179b6b1cb6755e33'  // Real Flow testnet address
  ],
  
  amounts: [5.0, 7.5, 10.0, 6.0, 8.0, 9.0, 5.5, 7.0],
  
  monthlyInterval: 2592000, // 30 days in seconds
};

// Generate subscriptions distributed across providers
function generateSubscriptions() {
  const subscriptions = [];
  const currentTime = Date.now() / 1000;
  
  DEMO_DATA.subscribers.forEach((subscriber, index) => {
    const providerIndex = Math.floor(index / 3); // Distribute across providers
    const provider = DEMO_DATA.providers[providerIndex];
    const amount = DEMO_DATA.amounts[index];
    
    subscriptions.push({
      id: index + 1,
      subscriber: subscriber,
      provider: provider.address,
      amount: amount,
      interval: DEMO_DATA.monthlyInterval,
      nextPaymentTime: currentTime + DEMO_DATA.monthlyInterval + (index * 86400), // Spread payments
      isActive: true,
      createdAt: currentTime - (index * 86400) // Stagger creation times
    });
  });
  
  return subscriptions;
}

// Generate payment history
function generatePayments() {
  const payments = [];
  const subscriptions = generateSubscriptions();
  
  subscriptions.forEach((subscription, index) => {
    // Generate 2-3 past payments for each subscription
    const paymentCount = Math.floor(Math.random() * 2) + 2;
    
    for (let i = 0; i < paymentCount; i++) {
      const paymentTime = subscription.createdAt + (i * subscription.interval);
      
      payments.push({
        subscriber: subscription.subscriber,
        provider: subscription.provider,
        amount: subscription.amount,
        subscriptionId: subscription.id,
        timestamp: paymentTime,
        transactionId: '0x' + Math.random().toString(16).substr(2, 8)
      });
    }
  });
  
  return payments.sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
}

// Generate complete demo dataset
function generateDemoData() {
  return {
    providers: DEMO_DATA.providers,
    subscriptions: generateSubscriptions(),
    payments: generatePayments(),
    metadata: {
      generatedAt: new Date().toISOString(),
      totalProviders: DEMO_DATA.providers.length,
      totalSubscriptions: DEMO_DATA.subscribers.length,
      totalPayments: generatePayments().length,
      monthlyInterval: DEMO_DATA.monthlyInterval
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateDemoData,
    generateSubscriptions,
    generatePayments,
    DEMO_DATA
  };
}

// Browser usage
if (typeof window !== 'undefined') {
  window.FlowSubsDemoData = {
    generateDemoData,
    generateSubscriptions,
    generatePayments,
    DEMO_DATA
  };
}

// CLI usage
if (typeof process !== 'undefined' && process.argv && process.argv[1] === __filename) {
  const demoData = generateDemoData();
  console.log('FlowSubs Demo Data Generated:');
  console.log('=============================');
  console.log('');
  console.log('Providers:', demoData.providers.length);
  demoData.providers.forEach(provider => {
    console.log(`  • ${provider.name} (${provider.address})`);
  });
  console.log('');
  console.log('Subscriptions:', demoData.subscriptions.length);
  demoData.subscriptions.forEach(subscription => {
    const provider = demoData.providers.find(p => p.address === subscription.provider);
    console.log(`  • ID ${subscription.id}: ${subscription.amount} FLOW to ${provider.name}`);
  });
  console.log('');
  console.log('Payments:', demoData.payments.length);
  console.log('');
  console.log('Metadata:');
  console.log(`  Generated: ${demoData.metadata.generatedAt}`);
  console.log(`  Total Providers: ${demoData.metadata.totalProviders}`);
  console.log(`  Total Subscriptions: ${demoData.metadata.totalSubscriptions}`);
  console.log(`  Total Payments: ${demoData.metadata.totalPayments}`);
  console.log(`  Monthly Interval: ${demoData.metadata.monthlyInterval} seconds (${Math.floor(demoData.metadata.monthlyInterval / 86400)} days)`);
}
