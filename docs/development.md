# FairwayFund Development Guide

## Prerequisites

- Node.js 18+ (recommended: Node 20)
- npm or pnpm
- Git

## Installation

```bash
git clone <repository-url>
cd fairwayfund
npm install
```

## Development

### Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Demo Accounts

For testing authentication:

**Subscriber Account:**
- Email: `subscriber@example.local`
- Password: `subscriber123`

**Admin Account:**
- Email: `admin@example.local`
- Password: `admin123`

### Code Quality

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Running tests
npm test
npm run test:watch

# E2E tests
npm run test:e2e

# Build
npm run build
npm start  # Run production build
```

## Project Structure

- `app/` - Next.js App Router pages and routing
- `components/` - Reusable React components
- `lib/` - Business logic, services, utilities
- `types/` - TypeScript type definitions
- `data/mock/` - Mock/development data
- `hooks/` - React hooks
- `config/` - Route and navigation configuration
- `tests/` - Unit and E2E tests
- `docs/` - Documentation

## Creating Components

### UI Component

```typescript
// components/ui/MyButton.tsx
import { cn } from '@/lib/utils/cn';

type MyButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export function MyButton({ children, variant = 'primary', className }: MyButtonProps) {
  return (
    <button className={cn(
      'px-4 py-2 rounded-lg transition-colors',
      variant === 'primary' && 'bg-green-600 text-white hover:bg-green-700',
      className
    )}>
      {children}
    </button>
  );
}
```

### Form Component

```typescript
// components/forms/MyForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { mySchema, type MyFormData } from '@/lib/validation/my.validation';

export function MyForm() {
  const [formData, setFormData] = useState<MyFormData>({});
  const [errors, setErrors] = useState<Partial<Record<keyof MyFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = mySchema.safeParse(formData);
    if (!result.success) {
      // Handle validation errors
      return;
    }

    // Handle success
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Page Component

```typescript
// app/my-page/page.tsx
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export const metadata: Metadata = {
  title: 'My Page | FairwayFund',
  description: 'Description for SEO',
};

export default function MyPage() {
  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold text-gray-900">My Page</h1>
      </Container>
    </Section>
  );
}
```

## Adding a New Service

```typescript
// lib/services/my.service.ts
import { myMockData } from '@/data/mock/my-data';

export const myService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return myMockData;
  },

  async getById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return myMockData.find(item => item.id === id) || null;
  },
};
```

## Validation

Use Zod for runtime validation:

```typescript
// lib/validation/my.validation.ts
import { z } from 'zod';

export const mySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
});

export type MyFormData = z.infer<typeof mySchema>;
```

## Styling

- Use Tailwind CSS utility classes
- Use `cn()` from `@/lib/utils/cn` for conditional classes
- Mobile-first responsive design
- Respect `prefers-reduced-motion`

## TypeScript

- Always add types to component props
- Use strict mode (no `any`)
- Export types from component files when needed
- Use generics for reusable utilities

## Testing

### Unit Tests

```typescript
// tests/unit/my.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/utils/my';

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction('input')).toBe('output');
  });
});
```

### E2E Tests

```typescript
// tests/e2e/my.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('FairwayFund');
});
```

## Git Workflow

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push branch: `git push origin feature/name`
4. Create PR for review

## Common Commands

```bash
# Run all checks
npm run lint && npm run typecheck && npm test && npm run build

# Watch mode for development
npm run dev

# Format code
npm run lint --fix

# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

### Build fails with TypeScript errors
```bash
rm -rf .next
npm run typecheck
```

### Tests fail
```bash
npm test -- --reporter=verbose
```

### Port 3000 already in use
```bash
PORT=3001 npm run dev
```

## Authentication

The app uses local development authentication:

- Login/signup stores session in localStorage
- Session expires after 7 days
- Demo accounts available for testing
- AuthGuard protects routes

To test:
1. Visit `/login`
2. Use demo credentials (see Development section)
3. Access protected routes like `/dashboard`

## Draw System (Step 7A)

The monthly draw foundation is implemented:

- Prize pool calculations in pence (minor units)
- Draw configuration and simulation
- Eligibility checking
- Admin draw management at `/admin/draws`
- Subscriber draw view at `/draws`

**Note**: Step 7A provides the foundation. Final winner generation and publishing are implemented in Step 7B.

## API Integration (Future)

When connecting to real services, update service files in `lib/services/` without changing component APIs.

Example migration:
```typescript
// Before (local)
const users = await userService.getAll();

// After (Supabase) - component code unchanged
const { data, error } = await supabase
  .from('users')
  .select('*');
```
