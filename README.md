# FlowSubs

**The Complete Platform for Blockchain Subscriptions**

FlowSubs is a decentralized subscription management platform built on Flow blockchain, enabling secure recurring payments with smart contracts and automated workflows.

> **🎉 MVP Complete!** Fully deployed on Flow Testnet with all features. Ready for use and testing.

## Overview

FlowSubs revolutionizes subscription-based services by leveraging blockchain technology to create trustless, automated recurring payments. Built on Flow's developer-friendly blockchain, it provides a seamless experience for both service providers and subscribers with transparent, secure, and automated payment processing.

## 🚀 Features

### 💳 Recurring Onchain Subscriptions ✅
- **Smart Contract Automation**: Automated recurring payments powered by Cadence smart contracts
- **Flexible Intervals**: Support for daily, weekly, monthly, and custom payment schedules
- **Secure Payments**: Trustless payment execution with guaranteed fund transfers
- **Subscription Management**: Create, view, and cancel subscriptions directly from the UI
- **Payment Scheduling**: Automatic tracking of next payment dates

### 🔗 Wallet Connection ✅
- **Flow-Compatible Wallets**: Support for Blocto, Lilico, and other Flow wallets
- **Seamless Authentication**: One-click wallet connection with persistent sessions
- **Cross-Platform**: Works on desktop and mobile devices
- **Security First**: Private keys never leave your wallet
- **Wallet Detection**: Automatic detection of connected wallet type
- **Address Validation**: Prevents connection with placeholder or test addresses

### 📊 Subscription Dashboard ✅
- **Real-Time Data**: Live subscription metrics and status tracking
- **Payment Schedule**: View upcoming payment dates for all subscriptions
- **Subscription Management**: Easy creation and cancellation of subscriptions
- **Wallet Integration**: Seamless connection to Flow testnet wallets
- **Transaction Tracking**: Monitor subscription status on-chain

### 💰 Provider Features ✅
- **Provider Registration**: Register as a service provider on-chain
- **Subscriber Tracking**: View all users subscribed to your service
- **Revenue Dashboard**: Monitor earnings and active subscriptions
- **Provider Profile**: Manage your provider information
- **Payment Visibility**: Track subscription payments to your wallet

## 🛠 Tech Stack

### Blockchain & Smart Contracts
- **Flow Blockchain**: High-performance, developer-friendly blockchain
- **Cadence**: Resource-oriented smart contract language
- **Forte Workflows**: Enterprise automation and payment processing

### Frontend & UI
- **Next.js 15**: React framework with App Router and Server Components
- **TypeScript**: Type-safe development with full IntelliSense support
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **ShadCN UI**: Beautiful, accessible component library
- **Framer Motion**: Smooth animations and micro-interactions

