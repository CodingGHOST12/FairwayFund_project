import { appConfig } from '@/lib/config/app.config';
import type { GolfScore } from '@/types/score';

/**
 * Generate 5 unique random numbers for draw using cryptographically secure random.
 * Numbers are in the valid Stableford score range (1-45).
 */
export function generateRandomDrawNumbers(): number[] {
  const min = appConfig.score.min;
  const max = appConfig.score.max;
  const count = 5;
  
  const numbers: Set<number> = new Set();
  
  while (numbers.size < count) {
    // Use crypto.getRandomValues for secure random generation
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const random = array[0] / (0xffffffff + 1);
    const num = Math.floor(random * (max - min + 1)) + min;
    numbers.add(num);
  }
  
  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * Generate 5 unique numbers using score frequency weighting.
 * 
 * Algorithm:
 * 1. Count frequency of each score value (1-45) from all eligible users
 * 2. Calculate probability weights: more frequent scores have higher weight
 * 3. Use weighted random selection without replacement
 * 4. Fallback to pure random if insufficient frequency data
 * 
 * This increases odds of common scores being drawn while maintaining fairness.
 */
export function generateAlgorithmicDrawNumbers(allScores: GolfScore[]): number[] {
  const min = appConfig.score.min;
  const max = appConfig.score.max;
  
  // If insufficient data, fallback to random
  if (allScores.length < 10) {
    return generateRandomDrawNumbers();
  }
  
  // Count frequency of each score value
  const frequency: Map<number, number> = new Map();
  for (let i = min; i <= max; i++) {
    frequency.set(i, 0);
  }
  
  allScores.forEach(score => {
    const val = score.stablefordScore;
    if (val >= min && val <= max) {
      frequency.set(val, (frequency.get(val) || 0) + 1);
    }
  });
  
  // Calculate total and weights
  const totalCount = allScores.length;
  const weights: { value: number; weight: number }[] = [];
  
  for (let i = min; i <= max; i++) {
    const count = frequency.get(i) || 0;
    // Weight = (frequency + 1) to ensure all numbers have non-zero probability
    const weight = count + 1;
    weights.push({ value: i, weight });
  }
  
  // Weighted selection without replacement
  const selected: number[] = [];
  const availableWeights = [...weights];
  
  for (let i = 0; i < 5; i++) {
    // Calculate total weight
    const totalWeight = availableWeights.reduce((sum, w) => sum + w.weight, 0);
    
    // Generate random value in range
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const random = array[0] / (0xffffffff + 1);
    let target = random * totalWeight;
    
    // Find selected value
    let selectedIndex = 0;
    for (let j = 0; j < availableWeights.length; j++) {
      target -= availableWeights[j].weight;
      if (target <= 0) {
        selectedIndex = j;
        break;
      }
    }
    
    selected.push(availableWeights[selectedIndex].value);
    availableWeights.splice(selectedIndex, 1);
  }
  
  return selected.sort((a, b) => a - b);
}

/**
 * Count how many numbers match between two arrays.
 */
export function countMatches(userScores: number[], drawNumbers: number[]): number {
  const drawSet = new Set(drawNumbers);
  return userScores.filter(score => drawSet.has(score)).length;
}

/**
 * Determine winner tier based on match count.
 * Returns null if fewer than 3 matches (no prize).
 */
export function getMatchTier(matchCount: number): '5-match' | '4-match' | '3-match' | null {
  if (matchCount === 5) return '5-match';
  if (matchCount === 4) return '4-match';
  if (matchCount === 3) return '3-match';
  return null;
}

/**
 * Extract score values from user's golf scores.
 */
export function getUserScoreValues(scores: GolfScore[]): number[] {
  return scores
    .slice(0, 5) // Take up to 5 most recent
    .map(s => s.stablefordScore)
    .filter(s => s >= appConfig.score.min && s <= appConfig.score.max);
}
