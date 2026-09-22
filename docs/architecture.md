# FairwayFund Architecture

## Overview

FairwayFund is a Next.js application built with the App Router, TypeScript, and Tailwind CSS. The architecture is designed to be modular, scalable, and ready for external service integration.

## Project Structure

```
fairwayfund/
├── app/                  # Next.js App Router pages
│   ├── scores/          # Score management hub
│   ├── subscription/    # Subscription management
│   ├── dashboard/       # Subscriber dashboard
│   ├── admin/           # Admin panel
│   └── ...
├── components/           # Reusable UI components
│   ├── scores/          # Score management components
│   ├── subscription/    # Subscription components
│   ├── auth/            # Auth components
│   └── ...
├── lib/                  # Business logic and utilities
│   ├── services/        # Service layer abstractions (score, auth, subscription, etc.)
│   ├── validation/      # Zod validation schemas
│   ├── utils/           # Utilities (score, date, formatting, cn)
│   └── ...
├── types/               # TypeScript type definitions
├── data/mock/           # Mock data for development
├── hooks/               # React hooks (useAuth, useSubscription, useScores)
├── config/              # Route and navigation config
├── tests/               # Unit and E2E tests
└── docs/                # Documentation
```

## Golf Score Architecture (Step 5)

### Core Logic & Rules
1. **Stableford Range**: Strict validation enforcing integer scores from 1 to 45 points.
2. **One Score Per Date**: Single round per calendar day. Duplicate date submissions are rejected with clear error feedback.
3. **Five-Score Maximum**: A user retains at most 5 scores. When a 6th score is recorded, the oldest round drops off automatically.
4. **Newest-First Display**: Scores are consistently sorted in descending chronological order.
5. **Ownership Enforcement**: Service-level checks verify score ownership before allow edit or delete operations.

### Future Supabase Integration
```
Current (Local Dev):
UI Components (ScoreManager, ScoreForm, ScoreList)
                      ↓
               hooks/useScores
                      ↓
          lib/services/score.service (in-memory & local mock)

Future (Production):
UI Components (unchanged)
                      ↓
               hooks/useScores (unchanged)
                      ↓
          lib/services/score.service (Supabase Client + RLS)
```

## Authentication Architecture (Step 3)

### Current: Local Development Authentication
- **Storage**: `localStorage` (development only)
- **Session**: 7-day expiration with refresh on app load
- **User roles**: `subscriber` and `admin`
- **Mock users**: 
  - Subscriber: `subscriber@example.local` / `subscriber123`
  - Admin: `admin@example.local` / `admin123`

## Subscription Architecture (Step 4)
- **Plans**: Monthly (£10/month) and Yearly (£100/year)
- **Centralized Config**: `lib/subscription/subscription-config.ts`
- **Access Control**: Gated features (`canParticipateInDraw`, `getSubscriptionAccessLevel`)

## Draw Architecture (Step 7A Foundation)

### Core Components
```
UI Layer
  ├── app/draws/                    (Subscriber draw page)
  ├── app/admin/draws/               (Admin draw management)
  └── components/draw/               (Draw UI components)

Business Logic Layer
  ├── lib/draw/
  │   ├── draw-config.ts            (Prize tiers, modes, eligibility rules)
  │   ├── prize-pool.ts             (Money-safe calculations)
  │   ├── draw-eligibility.ts       (Eligibility checks)
  │   └── draw-utils.ts             (Helper utilities)
  │
  ├── lib/services/draw.service.ts  (Draw CRUD, simulation)
  └── lib/validation/draw.validation.ts

Data Layer
  └── data/mock/draws.ts            (Development draw data)
```

### Prize Pool Calculations
- All monetary values stored in **pence** (minor units) to avoid floating-point errors
- Formula: `total_pence = revenue_pence + rollover_pence`
- Distribution: 40% / 35% / 25% using integer arithmetic
- Currency conversion: `poundsToPence()` and `penceToPounds()`
- Formatting: `formatCurrency(pence, currency)`

### Draw Modes
- **Random**: Pure random generation (implementation in Step 7B)
- **Algorithmic**: Score-frequency based (implementation in Step 7B)
- Mode selection available during draw configuration
- Mode stored with draw record for auditability

### Draw Eligibility
```
isEligibleForDraw(subscription, scores)
  └── hasActiveSubscription(subscription)  ✓ Active, not expired/cancelled
  └── hasRequiredScores(scores)            ✓ At least 1 score recorded
```

### Draw Lifecycle (Step 7A)
1. **Draft** → Admin creates new draw
2. **Configuring** → Admin sets mode, date, parameters
3. **Simulating** → System previews prize distribution
4. **Ready** → Configuration complete
5. **Published** → Winners published (Step 7B)
6. **Completed** → Draw finalized (Step 7B)

### Jackpot Rollover
```
Draw N (no 5-match winner):
  5-match pool = £400
  
Draw N+1:
  Base 5-match = 40% of new revenue = £440
  Rollover = £400
  Total 5-match pool = £840
```

### Future Integration (Step 7B)
- Winner generation (random and algorithmic)
- Number matching logic
- Winner record creation
- Draw result publishing
- Payout tracking
