export const MACHINE_CATEGORIES = {
  STRENGTH: 'strength',
  CARDIO: 'cardio',
  FREE_WEIGHTS: 'free_weights',
};

export const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Legs', 'Glutes', 'Core', 'Full Body'
];

export const PRESET_MACHINES = [
  // Strength
  { type: 'Chest Press Machine', category: 'strength', muscleGroup: 'Chest', icon: '🏋️', color: '#e63946' },
  { type: 'Leg Press', category: 'strength', muscleGroup: 'Legs', icon: '🦵', color: '#e63946' },
  { type: 'Lat Pulldown', category: 'strength', muscleGroup: 'Back', icon: '🔽', color: '#e63946' },
  { type: 'Shoulder Press Machine', category: 'strength', muscleGroup: 'Shoulders', icon: '💪', color: '#e63946' },
  { type: 'Seated Row', category: 'strength', muscleGroup: 'Back', icon: '🚣', color: '#e63946' },
  { type: 'Leg Curl', category: 'strength', muscleGroup: 'Legs', icon: '🦿', color: '#e63946' },
  { type: 'Leg Extension', category: 'strength', muscleGroup: 'Legs', icon: '🦵', color: '#e63946' },
  { type: 'Pec Deck / Fly Machine', category: 'strength', muscleGroup: 'Chest', icon: '🦋', color: '#e63946' },
  { type: 'Cable Machine', category: 'strength', muscleGroup: 'Full Body', icon: '🔗', color: '#e63946' },
  { type: 'Smith Machine', category: 'strength', muscleGroup: 'Full Body', icon: '🏗️', color: '#e63946' },
  { type: 'Tricep Pushdown', category: 'strength', muscleGroup: 'Triceps', icon: '⬇️', color: '#e63946' },
  { type: 'Bicep Curl Machine', category: 'strength', muscleGroup: 'Biceps', icon: '💪', color: '#e63946' },
  { type: 'Hip Abductor', category: 'strength', muscleGroup: 'Glutes', icon: '🔀', color: '#e63946' },
  { type: 'Glute Kickback', category: 'strength', muscleGroup: 'Glutes', icon: '🍑', color: '#e63946' },
  { type: 'Ab Crunch Machine', category: 'strength', muscleGroup: 'Core', icon: '🎯', color: '#e63946' },
  // Cardio
  { type: 'Treadmill', category: 'cardio', muscleGroup: 'Full Body', icon: '🏃', color: '#2a9d8f' },
  { type: 'Elliptical', category: 'cardio', muscleGroup: 'Full Body', icon: '🔄', color: '#2a9d8f' },
  { type: 'Stationary Bike', category: 'cardio', muscleGroup: 'Legs', icon: '🚴', color: '#2a9d8f' },
  { type: 'Rowing Machine', category: 'cardio', muscleGroup: 'Full Body', icon: '🚣', color: '#2a9d8f' },
  { type: 'Stair Climber', category: 'cardio', muscleGroup: 'Legs', icon: '🪜', color: '#2a9d8f' },
  { type: 'Ski Erg', category: 'cardio', muscleGroup: 'Full Body', icon: '⛷️', color: '#2a9d8f' },
  // Free Weights
  { type: 'Free Weights Area', category: 'free_weights', muscleGroup: 'Full Body', icon: '🏋️', color: '#f4a261', isArea: true },
];

export const FREE_WEIGHT_EXERCISES = [
  // Chest
  { name: 'Dumbbell Bench Press', muscleGroup: 'Chest' },
  { name: 'Dumbbell Fly', muscleGroup: 'Chest' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'Chest' },
  { name: 'Barbell Bench Press', muscleGroup: 'Chest' },
  // Back
  { name: 'Dumbbell Row', muscleGroup: 'Back' },
  { name: 'Barbell Deadlift', muscleGroup: 'Back' },
  { name: 'Dumbbell Pullover', muscleGroup: 'Back' },
  // Shoulders
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders' },
  { name: 'Lateral Raise', muscleGroup: 'Shoulders' },
  { name: 'Front Raise', muscleGroup: 'Shoulders' },
  { name: 'Arnold Press', muscleGroup: 'Shoulders' },
  // Arms
  { name: 'Dumbbell Curl', muscleGroup: 'Biceps' },
  { name: 'Hammer Curl', muscleGroup: 'Biceps' },
  { name: 'Barbell Curl', muscleGroup: 'Biceps' },
  { name: 'Skull Crushers', muscleGroup: 'Triceps' },
  { name: 'Tricep Kickback', muscleGroup: 'Triceps' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'Triceps' },
  // Legs
  { name: 'Dumbbell Squat', muscleGroup: 'Legs' },
  { name: 'Barbell Squat', muscleGroup: 'Legs' },
  { name: 'Dumbbell Lunge', muscleGroup: 'Legs' },
  { name: 'Romanian Deadlift', muscleGroup: 'Legs' },
  { name: 'Goblet Squat', muscleGroup: 'Legs' },
  // Core
  { name: 'Dumbbell Side Bend', muscleGroup: 'Core' },
  { name: 'Weighted Crunch', muscleGroup: 'Core' },
  { name: 'Russian Twist', muscleGroup: 'Core' },
];
