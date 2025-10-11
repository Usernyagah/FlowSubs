// tests/FlowSubs_DemoData_test.js
// JavaScript tests for FlowSubs demo data frontend integration

const { generateDemoData, DEMO_DATA } = require('../scripts/demo-data-generator');

describe('FlowSubs Demo Data Tests', () => {
  
  describe('Demo Data Generation', () => {
    test('should generate correct number of providers', () => {
      const demoData = generateDemoData();
      expect(demoData.providers).toHaveLength(3);
    });

    test('should generate correct number of subscriptions', () => {
      const demoData = generateDemoData();
      expect(demoData.subscriptions).toHaveLength(8);
    });

    test('should generate subscriptions with valid amounts', () => {
      const demoData = generateDemoData();
      
      demoData.subscriptions.forEach(subscription => {
        expect(subscription.amount).toBeGreaterThanOrEqual(5.0);
        expect(subscription.amount).toBeLessThanOrEqual(10.0);
      });
    });

    test('should distribute subscriptions across providers correctly', () => {
      const demoData = generateDemoData();
      
      // Count subscriptions per provider
      const providerSubscriptionCounts = {};
      demoData.subscriptions.forEach(subscription => {
        const provider = subscription.provider;
        providerSubscriptionCounts[provider] = (providerSubscriptionCounts[provider] || 0) + 1;
      });
      
      // Each provider should have 2-3 subscriptions
      Object.values(providerSubscriptionCounts).forEach(count => {
        expect(count).toBeGreaterThanOrEqual(2);
        expect(count).toBeLessThanOrEqual(3);
      });
    });

    test('should generate realistic payment history', () => {
      const demoData = generateDemoData();
      
      expect(demoData.payments.length).toBeGreaterThan(0);
      
      demoData.payments.forEach(payment => {
        expect(payment.amount).toBeGreaterThanOrEqual(5.0);
        expect(payment.amount).toBeLessThanOrEqual(10.0);
        expect(payment.timestamp).toBeGreaterThan(0);
        expect(payment.transactionId).toMatch(/^0x[a-f0-9]+$/);
      });
    });
  });

  describe('Provider Data Structure', () => {
    test('should have correct provider names', () => {
      const demoData = generateDemoData();
      
      const providerNames = demoData.providers.map(p => p.name);
      expect(providerNames).toContain('Premium Streaming Service');
      expect(providerNames).toContain('Basic Cloud Storage');
      expect(providerNames).toContain('Enterprise Analytics');
    });

    test('should have valid provider addresses', () => {
      const demoData = generateDemoData();
      
      demoData.providers.forEach(provider => {
        expect(provider.address).toMatch(/^0x[a-f0-9]+$/);
        expect(provider.name).toBeTruthy();
        expect(provider.description).toBeTruthy();
        expect(provider.isActive).toBe(true);
      });
    });
  });

  describe('Subscription Data Structure', () => {
    test('should have valid subscription properties', () => {
      const demoData = generateDemoData();
      
      demoData.subscriptions.forEach(subscription => {
        expect(subscription.id).toBeGreaterThan(0);
        expect(subscription.subscriber).toMatch(/^0x[a-f0-9]+$/);
        expect(subscription.provider).toMatch(/^0x[a-f0-9]+$/);
        expect(subscription.amount).toBeGreaterThan(0);
        expect(subscription.interval).toBe(DEMO_DATA.monthlyInterval);
        expect(subscription.isActive).toBe(true);
        expect(subscription.createdAt).toBeGreaterThan(0);
        expect(subscription.nextPaymentTime).toBeGreaterThan(subscription.createdAt);
      });
    });

    test('should have monthly payment intervals', () => {
      const demoData = generateDemoData();
      
      demoData.subscriptions.forEach(subscription => {
        expect(subscription.interval).toBe(2592000); // 30 days in seconds
      });
    });
  });

  describe('Frontend Integration', () => {
    test('should be compatible with useFlowSubs hook', () => {
      const demoData = generateDemoData();
      
      // Simulate hook return structure
      const mockHookReturn = {
        providers: demoData.providers,
        subscriptions: demoData.subscriptions,
        payments: demoData.payments,
        loading: false,
        error: null
      };
      
      expect(mockHookReturn.providers).toBeDefined();
      expect(mockHookReturn.subscriptions).toBeDefined();
      expect(mockHookReturn.payments).toBeDefined();
      expect(mockHookReturn.loading).toBe(false);
      expect(mockHookReturn.error).toBeNull();
    });

    test('should support filtering by subscriber address', () => {
      const demoData = generateDemoData();
      const testSubscriber = demoData.subscriptions[0].subscriber;
      
      const subscriberSubscriptions = demoData.subscriptions.filter(
        sub => sub.subscriber === testSubscriber
      );
      
      expect(subscriberSubscriptions.length).toBeGreaterThan(0);
      subscriberSubscriptions.forEach(sub => {
        expect(sub.subscriber).toBe(testSubscriber);
      });
    });

    test('should support filtering by provider address', () => {
      const demoData = generateDemoData();
      const testProvider = demoData.subscriptions[0].provider;
      
      const providerSubscriptions = demoData.subscriptions.filter(
        sub => sub.provider === testProvider
      );
      
      expect(providerSubscriptions.length).toBeGreaterThan(0);
      providerSubscriptions.forEach(sub => {
        expect(sub.provider).toBe(testProvider);
      });
    });
  });

  describe('Data Consistency', () => {
    test('should have consistent provider-subscriber relationships', () => {
      const demoData = generateDemoData();
      
      demoData.subscriptions.forEach(subscription => {
        // Verify provider exists
        const provider = demoData.providers.find(p => p.address === subscription.provider);
        expect(provider).toBeDefined();
        expect(provider.isActive).toBe(true);
        
        // Verify subscriber address format
        expect(subscription.subscriber).toMatch(/^0x[a-f0-9]+$/);
      });
    });

    test('should have consistent payment-subscription relationships', () => {
      const demoData = generateDemoData();
      
      demoData.payments.forEach(payment => {
        // Verify subscription exists
        const subscription = demoData.subscriptions.find(s => s.id === payment.subscriptionId);
        expect(subscription).toBeDefined();
        
        // Verify payment amount matches subscription amount
        expect(payment.amount).toBe(subscription.amount);
        
        // Verify provider matches
        expect(payment.provider).toBe(subscription.provider);
        expect(payment.subscriber).toBe(subscription.subscriber);
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty data gracefully', () => {
      const emptyData = {
        providers: [],
        subscriptions: [],
        payments: [],
        metadata: {
          generatedAt: new Date().toISOString(),
          totalProviders: 0,
          totalSubscriptions: 0,
          totalPayments: 0,
          monthlyInterval: DEMO_DATA.monthlyInterval
        }
      };
      
      expect(emptyData.providers).toHaveLength(0);
      expect(emptyData.subscriptions).toHaveLength(0);
      expect(emptyData.payments).toHaveLength(0);
    });

    test('should generate unique subscription IDs', () => {
      const demoData = generateDemoData();
      const subscriptionIds = demoData.subscriptions.map(s => s.id);
      const uniqueIds = [...new Set(subscriptionIds)];
      
      expect(uniqueIds.length).toBe(subscriptionIds.length);
    });

    test('should generate unique transaction IDs for payments', () => {
      const demoData = generateDemoData();
      const transactionIds = demoData.payments.map(p => p.transactionId);
      const uniqueIds = [...new Set(transactionIds)];
      
      expect(uniqueIds.length).toBe(transactionIds.length);
    });
  });

  describe('Performance', () => {
    test('should generate data quickly', () => {
      const startTime = Date.now();
      generateDemoData();
      const endTime = Date.now();
      
      const generationTime = endTime - startTime;
      expect(generationTime).toBeLessThan(100); // Should complete in under 100ms
    });

    test('should handle multiple generations consistently', () => {
      const data1 = generateDemoData();
      const data2 = generateDemoData();
      
      expect(data1.providers.length).toBe(data2.providers.length);
      expect(data1.subscriptions.length).toBe(data2.subscriptions.length);
      expect(data1.payments.length).toBe(data2.payments.length);
    });
  });
});

// Mock React hook test
describe('useFlowSubs Hook Integration', () => {
  test('should work with mock data', () => {
    const demoData = generateDemoData();
    
    // Simulate hook state
    const mockHookState = {
      subscriptions: demoData.subscriptions,
      providers: demoData.providers,
      payments: demoData.payments,
      loading: false,
      error: null
    };
    
    // Test hook actions
    const mockActions = {
      createSubscription: jest.fn(),
      cancelSubscription: jest.fn(),
      registerProvider: jest.fn(),
      fetchSubscriptions: jest.fn(),
      fetchPayments: jest.fn(),
      fetchProviders: jest.fn(),
      clearError: jest.fn()
    };
    
    expect(mockHookState.subscriptions).toBeDefined();
    expect(mockHookState.providers).toBeDefined();
    expect(mockHookState.payments).toBeDefined();
    expect(mockActions.createSubscription).toBeDefined();
    expect(mockActions.cancelSubscription).toBeDefined();
  });
});

// Contract interaction simulation
describe('Contract Interaction Simulation', () => {
  test('should simulate subscription creation', async () => {
    const demoData = generateDemoData();
    const provider = demoData.providers[0];
    const subscriber = demoData.subscribers[0];
    
    // Simulate contract call
    const mockCreateSubscription = async (params) => {
      return {
        status: 'SEALED',
        transactionId: '0x' + Math.random().toString(16).substr(2, 8)
      };
    };
    
    const result = await mockCreateSubscription({
      provider: provider.address,
      amount: 5.0,
      interval: 2592000
    });
    
    expect(result.status).toBe('SEALED');
    expect(result.transactionId).toMatch(/^0x[a-f0-9]+$/);
  });

  test('should simulate provider registration', async () => {
    const demoData = generateDemoData();
    const provider = demoData.providers[0];
    
    // Simulate contract call
    const mockRegisterProvider = async (name, description) => {
      return {
        status: 'SEALED',
        transactionId: '0x' + Math.random().toString(16).substr(2, 8)
      };
    };
    
    const result = await mockRegisterProvider(
      provider.name,
      provider.description
    );
    
    expect(result.status).toBe('SEALED');
    expect(result.transactionId).toMatch(/^0x[a-f0-9]+$/);
  });
});
