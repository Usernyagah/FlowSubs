// Forte Workflow Integration Example
// This example shows how to integrate FlowSubs with Forte Workflows for automated payments

const { FlowService } = require('@forte-network/flow-service');
const { WorkflowEngine } = require('@forte-network/workflow-engine');

class FlowSubsWorkflow {
    constructor(flowService, contractAddress) {
        this.flowService = flowService;
        this.contractAddress = contractAddress;
        this.workflowEngine = new WorkflowEngine();
    }

    // Initialize the workflow
    async initialize() {
        // Set up the workflow to run every hour
        await this.workflowEngine.schedule('process-subscriptions', {
            interval: '0 * * * *', // Every hour
            handler: this.processSubscriptions.bind(this)
        });

        console.log('FlowSubs workflow initialized');
    }

    // Main workflow function to process subscriptions
    async processSubscriptions() {
        try {
            console.log('Starting subscription processing...');

            // Get all subscriptions due for payment
            const dueSubscriptions = await this.getDueSubscriptions();
            console.log(`Found ${dueSubscriptions.length} subscriptions due for payment`);

            // Process each subscription
            for (const subscriptionId of dueSubscriptions) {
                await this.processSubscription(subscriptionId);
            }

            console.log('Subscription processing completed');
        } catch (error) {
            console.error('Error processing subscriptions:', error);
        }
    }

    // Get subscriptions that are due for payment
    async getDueSubscriptions() {
        const script = `
            import FlowSubs from ${this.contractAddress}
            
            pub fun main(): [UInt64] {
                // This would call the contract's getDueSubscriptions function
                // In practice, you'd need to implement this in Cadence
                return []
            }
        `;

        try {
            const result = await this.flowService.executeScript({
                script: script,
                network: 'testnet'
            });
            return result.value || [];
        } catch (error) {
            console.error('Error getting due subscriptions:', error);
            return [];
        }
    }

    // Process a single subscription
    async processSubscription(subscriptionId) {
        try {
            console.log(`Processing subscription ${subscriptionId}...`);

            // Check if subscription exists and is valid
            const subscription = await this.getSubscription(subscriptionId);
            if (!subscription) {
                console.log(`Subscription ${subscriptionId} not found, skipping`);
                return;
            }

            // Check if payment is actually due
            const currentTime = Date.now() / 1000; // Convert to seconds
            if (currentTime < subscription.nextPaymentTime) {
                console.log(`Subscription ${subscriptionId} not due yet, skipping`);
                return;
            }

            // Execute the payment
            const success = await this.executePayment(subscriptionId);
            
            if (success) {
                console.log(`✅ Payment executed successfully for subscription ${subscriptionId}`);
                
                // Log the payment event
                await this.logPaymentEvent(subscriptionId, subscription);
            } else {
                console.log(`❌ Payment failed for subscription ${subscriptionId}`);
                
                // Handle payment failure (e.g., insufficient funds)
                await this.handlePaymentFailure(subscriptionId, subscription);
            }

        } catch (error) {
            console.error(`Error processing subscription ${subscriptionId}:`, error);
        }
    }

    // Get subscription details
    async getSubscription(subscriptionId) {
        const script = `
            import FlowSubs from ${this.contractAddress}
            
            pub fun main(subscriptionId: UInt64): FlowSubs.Subscription? {
                // This would call the contract's getSubscription function
                return nil
            }
        `;

        try {
            const result = await this.flowService.executeScript({
                script: script,
                args: [{ type: 'UInt64', value: subscriptionId.toString() }],
                network: 'testnet'
            });
            return result.value;
        } catch (error) {
            console.error(`Error getting subscription ${subscriptionId}:`, error);
            return null;
        }
    }

    // Execute payment for a subscription
    async executePayment(subscriptionId) {
        const transaction = `
            import FlowSubs from ${this.contractAddress}
            
            transaction(subscriptionId: UInt64) {
                prepare(acct: AuthAccount) {
                    let flowSubs = acct.getContract<&FlowSubs>(name: "FlowSubs")
                    let success = flowSubs.executePayment(subscriptionId: subscriptionId)
                    
                    if !success {
                        panic("Payment execution failed")
                    }
                }
            }
        `;

        try {
            const result = await this.flowService.sendTransaction({
                transaction: transaction,
                args: [{ type: 'UInt64', value: subscriptionId.toString() }],
                network: 'testnet'
            });

            return result.success;
        } catch (error) {
            console.error(`Error executing payment for subscription ${subscriptionId}:`, error);
            return false;
        }
    }

    // Log payment event
    async logPaymentEvent(subscriptionId, subscription) {
        // In a real implementation, you might want to:
        // - Store payment history in a database
        // - Send notifications to subscribers
        // - Update analytics dashboards
        
        console.log(`Payment logged: Subscription ${subscriptionId}, Amount: ${subscription.amount} FLOW`);
    }

    // Handle payment failure
    async handlePaymentFailure(subscriptionId, subscription) {
        // In a real implementation, you might want to:
        // - Send notification to subscriber
        // - Retry payment after some time
        // - Suspend subscription after multiple failures
        
        console.log(`Payment failure handled for subscription ${subscriptionId}`);
    }

    // Start the workflow
    async start() {
        await this.initialize();
        console.log('FlowSubs workflow started');
    }

    // Stop the workflow
    async stop() {
        await this.workflowEngine.stop();
        console.log('FlowSubs workflow stopped');
    }
}

// Usage example
async function main() {
    // Initialize Flow service
    const flowService = new FlowService({
        network: 'testnet',
        // Add your Flow service configuration
    });

    // Contract address (replace with your deployed contract address)
    const contractAddress = '0xYOUR_CONTRACT_ADDRESS';

    // Create and start the workflow
    const flowSubsWorkflow = new FlowSubsWorkflow(flowService, contractAddress);
    await flowSubsWorkflow.start();

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        console.log('Shutting down FlowSubs workflow...');
        await flowSubsWorkflow.stop();
        process.exit(0);
    });
}

// Run the example
if (require.main === module) {
    main().catch(console.error);
}

module.exports = FlowSubsWorkflow;

