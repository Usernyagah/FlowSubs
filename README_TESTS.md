# FlowSubs Demo Data Test Suite

Comprehensive test suite for FlowSubs demo data functionality, covering contract deployment, subscription creation, data validation, and frontend integration.

## Test Overview

This test suite validates all aspects of the FlowSubs demo data setup:

- ✅ **Contract Deployment Tests** - Ensure FlowSubs contract deploys successfully
- ✅ **Provider Registration Tests** - Verify provider creation and management
- ✅ **Subscription Creation Tests** - Validate subscription creation with proper amounts
- ✅ **Data Validation Tests** - Ensure demo data structure is correct
- ✅ **Event Emission Tests** - Verify SubscriptionCreated events are emitted
- ✅ **Query Function Tests** - Test all data retrieval functions
- ✅ **Frontend Integration Tests** - Validate React hook compatibility
- ✅ **Edge Case Tests** - Handle invalid inputs and error conditions

## Test Files

### Cadence Tests
- `tests/FlowSubs_DemoData_test.cdc` - Comprehensive Cadence test suite

### JavaScript Tests  
- `tests/FlowSubs_DemoData_test.js` - Frontend integration and data generation tests

### Test Runners
- `scripts/run_demo_tests.sh` - Bash test runner for Linux/Mac
- `scripts/run_demo_tests.ps1` - PowerShell test runner for Windows

## Running Tests

### Quick Start

**Linux/Mac:**
```bash
chmod +x scripts/run_demo_tests.sh
./scripts/run_demo_tests.sh
```

**Windows:**
```powershell
.\scripts\run_demo_tests.ps1 -ContractAddress 0xYourContractAddress
```

### Individual Test Categories

#### 1. Contract Deployment Tests
```bash
flow test tests/FlowSubs_DemoData_test.cdc --test testContractDeployment
```

**Validates:**
- Contract deploys without errors
- Basic contract functionality works
- Initial state is correct

#### 2. Provider Registration Tests
```bash
flow test tests/FlowSubs_DemoData_test.cdc --test testProviderRegistration
```

**Validates:**
- Providers can be registered successfully
- Provider data is stored correctly
- Provider queries return expected results

#### 3. Subscription Creation Tests
```bash
flow test tests/FlowSubs_DemoData_test.cdc --test testSubscriptionCreation
```

**Validates:**
- Subscriptions are created with valid amounts (5-10 FLOW)
- Payment intervals are set correctly (30 days)
- Subscription data is stored properly
- All subscriptions are marked as active

#### 4. Invalid Input Tests
```bash
flow test tests/FlowSubs_DemoData_test.cdc --test testInvalidSubscriptionAmounts
```

**Validates:**
- Negative amounts are rejected
- Zero amounts are rejected
- Amounts below minimum (0.01 FLOW) are rejected

#### 5. Duplicate Subscription Tests
```bash
flow test tests/FlowSubs_DemoData_test.cdc --test testDuplicateSubscriptions
```

**Validates:**
- Multiple subscriptions to same provider are allowed
- Each subscription has unique ID
- Subscription data is consistent

#### 6. Demo Data Structure Tests
```bash
flow test tests/FlowSubs_DemoData_test.cdc --test testDemoDataStructure
```

**Validates:**
- Exactly 3 providers are created
- Each provider has 2-3 subscribers
- All subscription amounts are within 5-10 FLOW range
- Total of 8 subscriptions are created
- All subscriptions use monthly intervals

#### 7. Event Emission Tests
```bash
flow test tests/FlowSubs_DemoData_test.cdc --test testSubscriptionEvents
```

**Validates:**
- SubscriptionCreated events are emitted
- Event data is correct
- Events can be monitored by frontend

#### 8. Query Function Tests
```bash
flow test tests/FlowSubs_DemoData_test.cdc --test testQueryFunctions
```

**Validates:**
- getAllProviders() returns correct data
- getProvider() returns specific provider info
- getProviderSubscriptions() returns provider's subscriptions
- getSubscriberSubscriptions() returns subscriber's subscriptions

### JavaScript Tests

#### Demo Data Generation Tests
```bash
node tests/FlowSubs_DemoData_test.js
```

**Validates:**
- Demo data generator creates correct structure
- Provider data is valid
- Subscription data is realistic
- Payment history is generated correctly

#### Frontend Integration Tests
```bash
npx jest tests/FlowSubs_DemoData_test.js --verbose
```

**Validates:**
- Data is compatible with React hooks
- Filtering functions work correctly
- Data consistency across components
- Performance is acceptable

## Test Data Structure

### Expected Demo Data

**Providers (3):**
1. Premium Streaming Service (`0x1234567890abcdef`)
2. Basic Cloud Storage (`0xfedcba0987654321`)
3. Enterprise Analytics (`0x9876543210fedcba`)

