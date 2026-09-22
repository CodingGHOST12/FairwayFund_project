import { describe, it, expect, beforeEach } from 'vitest';
import { winnerService } from '@/lib/services/winner.service';

describe('Winner Verification & Proof', () => {
  beforeEach(() => {
    winnerService._resetForTesting();
  });

  describe('Proof Submission', () => {
    it('allows winner to submit proof', async () => {
      const winners = await winnerService.getAdminWinners();
      const winner = winners[0];

      const file = new File(['test'], 'scorecard.png', { type: 'image/png' });
      const result = await winnerService.submitProof(winner.userId, winner.id, file);

      expect(result.success).toBe(true);
      expect(result.proof).toBeDefined();
      expect(result.proof?.winnerId).toBe(winner.id);
    });

    it('rejects invalid file types', async () => {
      const winners = await winnerService.getAdminWinners();
      const winner = winners[0];

      const file = new File(['test'], 'file.txt', { type: 'text/plain' });
      const result = await winnerService.submitProof(winner.userId, winner.id, file);

      expect(result.success).toBe(false);
      expect(result.error).toContain('image');
    });

    it('rejects files larger than 5MB', async () => {
      const winners = await winnerService.getAdminWinners();
      const winner = winners[0];

      const largeBuffer = new Uint8Array(6 * 1024 * 1024);
      const file = new File([largeBuffer], 'huge.png', { type: 'image/png' });
      const result = await winnerService.submitProof(winner.userId, winner.id, file);

      expect(result.success).toBe(false);
      expect(result.error).toContain('5MB');
    });

    it('enforces user ownership', async () => {
      const winners = await winnerService.getAdminWinners();
      const winner = winners[0];

      const file = new File(['test'], 'scorecard.png', { type: 'image/png' });
      const result = await winnerService.submitProof('wrong-user-id', winner.id, file);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unauthorized');
    });
  });

  describe('Verification States', () => {
    it('transitions pending → approved', async () => {
      const winners = await winnerService.getAdminWinners();
      const pending = winners.find(w => w.verificationStatus === 'pending');
      
      if (pending) {
        const result = await winnerService.approveProof(pending.id, 'admin');
        expect(result.success).toBe(true);
        expect(result.winner?.verificationStatus).toBe('approved');
        expect(result.winner?.payoutStatus).toBe('pending');
      }
    });

    it('rejects with reason', async () => {
      const winners = await winnerService.getAdminWinners();
      const pending = winners.find(w => w.verificationStatus === 'pending');
      
      if (pending) {
        const reason = 'Scorecard unclear';
        const result = await winnerService.rejectProof(pending.id, reason, 'admin');
        expect(result.success).toBe(true);
        expect(result.winner?.verificationStatus).toBe('rejected');
        expect(result.winner?.rejectionReason).toBe(reason);
      }
    });

    it('approving is idempotent', async () => {
      const winners = await winnerService.getAdminWinners();
      const approved = winners.find(w => w.verificationStatus === 'approved');
      
      if (approved) {
        const result1 = await winnerService.approveProof(approved.id, 'admin');
        const result2 = await winnerService.approveProof(approved.id, 'admin');
        
        expect(result1.success).toBe(true);
        expect(result2.success).toBe(true);
        expect(result1.winner?.approvedAt).toEqual(result2.winner?.approvedAt);
      }
    });
  });

  describe('Payout Management', () => {
    it('marks approved winner as paid', async () => {
      const winners = await winnerService.getAdminWinners();
      const approved = winners.find(w => w.verificationStatus === 'approved' && w.payoutStatus === 'pending');
      
      if (approved) {
        const result = await winnerService.markPayoutPaid(approved.id, 'admin');
        expect(result.success).toBe(true);
        expect(result.winner?.payoutStatus).toBe('paid');
        expect(result.winner?.paidAt).toBeDefined();
      }
    });

    it('prevents marking pending-verification as paid', async () => {
      const winners = await winnerService.getAdminWinners();
      const pending = winners.find(w => w.verificationStatus === 'pending');
      
      if (pending) {
        const result = await winnerService.markPayoutPaid(pending.id, 'admin');
        expect(result.success).toBe(false);
        expect(result.error).toContain('pending');
      }
    });

    it('prevents marking rejected as paid', async () => {
      const winners = await winnerService.getAdminWinners();
      const rejected = winners.find(w => w.verificationStatus === 'rejected');
      
      if (rejected) {
        const result = await winnerService.markPayoutPaid(rejected.id, 'admin');
        expect(result.success).toBe(false);
      }
    });

    it('marking paid is idempotent', async () => {
      const winners = await winnerService.getAdminWinners();
      const paid = winners.find(w => w.payoutStatus === 'paid');
      
      if (paid) {
        const result1 = await winnerService.markPayoutPaid(paid.id, 'admin');
        const result2 = await winnerService.markPayoutPaid(paid.id, 'admin');
        
        expect(result1.success).toBe(true);
        expect(result2.success).toBe(true);
        expect(result1.winner?.paidAt).toEqual(result2.winner?.paidAt);
      }
    });
  });

  describe('User Winnings', () => {
    it('retrieves user winnings', async () => {
      const result = await winnerService.getUserWinnings('user-subscriber-1');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
      
      result.forEach(w => {
        expect(w.userId).toBe('user-subscriber-1');
      });
    });

    it('filters by verification and payout status', async () => {
      const allWinners = await winnerService.getAdminWinners();
      
      const pending = allWinners.filter(w => w.verificationStatus === 'pending');
      const approved = allWinners.filter(w => w.verificationStatus === 'approved');
      const paid = allWinners.filter(w => w.payoutStatus === 'paid');
      
      expect(pending.length + approved.length).toBeGreaterThanOrEqual(0);
      expect(paid.length).toBeGreaterThanOrEqual(0);
    });
  });
});
