export type GolfScore = {
  id: string;
  userId: string;
  stablefordScore: number;
  date: Date;
  courseName?: string;
  createdAt: Date;
  updatedAt?: Date;
};

export type CreateScoreInput = {
  stablefordScore: number;
  date: Date | string;
  courseName?: string;
};

export type UpdateScoreInput = {
  stablefordScore?: number;
  date?: Date | string;
  courseName?: string;
};

export type ScoreValidationResult = {
  isValid: boolean;
  error?: string;
};
