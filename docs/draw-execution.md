# Draw System - Step 7B: Execution & Results

## Draw Execution

### Random Mode
- Uses `crypto.getRandomValues()` for cryptographically secure random number generation
- Generates exactly 5 unique numbers in range 1-45 (valid Stableford scores)
- No duplicates, sorted in ascending order

### Algorithmic Mode
- **Score-frequency based weighting**
- Algorithm:
  1. Collect all scores from eligible subscribers
  2. Count frequency of each score value (1-45)
  3. Calculate probability weights: `weight = frequency + 1`
  4. Use weighted random selection without replacement
  5. Fallback to pure random if < 10 scores available

**Why this works:**
- More commonly scored values have higher probability of being drawn
- All numbers maintain non-zero probability (fairness)
- Still random but influenced by actual player performance
- Deterministic weighting formula: simple frequency counting

### Number Generation
- Exactly 5 unique numbers per draw
- Range: 1-45 (matches Stableford score range)
- Sorted for consistent comparison
- Repeatable format for matching

## Matching Algorithm

For each eligible subscriber:
1. Get user's 5 most recent valid scores
2. Compare against draw's 5 numbers
3. Count exact matches (order-independent)
4. Classify:
   - 5 matches → 5-match tier
   - 4 matches → 4-match tier
   - 3 matches → 3-match tier
   - < 3 matches → no prize

## Prize Calculation

### Distribution (from Step 7A)
- 5-match: 40% of prize pool
- 4-match: 35% of prize pool
- 3-match: 25% of prize pool

### Equal Winner Splitting
```
Prize per winner = floor(tier pool / winner count)
```

Using integer division (pence) to avoid floating-point errors.

### Example
```
Prize pool: £1000 (100,000 pence)
5-match pool: 40,000 pence
Winners: 2

Prize per winner: 40,000 / 2 = 20,000 pence (£200)
```

## Jackpot Rollover

### No 5-match Winner
- Full 5-match prize pool rolls over to next draw
- Rollover adds to next draw's base 5-match allocation
- Formula: `new 5-match = (40% of new revenue) + previous rollover`

### 5-match Winner(s) Exist
- No rollover
- Prize distributed to winner(s)
- Next draw starts fresh

**Only 5-match rolls over.** 4-match and 3-match never roll over.

## Winner Records

Each winner gets a record with:
- `drawId` - Which draw they won
- `userId` - Winner's user ID
- `matchType` - '5-match', '4-match', or '3-match'
- `prizeAmount` - Their prize in pence
- `status` - Initially 'pending_proof'
- `createdAt` - When winner was determined

## Execution Lifecycle

```
Draft/Configuring/Ready
         ↓
    Execute Draw
         ↓
  Generate Numbers (random or algorithmic)
         ↓
   Calculate Matches
         ↓
  Create Winner Records
         ↓
    Store Result
         ↓
   Ready to Publish
         ↓
   Publish Draw
         ↓
  Status: Published
         ↓
  (Eventually: Completed)
```

## Execution Protection

### Cannot Execute
- Already completed/published draws
- Draft draws (must be configured first)

### Cannot Publish
- Unexecuted draws (execute first)
- Already published draws (idempotent - safe to call again)

### Idempotency
- Executing same draw twice returns existing result
- Publishing same draw twice succeeds without changes
- Same draw always produces same winners (result cached)

## Implementation Files

### Core Logic
- `lib/draw/draw-execution.ts` - Number generation, matching
- `lib/services/draw.service.ts` - Execution, publishing, results

### UI Components
- `components/draw/DrawResultDisplay.tsx` - Result visualization
- `app/admin/draws/AdminDrawsContent.tsx` - Admin controls
- `app/draws/DrawsContent.tsx` - Subscriber view

### Tests
- `tests/unit/draw-execution.test.ts` - Number generation, matching
- `tests/unit/draw-matching.test.ts` - Results, prizes, protection
- `tests/e2e/draw-execution.spec.ts` - Full execution flow

## User Experience

### Admin
1. Configure draw (mode, date)
2. Simulate (preview prizes)
3. Execute draw (generates winners)
4. Review results
5. Publish draw (makes visible to subscribers)

### Subscriber
1. View current/upcoming draw
2. See eligibility status
3. View published results (if available)
4. See winning numbers
5. See if they won (personal notification)
6. View winner statistics

## Data Flow

```
Admin executes draw
       ↓
System generates 5 numbers
       ↓
System gets all eligible users
       ↓
For each user:
  - Get their 5 scores
  - Count matches
  - Create winner record if ≥3 matches
       ↓
Calculate prizes per tier
       ↓
Store result + winners
       ↓
Admin publishes
       ↓
Subscribers see results
```

## External Services

**Not connected in Step 7B:**
- Supabase - Still using in-memory storage
- Stripe - No actual payouts yet
- Email - No notifications yet
- Storage - No file uploads yet

Winner proof upload and verification are Step 8.