### Blockchain Integration
- **FCL (Flow Client Library)**: Seamless blockchain interaction
- **Flow CLI**: Development and deployment tools
- **Flow Testnet**: Testing environment for development

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and **pnpm** (recommended) or npm
- **Flow CLI** - [Installation Guide](https://docs.onflow.org/cli/install/)
- **Git** for version control
- **Modern web browser** with wallet support

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Usernyagah/FlowSubs.git
cd flowsubs-app
```

### 2. Install Frontend Dependencies

```bash
cd client
pnpm install
```

### 3. Configure Environment

Create `client/.env.local` and add:
```bash
NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS=0xc1b85cc9470b7283
```

### 4. Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Contract Setup

### Deployed Contract (Flow Testnet)

✅ **FlowSubs is fully deployed to Flow Testnet with all features!**

The contract is live at: `0xc1b85cc9470b7283`

**Latest Update**: Contract updated with provider dashboard functions (October 24, 2025)

**Quick Setup:**

1. **Set Environment Variable**:
   Create a `client/.env.local` file and add:
   ```bash
   NEXT_PUBLIC_FLOWSUBS_CONTRACT_ADDRESS=0xc1b85cc9470b7283
   ```

2. **Start Development**:
   ```bash
   cd client
   pnpm install
   pnpm dev
   ```

3. **Connect Your Wallet**:
   - Open [http://localhost:3001](http://localhost:3001)
   - Click "Connect Wallet"
   - Use Blocto, Lilico, or another Flow testnet wallet
   - Start creating subscriptions!

**Contract Features**:
- ✅ Create & cancel subscriptions
- ✅ Register as provider
- ✅ Query subscriptions by subscriber
- ✅ Query subscriptions by provider (NEW)
- ✅ Get due subscriptions for payment tracking (NEW)
- ✅ Fully Cadence 1.0 compliant

### Contract Addresses

| Contract | Testnet Address | Description |
|----------|----------------|-------------|
| FlowSubs | `0xc1b85cc9470b7283` | Main subscription contract (✅ Deployed) |
| FlowToken | `0x7e60df042a9c0868` | FLOW token contract |
| FungibleToken | `0x9a0766d93b6608b7` | Fungible token standard |

### Deploy Your Own Instance (Optional)

If you want to deploy your own instance of the contract, you can use the Flow CLI:

```bash
# From project root
flow project deploy --network testnet
```

Or deploy via a Cadence transaction from your wallet interface.

## 🧪 Testing

### Run Contract Tests

```bash
# Run all Cadence tests
flow test tests/FlowSubs_DemoData_test.cdc

# Run specific test
flow test tests/FlowSubs_DemoData_test.cdc --test testContractDeployment
```

### Run Frontend Tests

```bash
# Run JavaScript tests
pnpm test

# Run with coverage
pnpm test:coverage
```

### Demo Data Setup

Set up demo data for testing:

```bash
# Linux/Mac
chmod +x scripts/setup_demo_data.sh
./scripts/setup_demo_data.sh

# Windows
.\scripts\setup_demo_data.ps1 -ContractAddress 0xc1b85cc9470b7283
```

## 📱 Usage

### For Subscribers

1. **Connect Wallet**: Click "Connect Wallet" and authorize with your Flow wallet
2. **Browse Providers**: Explore available subscription services
3. **Create Subscription**: Choose a provider, set amount and interval
4. **Manage Subscriptions**: View, modify, or cancel subscriptions from your dashboard

### For Providers

1. **Register as Provider**: Create your service profile with name and description
2. **Share Your Address**: Provide your Flow address to potential subscribers
3. **Track Revenue**: Monitor incoming payments and subscriber analytics
4. **Manage Services**: Update service details and pricing

## 🏗 Project Structure

```
flowsubs-app/
├── client/                 # Frontend Application (Next.js)
│   ├── app/               # Next.js app directory
│   │   ├── dashboard/    # User dashboard
│   │   ├── subscribe/    # Create subscriptions
│   │   ├── page.tsx      # Landing page
│   │   └── layout.tsx    # App layout
│   ├── components/       # React components & UI
│   ├── hooks/            # Custom React hooks
│   │   ├── useFlowWallet.ts
│   │   └── useFlowSubs.ts
│   ├── lib/              # Utilities & FCL config
│   ├── public/           # Static assets
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript definitions
│   └── package.json      # Frontend dependencies
│
├── cadence/              # Smart Contracts (Cadence 1.0)
│   └── contracts/
│       └── FlowSubs.cdc # Main subscription contract
│
├── transactions/         # Cadence transactions
├── scripts/             # Cadence read scripts
├── tests/               # Contract tests
└── flow.json            # Flow CLI configuration
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed information.

## 🔒 Security

- **Smart Contract Audits**: All contracts undergo comprehensive testing
- **Wallet Security**: Private keys never leave user wallets
- **Input Validation**: Comprehensive validation on all user inputs
- **Access Control**: Proper authorization checks for all operations
- **Event Logging**: Complete audit trail of all transactions

## 🌐 Network Support

| Network | Status | Contract Address |
|---------|--------|------------------|
| Flow Testnet | ✅ Active | `0xc1b85cc9470b7283` |
| Flow Mainnet | 🚧 Coming Soon | TBD |

## 📸 Screenshots

### Dashboard Overview
![Dashboard Screenshot](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Subscription+Dashboard)

### Wallet Connection
![Wallet Connection](https://via.placeholder.com/400x300/1a1a1a/ffffff?text=Wallet+Connection)

### Subscription Creation
![Subscription Creation](https://via.placeholder.com/400x500/1a1a1a/ffffff?text=Create+Subscription)

### Provider Analytics
![Provider Analytics](https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Revenue+Analytics)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **TypeScript**: All code must be properly typed
- **ESLint**: Follow the configured linting rules
- **Prettier**: Code formatting is enforced
- **Tests**: New features must include tests
- **Documentation**: Update docs for new features

## 📚 Documentation

- [Project Structure Guide](PROJECT_STRUCTURE.md) - Detailed project organization
- [Flow Blockchain Docs](https://docs.onflow.org/) - Flow blockchain documentation
- [Cadence Language](https://cadence-lang.org/) - Smart contract language reference
- [FCL Documentation](https://docs.onflow.org/fcl/) - Flow Client Library guide

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/Usernyagah/FlowSubs/issues) with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/device information

## 💡 Feature Requests

Have an idea? We'd love to hear it! [Open a feature request](https://github.com/Usernyagah/FlowSubs/issues) with:

- Detailed description of the feature
- Use case and benefits
- Mockups or examples (if applicable)

## 🛣 Roadmap

### Phase 1: Core Platform ✅
- [x] Smart contract development
- [x] Frontend application
- [x] Wallet integration
- [x] Basic subscription management

### Phase 2: Enhanced Features 🚧
- [ ] Advanced analytics dashboard
- [ ] Multi-token support
- [ ] Subscription templates
- [ ] API for third-party integrations

### Phase 3: Enterprise Features 📋
- [ ] White-label solutions
- [ ] Advanced reporting
- [ ] Compliance tools
- [ ] Enterprise support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

### Core Team
- **Development Team**: FlowSubs Contributors
- **Smart Contracts**: Cadence & Flow Blockchain
- **Frontend**: Next.js & React Community
- **UI Components**: ShadCN UI & Tailwind CSS

### Special Thanks
- **Flow Foundation** for the amazing blockchain platform
- **Forte Network** for workflow automation capabilities
- **Open Source Community** for the incredible tools and libraries

## 📞 Support

- **Documentation**: [docs.flowsubs.com](https://docs.flowsubs.com)
- **Discord**: [Join our community](https://discord.gg/flowsubs)
- **Twitter**: [@FlowSubs](https://twitter.com/flowsubs)
- **Email**: support@flowsubs.com

## ⭐ Star This Project

If you find FlowSubs useful, please give it a star on GitHub! It helps us reach more developers and build a stronger community.

---

**Built with ❤️ on Flow Blockchain**