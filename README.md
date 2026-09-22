# FairwayFund

**Play Golf. Support Charities. Win Prizes.**

FairwayFund combines your passion for golf with charitable giving. Submit your Stableford scores, enter monthly draws, support amazing causes, and win prizes.

## Features

- **Score Tracking**: Log your Stableford scores (1-45 points)
- **Charity Support**: Choose from verified charities, minimum 10% contribution
- **Monthly Draws**: Automatic entry with 3-match, 4-match, and 5-match prize pools
- **Winner Verification**: Fair and transparent proof submission process
- **Flexible Subscriptions**: Monthly or yearly plans

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Testing**: Vitest + Playwright
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node 20)
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fairwayfund

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript type checking

# Testing
npm test           # Run unit tests
npm run test:watch # Run tests in watch mode
npm run test:e2e   # Run E2E tests
```

## Project Structure

```
fairwayfund/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin panel
│   └── ...
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   ├── marketing/        # Marketing components
│   ├── dashboard/        # Dashboard components
│   └── admin/            # Admin components
├── lib/                  # Business logic
│   ├── services/        # Service layer
│   ├── validation/      # Zod schemas
│   ├── utils/           # Utilities
│   └── config/          # App configuration
├── types/               # TypeScript types
├── data/mock/           # Mock data
├── tests/               # Tests
├── docs/                # Documentation
└── config/              # Route/navigation config
```

## Development Status

### ✅ Complete

- Project foundation and folder structure
- Type definitions
- Validation schemas
- Mock data
- Service layer abstractions
- Reusable UI components
- Marketing pages (Homepage, How It Works, Pricing, Charities)
- Authentication UI (Login, Signup)
- Dashboard foundation
- Admin panel foundation
- Unit tests
- E2E smoke tests
- Documentation

### 🔄 Not Yet Connected

- **Supabase**: Authentication and database
- **Vercel**: Deployment
- **Supabase Storage**: File storage

### ✅ Implemented (Test Mode)

- **Test Payment Mode**: Development-only payment simulation (no real payment gateway required)

The architecture is ready for these integrations. See `docs/architecture.md` for details.

## Documentation

- [Architecture](./docs/architecture.md) - System design and integration points
- [Business Rules](./docs/business-rules.md) - Core rules and requirements
- [Development Guide](./docs/development.md) - Development workflow

## License

All rights reserved.

## Contact

For more information, visit [fairwayfund.com](https://fairwayfund.com)
