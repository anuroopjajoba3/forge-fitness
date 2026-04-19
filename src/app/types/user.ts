/**
 * Shared domain types. Components should import from here rather than
 * redefining overlapping shapes locally or using `any`.
 */

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type Goal =
  | 'lose_weight'
  | 'gain_muscle'
  | 'maintain'
  | 'improve_fitness'
  | 'athletic_performance';

export interface UserProfile {
  name: string;
  age: number;
  gender: string; // kept broad for back-compat with existing data
  height: number;
  weight: number;
  activityLevel: string;
  goal: string;
  targetWeight?: number;
  startWeight?: number;
  startDate?: string;
}
