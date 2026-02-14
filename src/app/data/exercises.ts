export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'sports';
  muscleGroup?: 'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'core' | 'olympic' | 'fullBody';
  cardioType?: 'running' | 'cycling' | 'rowing' | 'swimming' | 'hiit';
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export const EXERCISES: Exercise[] = [
  // CHEST
  { id: 'bench-press', name: 'Barbell Bench Press', category: 'strength', muscleGroup: 'chest', equipment: 'Barbell', difficulty: 'intermediate' },
  { id: 'incline-bench', name: 'Incline Bench Press', category: 'strength', muscleGroup: 'chest', equipment: 'Barbell', difficulty: 'intermediate' },
  { id: 'decline-bench', name: 'Decline Bench Press', category: 'strength', muscleGroup: 'chest', equipment: 'Barbell', difficulty: 'intermediate' },
  { id: 'db-bench', name: 'Dumbbell Bench Press', category: 'strength', muscleGroup: 'chest', equipment: 'Dumbbells', difficulty: 'beginner' },
  { id: 'db-incline', name: 'Dumbbell Incline Press', category: 'strength', muscleGroup: 'chest', equipment: 'Dumbbells', difficulty: 'beginner' },
  { id: 'db-fly', name: 'Dumbbell Flyes', category: 'strength', muscleGroup: 'chest', equipment: 'Dumbbells', difficulty: 'beginner' },
  { id: 'cable-fly', name: 'Cable Flyes', category: 'strength', muscleGroup: 'chest', equipment: 'Cable', difficulty: 'beginner' },
  { id: 'pushups', name: 'Push-Ups', category: 'strength', muscleGroup: 'chest', equipment: 'Bodyweight', difficulty: 'beginner' },
  { id: 'dips-chest', name: 'Chest Dips', category: 'strength', muscleGroup: 'chest', equipment: 'Bodyweight', difficulty: 'intermediate' },
  { id: 'pec-deck', name: 'Pec Deck Machine', category: 'strength', muscleGroup: 'chest', equipment: 'Machine', difficulty: 'beginner' },

  // BACK
  { id: 'deadlift', name: 'Conventional Deadlift', category: 'strength', muscleGroup: 'back', equipment: 'Barbell', difficulty: 'advanced' },
  { id: 'romanian-dl', name: 'Romanian Deadlift', category: 'strength', muscleGroup: 'back', equipment: 'Barbell', difficulty: 'intermediate' },
  { id: 'bent-row', name: 'Barbell Bent-Over Row', category: 'strength', muscleGroup: 'back', equipment: 'Barbell', difficulty: 'intermediate' },
  { id: 'db-row', name: 'Dumbbell Row', category: 'strength', muscleGroup: 'back', equipment: 'Dumbbells', difficulty: 'beginner' },
  { id: 't-bar-row', name: 'T-Bar Row', category: 'strength', muscleGroup: 'back', equipment: 'Barbell', difficulty: 'intermediate' },
  { id: 'pullups', name: 'Pull-Ups', category: 'strength', muscleGroup: 'back', equipment: 'Bodyweight', difficulty: 'intermediate' },
  { id: 'chinups', name: 'Chin-Ups', category: 'strength', muscleGroup: 'back', equipment: 'Bodyweight', difficulty: 'intermediate' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'strength', muscleGroup: 'back', equipment: 'Cable', difficulty: 'beginner' },
  { id: 'cable-row', name: 'Seated Cable Row', category: 'strength', muscleGroup: 'back', equipment: 'Cable', difficulty: 'beginner' },
  { id: 'face-pulls', name: 'Face Pulls', category: 'strength', muscleGroup: 'back', equipment: 'Cable', difficulty: 'beginner' },
  { id: 'hyperextensions', name: 'Back Extensions', category: 'strength', muscleGroup: 'back', equipment: 'Machine', difficulty: 'beginner' },

  // LEGS
  { id: 'squat', name: 'Barbell Back Squat', category: 'strength', muscleGroup: 'legs', equipment: 'Barbell', difficulty: 'intermediate' },
  { id: 'front-squat', name: 'Front Squat', category: 'strength', muscleGroup: 'legs', equipment: 'Barbell', difficulty: 'advanced' },
  { id: 'leg-press', name: 'Leg Press', category: 'strength', muscleGroup: 'legs', equipment: 'Machine', difficulty: 'beginner' },
  { id: 'leg-extension', name: 'Leg Extension', category: 'strength', muscleGroup: 'legs', equipment: 'Machine', difficulty: 'beginner' },
  { id: 'leg-curl', name: 'Leg Curl', category: 'strength', muscleGroup: 'legs', equipment: 'Machine', difficulty: 'beginner' },
  { id: 'lunges', name: 'Walking Lunges', category: 'strength', muscleGroup: 'legs', equipment: 'Dumbbells', difficulty: 'beginner' },
  { id: 'bulgarian-split', name: 'Bulgarian Split Squat', category: 'strength', muscleGroup: 'legs', equipment: 'Dumbbells', difficulty: 'intermediate' },
  { id: 'calf-raise', name: 'Standing Calf Raise', category: 'strength', muscleGroup: 'legs', equipment: 'Machine', difficulty: 'beginner' },
  { id: 'hack-squat', name: 'Hack Squat', category: 'strength', muscleGroup: 'legs', equipment: 'Machine', difficulty: 'intermediate' },
  { id: 'goblet-squat', name: 'Goblet Squat', category: 'strength', muscleGroup: 'legs', equipment: 'Dumbbell', difficulty: 'beginner' },

  // SHOULDERS
  { id: 'ohp', name: 'Overhead Press', category: 'strength', muscleGroup: 'shoulders', equipment: 'Barbell', difficulty: 'intermediate' },
  { id: 'db-shoulder-press', name: 'Dumbbell Shoulder Press', category: 'strength', muscleGroup: 'shoulders', equipment: 'Dumbbells', difficulty: 'beginner' },
  { id: 'arnold-press', name: 'Arnold Press', category: 'strength', muscleGroup: 'shoulders', equipment: 'Dumbbells', difficulty: 'intermediate' },
  { id: 'lateral-raise', name: 'Lateral Raise', category: 'strength', muscleGroup: 'shoulders', equipment: 'Dumbbells', difficulty: 'beginner' },
  { id: 'front-raise', name: 'Front Raise', category: 'strength', muscleGroup: 'shoulders', equipment: 'Dumbbells', difficulty: 'beginner' },
  { id: 'rear-delt-fly', name: 'Rear Delt Flyes', category: 'strength', muscleGroup: 'shoulders', equipment: 'Dumbbells', difficulty: 'beginner' },
  { id: 'upright-row', name: 'Upright Row', category: 'strength', muscleGroup: 'shoulders', equipment: 'Barbell', difficulty: 'intermediate' },
  { id: 'shrugs', name: 'Barbell Shrugs', category: 'strength', muscleGroup: 'shoulders', equipment: 'Barbell', difficulty: 'beginner' },

  // ARMS
  { id: 'barbell-curl', name: 'Barbell Curl', category: 'strength', muscleGroup: 'arms', equipment: 'Barbell', difficulty: 'beginner' },
  { id: 'db-curl', name: 'Dumbbell Curl', category: 'strength', muscleGroup: 'arms', equipment: 'Dumbbells', difficulty: 'beginner' },
  { id: 'hammer-curl', name: 'Hammer Curl', category: 'strength', muscleGroup: 'arms', equipment: 'Dumbbells', difficulty: 'beginner' },
  { id: 'preacher-curl', name: 'Preacher Curl', category: 'strength', muscleGroup: 'arms', equipment: 'Barbell', difficulty: 'beginner' },
  { id: 'cable-curl', name: 'Cable Curl', category: 'strength', muscleGroup: 'arms', equipment: 'Cable', difficulty: 'beginner' },
  { id: 'tricep-dips', name: 'Tricep Dips', category: 'strength', muscleGroup: 'arms', equipment: 'Bodyweight', difficulty: 'intermediate' },
  { id: 'close-grip-bench', name: 'Close-Grip Bench Press', category: 'strength', muscleGroup: 'arms', equipment: 'Barbell', difficulty: 'intermediate' },
  { id: 'skull-crushers', name: 'Skull Crushers', category: 'strength', muscleGroup: 'arms', equipment: 'Barbell', difficulty: 'intermediate' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', category: 'strength', muscleGroup: 'arms', equipment: 'Cable', difficulty: 'beginner' },
  { id: 'overhead-extension', name: 'Overhead Tricep Extension', category: 'strength', muscleGroup: 'arms', equipment: 'Dumbbell', difficulty: 'beginner' },

  // CORE
  { id: 'plank', name: 'Plank', category: 'strength', muscleGroup: 'core', equipment: 'Bodyweight', difficulty: 'beginner' },
  { id: 'crunches', name: 'Crunches', category: 'strength', muscleGroup: 'core', equipment: 'Bodyweight', difficulty: 'beginner' },
  { id: 'leg-raises', name: 'Hanging Leg Raises', category: 'strength', muscleGroup: 'core', equipment: 'Bodyweight', difficulty: 'intermediate' },
  { id: 'russian-twist', name: 'Russian Twists', category: 'strength', muscleGroup: 'core', equipment: 'Bodyweight', difficulty: 'beginner' },
  { id: 'cable-crunch', name: 'Cable Crunches', category: 'strength', muscleGroup: 'core', equipment: 'Cable', difficulty: 'beginner' },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', category: 'strength', muscleGroup: 'core', equipment: 'Ab Wheel', difficulty: 'advanced' },
  { id: 'mountain-climbers', name: 'Mountain Climbers', category: 'strength', muscleGroup: 'core', equipment: 'Bodyweight', difficulty: 'beginner' },

  // OLYMPIC LIFTS
  { id: 'clean', name: 'Power Clean', category: 'strength', muscleGroup: 'olympic', equipment: 'Barbell', difficulty: 'advanced' },
  { id: 'snatch', name: 'Power Snatch', category: 'strength', muscleGroup: 'olympic', equipment: 'Barbell', difficulty: 'advanced' },
  { id: 'clean-jerk', name: 'Clean and Jerk', category: 'strength', muscleGroup: 'olympic', equipment: 'Barbell', difficulty: 'advanced' },
  { id: 'hang-clean', name: 'Hang Clean', category: 'strength', muscleGroup: 'olympic', equipment: 'Barbell', difficulty: 'advanced' },

  // CARDIO
  { id: 'running', name: 'Running', category: 'cardio', cardioType: 'running', equipment: 'None', difficulty: 'beginner' },
  { id: 'treadmill', name: 'Treadmill', category: 'cardio', cardioType: 'running', equipment: 'Treadmill', difficulty: 'beginner' },
  { id: 'cycling', name: 'Cycling', category: 'cardio', cardioType: 'cycling', equipment: 'Bike', difficulty: 'beginner' },
  { id: 'stationary-bike', name: 'Stationary Bike', category: 'cardio', cardioType: 'cycling', equipment: 'Bike', difficulty: 'beginner' },
  { id: 'rowing', name: 'Rowing Machine', category: 'cardio', cardioType: 'rowing', equipment: 'Rowing Machine', difficulty: 'beginner' },
  { id: 'swimming', name: 'Swimming', category: 'cardio', cardioType: 'swimming', equipment: 'Pool', difficulty: 'intermediate' },
  { id: 'jump-rope', name: 'Jump Rope', category: 'cardio', cardioType: 'hiit', equipment: 'Jump Rope', difficulty: 'beginner' },
  { id: 'burpees', name: 'Burpees', category: 'cardio', cardioType: 'hiit', equipment: 'Bodyweight', difficulty: 'intermediate' },
  { id: 'stairmaster', name: 'Stair Climber', category: 'cardio', cardioType: 'hiit', equipment: 'Machine', difficulty: 'intermediate' },

  // SPORTS & ACTIVITIES
  { id: 'basketball', name: 'Basketball', category: 'sports', equipment: 'Ball', difficulty: 'beginner' },
  { id: 'soccer', name: 'Soccer', category: 'sports', equipment: 'Ball', difficulty: 'beginner' },
  { id: 'tennis', name: 'Tennis', category: 'sports', equipment: 'Racket', difficulty: 'intermediate' },
  { id: 'yoga', name: 'Yoga', category: 'sports', equipment: 'Mat', difficulty: 'beginner' },
  { id: 'pilates', name: 'Pilates', category: 'sports', equipment: 'Mat', difficulty: 'beginner' },
  { id: 'boxing', name: 'Boxing', category: 'sports', equipment: 'Gloves', difficulty: 'intermediate' },
  { id: 'martial-arts', name: 'Martial Arts', category: 'sports', equipment: 'None', difficulty: 'intermediate' },
  { id: 'rock-climbing', name: 'Rock Climbing', category: 'sports', equipment: 'Harness', difficulty: 'advanced' },
];

export const getExercisesByMuscleGroup = (muscleGroup: string) => {
  return EXERCISES.filter(ex => ex.muscleGroup === muscleGroup);
};

export const getExercisesByCategory = (category: 'strength' | 'cardio' | 'sports') => {
  return EXERCISES.filter(ex => ex.category === category);
};

export const searchExercises = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return EXERCISES.filter(ex => 
    ex.name.toLowerCase().includes(lowerQuery) ||
    ex.muscleGroup?.toLowerCase().includes(lowerQuery) ||
    ex.equipment?.toLowerCase().includes(lowerQuery)
  );
};