**Subscriptions (8):**
- Provider 1: 3 subscriptions (5.0, 7.5, 10.0 FLOW)
- Provider 2: 3 subscriptions (6.0, 8.0, 9.0 FLOW)
- Provider 3: 2 subscriptions (5.5, 7.0 FLOW)

**Payment History:**
- 2-3 past payments per subscription
- Realistic timestamps and transaction IDs
- Consistent amounts with subscriptions

## Test Assertions

### Contract Tests
```cadence
// Provider registration
assert(providers.length == 3, message: "Expected 3 providers")

// Subscription creation
assert(subscription.amount >= 5.0, message: "Amount too low")
assert(subscription.amount <= 10.0, message: "Amount too high")

// Data structure
assert(totalSubscriptions == 8, message: "Expected 8 total subscriptions")
```

### JavaScript Tests
```javascript
// Data generation
expect(demoData.providers).toHaveLength(3);
expect(demoData.subscriptions).toHaveLength(8);

// Amount validation
expect(subscription.amount).toBeGreaterThanOrEqual(5.0);
expect(subscription.amount).toBeLessThanOrEqual(10.0);

// Frontend compatibility
expect(mockHookReturn.providers).toBeDefined();
expect(mockHookReturn.subscriptions).toBeDefined();
```

## Test Coverage

### Contract Functionality
- ✅ Contract deployment
- ✅ Provider registration
- ✅ Subscription creation
- ✅ Subscription cancellation
- ✅ Data queries
- ✅ Event emission
- ✅ Error handling

### Data Validation
- ✅ Provider data structure
- ✅ Subscription data structure
- ✅ Payment history structure
- ✅ Amount validation (5-10 FLOW)
- ✅ Interval validation (monthly)
- ✅ Address format validation

### Frontend Integration
- ✅ React hook compatibility
- ✅ Data filtering functions
- ✅ Error state handling
- ✅ Loading state management
- ✅ Performance requirements

### Edge Cases
- ✅ Invalid input handling
- ✅ Empty data scenarios
- ✅ Duplicate data handling
- ✅ Error recovery

## Continuous Integration

### GitHub Actions Example
```yaml
name: FlowSubs Demo Data Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Flow CLI
        run: |
          sh -ci "$(curl -fsSL https://storage.googleapis.com/flow-cli/install.sh)"
      - name: Run Cadence Tests
        run: ./scripts/run_demo_tests.sh
      - name: Run JavaScript Tests
        run: |
          npm install
          npx jest tests/FlowSubs_DemoData_test.js
```

## Debugging Failed Tests

### Common Issues

1. **Contract Address Not Updated**
   ```bash
   # Replace 0xYOUR_CONTRACT_ADDRESS in all files
   find . -name "*.cdc" -exec sed -i 's/0xYOUR_CONTRACT_ADDRESS/0xYourActualAddress/g' {} \;
   ```

2. **Flow CLI Not Found**
   ```bash
   # Install Flow CLI
   sh -ci "$(curl -fsSL https://storage.googleapis.com/flow-cli/install.sh)"
   ```

3. **Missing Dependencies**
   ```bash
   # Install Node.js dependencies
   npm install
   ```

4. **Syntax Errors**
   ```bash
   # Check Cadence syntax
   flow transactions build transactions/register_demo_provider.cdc --dry-run
   ```

### Debug Mode
Enable detailed logging:
```bash
flow test tests/FlowSubs_DemoData_test.cdc --verbose
```

## Performance Benchmarks

### Expected Performance
- **Contract Deployment**: < 5 seconds
- **Provider Registration**: < 2 seconds per provider
- **Subscription Creation**: < 3 seconds per subscription
- **Data Queries**: < 1 second
- **Demo Data Generation**: < 100ms

### Test Execution Time
- **Full Test Suite**: < 2 minutes
- **Individual Tests**: < 30 seconds each
- **JavaScript Tests**: < 10 seconds

## Test Maintenance

### Adding New Tests
1. Add test function to `FlowSubs_DemoData_test.cdc`
2. Add corresponding JavaScript test if needed
3. Update test runner scripts
4. Update documentation

### Updating Test Data
1. Modify `DEMO_DATA` constants in generator
2. Update expected assertions
3. Re-run all tests
4. Update documentation

## Best Practices

### Test Design
- ✅ One assertion per test concept
- ✅ Clear test names describing what's being tested
- ✅ Proper setup and teardown
- ✅ Isolated test cases

### Data Validation
- ✅ Test both valid and invalid inputs
- ✅ Verify data structure consistency
- ✅ Check edge cases and boundary conditions
- ✅ Validate error handling

### Frontend Testing
- ✅ Test hook integration
- ✅ Verify data filtering
- ✅ Check loading and error states
- ✅ Validate performance requirements

## Support

For test-related issues:
- Check the [Flow documentation](https://docs.onflow.org/)
- Review [Cadence testing guide](https://docs.onflow.org/cadence/testing/)
- Open an issue on GitHub
- Contact the development team
