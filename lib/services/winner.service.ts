import { Winner, WinnerProof, VerificationStatus, PayoutStatus } from '@/types';

const winners: Map<string, Winner> = new Map();
const proofs: Map<string, WinnerProof> = new Map();

// Initialize with mock data
function initializeMockData() {
  if (winners.size === 0) {
    const mockWinners: Winner[] = [
      {
        id: 'winner-draw-sep-1',
        drawId: 'draw-sep-2026',
        userId: 'user-subscriber-1',
        matchType: '5-match',
        prizeAmount: poundsToPence(400),
        verificationStatus: 'pending',
        payoutStatus: 'pending',
        createdAt: new Date('2026-10-02'),
      },
      {
        id: 'winner-draw-sep-2',
        drawId: 'draw-sep-2026',
        userId: 'user-1',
        matchType: '4-match',
        prizeAmount: poundsToPence(100),
        verificationStatus: 'approved',
        payoutStatus: 'pending',
        approvedAt: new Date('2026-10-03'),
        createdAt: new Date('2026-10-02'),
      },
      {
        id: 'winner-draw-aug-1',
        drawId: 'draw-aug-2026',
        userId: 'user-subscriber-1',
        matchType: '3-match',
        prizeAmount: poundsToPence(50),
        verificationStatus: 'approved',
        payoutStatus: 'paid',
        approvedAt: new Date('2026-09-02'),
        paidAt: new Date('2026-09-05'),
        createdAt: new Date('2026-09-01'),
      },
    ];

    mockWinners.forEach(w => winners.set(w.id, w));
  }
}

function poundsToPence(pounds: number): number {
  return Math.round(pounds * 100);
}

initializeMockData();

export const winnerService = {
  async getWinnersByDraw(drawId: string): Promise<Winner[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return Array.from(winners.values()).filter(w => w.drawId === drawId);
  },

  async getWinnerById(id: string): Promise<Winner | null> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return winners.get(id) || null;
  },

  async getUserWinnings(userId: string): Promise<Winner[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return Array.from(winners.values()).filter(w => w.userId === userId);
  },

  async getAdminWinners(): Promise<Winner[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return Array.from(winners.values());
  },

  async submitProof(
    userId: string,
    winnerId: string,
    file: File
  ): Promise<{ success: boolean; proof?: WinnerProof; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const winner = winners.get(winnerId);
    if (!winner) {
      return { success: false, error: 'Winner not found' };
    }

    // Verify ownership
    if (winner.userId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate file
    if (!file) {
      return { success: false, error: 'No file selected' };
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Only image files (JPEG, PNG, GIF, WebP) are allowed' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 5MB' };
    }

    // Create proof record
    const proof: WinnerProof = {
      id: `proof-${winnerId}-${Date.now()}`,
      winnerId,
      fileUrl: `/uploads/proofs/${file.name}`,
      fileName: file.name,
      fileSize: file.size,
      submittedAt: new Date(),
    };

    proofs.set(proof.id, proof);

    // Update winner status
    const updatedWinner: Winner = {
      ...winner,
      verificationStatus: 'pending',
      proofSubmittedAt: new Date(),
    };
    winners.set(winnerId, updatedWinner);

    return { success: true, proof };
  },

  async getWinnerProof(winnerId: string): Promise<WinnerProof | null> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const proofArray = Array.from(proofs.values());
    return proofArray.find(p => p.winnerId === winnerId) || null;
  },

  async approveProof(
    winnerId: string,
    adminId: string
  ): Promise<{ success: boolean; winner?: Winner; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const winner = winners.get(winnerId);
    if (!winner) {
      return { success: false, error: 'Winner not found' };
    }

    if (winner.verificationStatus === 'approved') {
      // Idempotent
      return { success: true, winner };
    }

    const proof = Array.from(proofs.values()).find(p => p.winnerId === winnerId);
    if (!proof) {
      return { success: false, error: 'No proof submitted' };
    }

    const updatedWinner: Winner = {
      ...winner,
      verificationStatus: 'approved',
      payoutStatus: 'pending',
      approvedAt: new Date(),
    };

    winners.set(winnerId, updatedWinner);

    // Update proof
    const updatedProof: WinnerProof = {
      ...proof,
      reviewedAt: new Date(),
      reviewedBy: adminId,
      reviewNotes: 'Approved',
    };
    proofs.set(proof.id, updatedProof);

    return { success: true, winner: updatedWinner };
  },

  async rejectProof(
    winnerId: string,
    reason: string,
    adminId: string
  ): Promise<{ success: boolean; winner?: Winner; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 400));

    if (!reason || reason.trim().length === 0) {
      return { success: false, error: 'Rejection reason is required' };
    }

    const winner = winners.get(winnerId);
    if (!winner) {
      return { success: false, error: 'Winner not found' };
    }

    if (winner.verificationStatus === 'rejected') {
      // Idempotent
      return { success: true, winner };
    }

    const updatedWinner: Winner = {
      ...winner,
      verificationStatus: 'rejected',
      rejectionReason: reason,
      rejectedAt: new Date(),
    };

    winners.set(winnerId, updatedWinner);

    return { success: true, winner: updatedWinner };
  },

  async markPayoutPaid(
    winnerId: string,
    adminId: string
  ): Promise<{ success: boolean; winner?: Winner; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const winner = winners.get(winnerId);
    if (!winner) {
      return { success: false, error: 'Winner not found' };
    }

    if (winner.verificationStatus !== 'approved') {
      return {
        success: false,
        error: `Cannot mark as paid. Verification status is ${winner.verificationStatus}`,
      };
    }

    if (winner.payoutStatus === 'paid') {
      // Idempotent
      return { success: true, winner };
    }

    const updatedWinner: Winner = {
      ...winner,
      payoutStatus: 'paid',
      paidAt: new Date(),
    };

    winners.set(winnerId, updatedWinner);

    return { success: true, winner: updatedWinner };
  },

  _resetForTesting() {
    winners.clear();
    proofs.clear();
    initializeMockData();
  },
};
