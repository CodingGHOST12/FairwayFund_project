# FairwayFund Business Rules

## Core Rules

### Golf Scores (Step 5)

- **Valid Stableford Range**: Stableford scores must be whole numbers between 1 and 45 (inclusive).
- **Five-Score Maximum**: A user has at most five retained golf scores.
- **Automatic Oldest-Score Removal**: When a 6th score is recorded, the oldest retained score is automatically removed from the system.
- **Newest-First Display**: Scores are always presented in descending chronological order (newest round first).
- **One Score Per Calendar Date**: Users cannot submit multiple scores for the same date. Attempting to add a score on an existing date yields an informative conflict error.
- **Score Editing**: Editing an existing score on the same date is permitted. Editing a score's date to a date occupied by another round is rejected.
- **User Ownership**: Every score is bound to the authenticated user. Modifying or deleting another user's score is blocked.
- **Draw Eligibility**: In active subscriber mode, these retained 5 rounds serve as the subscriber's entry numbers in the monthly prize draw.

### Subscriptions (Step 4)

- **Plans Available**: Monthly (£10/month) and Yearly (£100/year)
- **Yearly Savings**: £20 saved with yearly plan (configurable)
- **Draw Eligibility**: Active subscription required for monthly draw entry
- **Cancellation**: Users can cancel anytime; subscription remains active until the end of the current billing period
- **Reactivation**: Cancelled subscriptions can be reactivated before the billing period ends
- **Expiration**: If the current date exceeds the period end, the subscription becomes expired and features are restricted

### Charity Contributions

- **Minimum Contribution**: At least 10% of subscription revenue goes to charities
- **Selection**: Each user chooses one charity to support
- **Change Allowed**: Users can change their charity selection anytime
- **Distribution**: Contributions distributed monthly

### Winner Verification & Payout (Step 8)

#### Winner Lifecycle
1. Published draw creates winner records
2. Winner status: "pending_proof" initially
3. Winner uploads proof (screenshot of scorecard)
4. Admin reviews proof
5. Approve → Status: "approved", Payout: "pending"
6. OR Reject → Status: "rejected" (with reason)
7. Admin marks as paid → Payout: "paid"

#### Verification Status
- **pending** - Awaiting proof or admin review
- **approved** - Proof verified, payout pending
- **rejected** - Proof rejected with reason

#### Payout Status
- **pending** - Approved but not yet paid
- **paid** - Payment processed

#### State Transitions
```
pending_verification
    ↙        ↘
approved   rejected
    ↓
pending_payout
    ↓
   paid
```

#### Invalid Transitions
- Cannot mark pending verification as paid
- Cannot mark rejected as paid
- Can only approve pending winners
- Can only reject pending winners

#### Proof Requirements
- Image file only (JPEG, PNG, GIF, WebP)
- Maximum 5MB
- Screenshot of golf scorecard

#### Admin Actions
- Approve pending proof
- Reject pending proof (requires reason)
- Mark approved winner as paid

#### User Ownership
- Users see only their own winnings
- Users submit proof only for their wins
- Service layer enforces ownership

#### Idempotency
- Approving already-approved is safe
- Marking already-paid is safe
- No duplicate effects from repeated operations

#### Draw Frequency
- Draws occur on the 1st of each month
- Participants must have active subscription during draw month

#### Draw Numbers (Step 7B)
- Exactly 5 unique numbers per draw
- Range: 1-45 (valid Stableford scores)
- Generated using either Random or Algorithmic mode

#### Random Mode (Step 7B)
- Pure cryptographically secure random selection
- Uses `crypto.getRandomValues()` for unbiased generation
- Each number 1-45 has equal probability

#### Algorithmic Mode (Step 7B)
- **Score-frequency based weighting**
- More commonly scored values have higher probability
- Formula: `weight = frequency + 1` (ensures all numbers possible)
- Fallback to random if insufficient data (<10 scores)
- Documented, deterministic, auditable

#### Prize Pool Distribution
- **5-Match Pool**: 40% of total prize pool
- **4-Match Pool**: 35% of total prize pool
- **3-Match Pool**: 25% of total prize pool
- Prize percentages are centralized in `lib/draw/draw-config.ts`
- All calculations use pence (minor units) to avoid floating-point errors

#### Winning Criteria (Step 7B)
- **5-Match**: User's 5 scores exactly match the 5 drawn scores (order-independent)
- **4-Match**: User's scores contain 4 of the 5 drawn scores
- **3-Match**: User's scores contain 3 of the 5 drawn scores
- **No Prize**: Fewer than 3 matches

#### Jackpot Rollover
- **5-Match Only**: If no one matches all 5 numbers, the 5-match prize pool rolls over to the next draw
- Rollover adds to the base 5-match allocation (40% of new revenue + previous rollover)
- 4-match and 3-match pools do not roll over

#### Multiple Winners (Step 7B)
- When multiple winners share a tier, the tier prize is divided equally
- Formula: `prize per winner = floor(tier pool pence / winner count)`
- Integer division with remainder to avoid precision loss
- Each winner receives equal share

#### Draw Execution (Step 7B)
1. Admin executes draw (generates numbers, calculates winners)
2. System creates winner records with prizes
3. Admin reviews results
4. Admin publishes draw (makes results visible)
5. Subscribers see winning numbers and their results

#### Execution Protection (Step 7B)
- Cannot execute already completed/published draws
- Cannot publish unexecuted draws
- Executing same draw twice returns cached result
- Publishing is idempotent (safe to call multiple times)

#### Draw Modes
- **Random**: Purely random number generation
- **Algorithmic**: Score-frequency based generation (exact weighting implementation is isolated and configurable)

#### Draw Eligibility
- Active subscription required
- At least 1 golf score required
- User's most recent scores (up to 5) are automatically entered

#### Draw Lifecycle (Step 7A + 7B)
1. **Draft**: Initial creation
2. **Configuring**: Setting mode, date, and parameters
3. **Simulating**: Preview of prize distribution
4. **Ready**: Configuration complete, awaiting execution
5. **Executed**: Winners generated, awaiting publication
6. **Published**: Results visible to subscribers (Step 7B)
7. **Completed**: Draw finalized

**Step 7A** implemented the draw foundation, configuration, and simulation.
**Step 7B** implemented execution, winner generation, matching, and publishing.
