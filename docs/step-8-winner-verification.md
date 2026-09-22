# Step 8: Winner Verification & Payout

## Overview

Step 8 implements the complete winner verification and payout workflow for FairwayFund.

## Winner Lifecycle

```
Published Draw Result
       ↓
Winner receives notification
       ↓
Submits proof (screenshot of scorecard)
       ↓
Proof starts as "pending"
       ↓
Admin reviews proof
       ↓
Approve → "approved" status
   OR
Reject → "rejected" status (with reason)
       ↓
If approved:
  - Payout status: "pending"
  - Admin marks as "paid"
       ↓
Final status: "paid"
```

## Winner States

### Verification Status
- **pending** - Awaiting proof submission or admin review
- **approved** - Proof verified by admin
- **rejected** - Proof rejected by admin (with reason)

### Payout Status
- **pending** - Approved but not yet paid
- **paid** - Payment processed

## Proof Upload

### File Requirements
- Format: JPEG, PNG, GIF, WebP (image files only)
- Max size: 5MB
- Must be a screenshot of golf scorecard

### Storage
- Local development uses mock storage service
- Files stored at `/uploads/proofs/`
- Future: Integrates with Supabase Storage

## Admin Management

### Filtering
- All winners
- Pending verification
- Approved (approved but not paid)
- Rejected
- Pending payout (approved, payment pending)
- Paid

### Actions
- **Approve**: Transitions pending → approved (payout becomes pending)
- **Reject**: Transitions pending → rejected (requires reason)
- **Mark Paid**: Transitions pending → paid (only for approved winners)

## State Protection

### Invalid Transitions
- Cannot mark pending-verification winner as paid
- Cannot mark rejected winner as paid
- Cannot pay without prior approval

### Idempotency
- Approving already-approved winner returns same state
- Marking already-paid winner as paid returns same state
- Rejecting already-rejected winner returns same state

## User Experience

### User Winnings Page (`/winnings`)
- Shows all user's prize winnings
- Displays verification and payout status
- Shows total prize amount
- Proof upload interface for pending winners
- Rejection reasons displayed if rejected

### Winner Result Display
- Match type (5/4/3-match)
- Prize amount
- Verification status badge
- Payout status badge
- Contextual messages based on state

### Admin Winners Page (`/admin/winners`)
- Table of all winners
- Filtereable by verification/payout status
- Inline approval/rejection actions
- Mark as paid action
- Responsive admin interface

## Security

### User Ownership
- Users can only view their own winnings
- Users can only submit proof for their own wins
- Service-layer ownership checks

### Admin Authorization
- Only admins access `/admin/winners`
- Service layer enforces admin-only actions
- AuthGuard protects routes

### File Validation
- File type validation (images only)
- File size validation (max 5MB)
- MIME type checking

## Implementation Details

### Winner Service Methods
```typescript
getUserWinnings(userId)           // Get user's prize winnings
submitProof(userId, winnerId, file) // Submit proof screenshot
approveProof(winnerId, adminId)     // Admin approve
rejectProof(winnerId, reason, adminId) // Admin reject with reason
markPayoutPaid(winnerId, adminId)   // Admin mark as paid
getAdminWinners()                   // Admin: get all winners
```

### Components
- **WinnerResult** - Display winner status and details
- **ProofUpload** - File upload interface with preview
- **WinningsContent** - User winnings page
- **AdminWinnersContent** - Admin management interface

### Local Development
- In-memory winner/proof storage
- Mock file upload service
- No external service connections
- Deterministic test data

## Future Integration (Not Step 8)

- Connect Supabase Storage for file persistence
- Stripe integration for actual payouts
- Email notifications to winners
- Automated payout processing
- Webhook handlers for payment status
- Audit logging for compliance

## Testing

Unit tests cover:
- Proof submission with validation
- File type/size validation
- User ownership enforcement
- State transitions (valid and invalid)
- Idempotency of operations
- Filtering by status

E2E tests cover:
- User proof submission flow
- Admin approval/rejection
- Payout marking
- Authorization checks
- UI interactions
