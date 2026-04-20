import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import {
  Play,
  Pause,
  Check,
  Plus,
  Trash2,
  Clock,
  Dumbbell,
  TrendingUp,
  Search,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  EXERCISES,
  searchExercises,
  getExercisesByCategory,
  getExercisesByMuscleGroup,
} from '../data/exercises';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { authedFetch } from '/utils/supabase/info';

// Renamed from `Set` to avoid shadowing the built-in ES2015 `Set<T>` class
// used below for `expandedGroups`.
interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

interface Exercise {
  id: string;
  exerciseId: string;
  name: string;
  sets: WorkoutSet[];
  notes?: string;
}

interface WorkoutSessionProps {
  userId: string;
}

export function WorkoutSession({ userId }: WorkoutSessionProps) {
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'strength' | 'cardio' | 'sports'
  >('all');
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restDuration, setRestDuration] = useState(90);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['chest']));
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lastWorkoutStats, setLastWorkoutStats] = useState<{
    volume: number;
    sets: number;
    duration: number;
  } | null>(null);
  const toggleGroup = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  // Timer for workout duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Rest timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            // Play notification sound
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRestTimer = () => {
    setRestTimer(restDuration);
    setIsResting(true);
  };

  const addExercise = (exerciseId: string, exerciseName: string) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      exerciseId,
      name: exerciseName,
      sets: [],
      notes: '',
    };
    setExercises([...exercises, newExercise]);
    setIsExercisePickerOpen(false);
    setSearchQuery('');

    // Auto-start if first exercise
    if (exercises.length === 0) {
      setIsActive(true);
    }
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const addSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const newSet: WorkoutSet = {
            id: Date.now().toString(),
            weight: 0,
            reps: 0,
            completed: false,
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      }),
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: 'weight' | 'reps',
    value: number,
  ) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set) => (set.id === setId ? { ...set, [field]: value } : set)),
          };
        }
        return ex;
      }),
    );
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    console.log('=== TOGGLING SET COMPLETE ===');
    console.log('Exercise ID:', exerciseId);
    console.log('Set ID:', setId);

    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set) => {
              if (set.id === setId) {
                const newCompleted = !set.completed;
                console.log(
                  `Set ${setId}: weight=${set.weight}, reps=${set.reps}, completed=${newCompleted}`,
                );

                // Start rest timer when completing a set
                if (newCompleted && !isResting) {
                  startRestTimer();
                }
                return { ...set, completed: newCompleted };
              }
              return set;
            }),
          };
        }
        return ex;
      }),
    );

    // Force recalculate after state update
    setTimeout(() => {
      console.log('Current exercises after toggle:', exercises);
    }, 100);
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return { ...ex, sets: ex.sets.filter((set) => set.id !== setId) };
        }
        return ex;
      }),
    );
  };

  // Calculate total volume - recalculates whenever exercises change
  const totalVolume = useMemo(() => {
    console.log('=== RECALCULATING VOLUME ===');
    const volume = exercises.reduce((total, exercise) => {
      return (
        total +
        exercise.sets.reduce((exTotal, set) => {
          if (set.completed) {
            const weight = Number(set.weight) || 0;
            const reps = Number(set.reps) || 0;
            const setVolume = weight * reps;
            console.log(
              `Set volume: ${weight}kg × ${reps} reps = ${setVolume}kg, completed=${set.completed}`,
            );
            return exTotal + setVolume;
          }
          return exTotal;
        }, 0)
      );
    }, 0);

    console.log('Total volume calculated:', volume);
    console.log('Number of exercises:', exercises.length);
    console.log('Exercises data:', JSON.stringify(exercises, null, 2));
    return volume;
  }, [exercises]);

  const calculateTotalVolume = () => {
    return totalVolume;
  };

  const saveWorkout = async () => {
    if (exercises.length === 0) {
      alert('Add at least one exercise to save');
      return;
    }

    const totalVolume = calculateTotalVolume();
    const completedSets = exercises.reduce(
      (total, ex) => total + ex.sets.filter((s) => s.completed).length,
      0,
    );

    const workout = {
      userId,
      id: `workout-${Date.now()}`,
      date: new Date().toISOString(),
      duration,
      exercises,
      totalVolume,
      totalSets: completedSets,
    };

    console.log('=== SAVING WORKOUT ===');
    console.log('Duration (seconds):', duration);
    console.log('Total Volume (kg):', totalVolume);
    console.log('Completed Sets:', completedSets);
    console.log('Number of exercises:', exercises.length);
    console.log('Full workout object:', JSON.stringify(workout, null, 2));

    try {
      const response = await authedFetch(`/workouts`, {
        method: 'POST',
        body: JSON.stringify(workout),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setLastWorkoutStats({ volume: totalVolume, sets: completedSets, duration });
        setShowSuccessDialog(true);
        // Reset
        setExercises([]);
        setDuration(0);
        setIsActive(false);
      } else {
        console.error('Save failed:', data);
        alert(`Failed to save workout: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      const message = error instanceof Error ? error.message : String(error);
      alert(`Error saving workout: ${message}\n\nCheck console for details.`);
    }
  };

  const filteredExercises = searchQuery
    ? searchExercises(searchQuery)
    : selectedCategory === 'all'
      ? EXERCISES
      : getExercisesByCategory(selectedCategory);

  // Group exercises by muscle group
  const muscleGroups = [
    { id: 'chest', name: 'Chest', icon: '💪' },
    { id: 'back', name: 'Back', icon: '🦾' },
    { id: 'legs', name: 'Legs', icon: '🦵' },
    { id: 'shoulders', name: 'Shoulders', icon: '🏋️' },
    { id: 'arms', name: 'Arms', icon: '💪' },
    { id: 'core', name: 'Core', icon: '🔥' },
    { id: 'olympic', name: 'Olympic', icon: '🏆' },
  ];

  const groupedExercises = muscleGroups
    .map((group) => ({
      ...group,
      exercises: filteredExercises.filter((ex) => ex.muscleGroup === group.id),
    }))
    .filter((group) => group.exercises.length > 0);

  const cardioExercises = filteredExercises.filter((ex) => ex.category === 'cardio');
  const sportsExercises = filteredExercises.filter((ex) => ex.category === 'sports');

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Session Header */}
      <Card className="bg-stone-900 border-stone-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Workout Session</h2>
            <p className="text-stone-400 text-sm">Track every set, rep, and kg</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isActive ? 'default' : 'outline'}
              onClick={() => setIsActive(!isActive)}
              className={
                isActive ? 'bg-red-500 hover:bg-red-600' : 'border-emerald-500 text-emerald-500'
              }
            >
              {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-stone-800 rounded-lg">
            <Clock className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{formatTime(duration)}</p>
            <p className="text-xs text-stone-400">Duration</p>
          </div>
          <div className="text-center p-3 bg-stone-800 rounded-lg">
            <Dumbbell className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{exercises.length}</p>
            <p className="text-xs text-stone-400">Exercises</p>
          </div>
          <div className="text-center p-3 bg-stone-800 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{calculateTotalVolume()}</p>
            <p className="text-xs text-stone-400">Volume (kg)</p>
          </div>
        </div>

        {/* Rest Timer */}
        {isResting && (
          <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-400 font-medium">Rest Timer</p>
                <p className="text-3xl font-bold text-emerald-500">{formatTime(restTimer)}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsResting(false)}
                className="text-emerald-400"
              >
                Skip
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Exercise List */}
      <div className="space-y-4">
        {exercises.map((exercise, exIndex) => (
          <Card key={exercise.id} className="bg-stone-900 border-stone-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
                <p className="text-xs text-stone-400">Exercise {exIndex + 1}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeExercise(exercise.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Sets */}
            <div className="space-y-2">
              {exercise.sets.map((set, setIndex) => (
                <div
                  key={set.id}
                  className={`grid grid-cols-[auto_1fr_1fr_auto_auto] gap-2 items-center p-3 rounded-lg transition-all ${
                    set.completed
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'bg-stone-800'
                  }`}
                >
                  <span className="text-sm font-medium text-stone-400 w-8">{setIndex + 1}</span>
                  <div>
                    <Input
                      type="number"
                      placeholder="Weight (kg)"
                      value={set.weight || ''}
                      onChange={(e) =>
                        updateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)
                      }
                      className="bg-stone-700 border-stone-600 text-white"
                      disabled={set.completed}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={set.reps || ''}
                      onChange={(e) =>
                        updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)
                      }
                      className="bg-stone-700 border-stone-600 text-white"
                      disabled={set.completed}
                    />
                  </div>
                  <Button
                    size="icon"
                    variant={set.completed ? 'default' : 'outline'}
                    onClick={() => toggleSetComplete(exercise.id, set.id)}
                    className={
                      set.completed ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-stone-600'
                    }
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeSet(exercise.id, set.id)}
                    className="text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Set Button */}
            <Button
              variant="outline"
              onClick={() => addSet(exercise.id)}
              className="w-full mt-3 border-dashed border-stone-600 text-stone-400 hover:text-white hover:border-emerald-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Set
            </Button>
          </Card>
        ))}

        {/* Add Exercise Button */}
        <Button
          onClick={() => setIsExercisePickerOpen(true)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Exercise
        </Button>
      </div>

      {/* Save Workout Button */}
      {exercises.length > 0 && (
        <Button
          onClick={saveWorkout}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg font-semibold"
        >
          Save Workout
        </Button>
      )}

      {/* Exercise Picker Modal */}
      <Dialog open={isExercisePickerOpen} onOpenChange={setIsExercisePickerOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden bg-stone-900 border-stone-800">
          <DialogHeader>
            <DialogTitle className="text-white">Choose Exercise</DialogTitle>
            <DialogDescription className="text-stone-400">
              Select an exercise to add to your workout
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-stone-800 border-stone-700 text-white"
            />
          </div>

          {/* Category Tabs */}
          <Tabs
            value={selectedCategory}
            onValueChange={(v) => setSelectedCategory(v as any)}
            className="w-full"
          >
            <TabsList className="w-full bg-stone-800">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="strength">Strength</TabsTrigger>
              <TabsTrigger value="cardio">Cardio</TabsTrigger>
              <TabsTrigger value="sports">Sports</TabsTrigger>
            </TabsList>

            <TabsContent
              value={selectedCategory}
              className="max-h-96 overflow-y-auto mt-4 space-y-3"
            >
              {/* Show search results if searching */}
              {searchQuery ? (
                filteredExercises.length > 0 ? (
                  filteredExercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      onClick={() => addExercise(exercise.id, exercise.name)}
                      className="w-full text-left p-4 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
                    >
                      <p className="font-medium text-white">{exercise.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {exercise.muscleGroup && (
                          <span className="text-xs text-emerald-400 capitalize">
                            {exercise.muscleGroup}
                          </span>
                        )}
                        {exercise.equipment && (
                          <span className="text-xs text-stone-400">• {exercise.equipment}</span>
                        )}
                        {exercise.difficulty && (
                          <span
                            className={`text-xs capitalize ${
                              exercise.difficulty === 'beginner'
                                ? 'text-green-400'
                                : exercise.difficulty === 'intermediate'
                                  ? 'text-yellow-400'
                                  : 'text-red-400'
                            }`}
                          >
                            {exercise.difficulty}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-stone-400 py-8">No exercises found</p>
                )
              ) : (
                <>
                  {/* Strength Exercises - Grouped by Muscle */}
                  {(selectedCategory === 'all' || selectedCategory === 'strength') && (
                    <>
                      {groupedExercises.map((group) => (
                        <div
                          key={group.id}
                          className="border border-stone-700 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleGroup(group.id)}
                            className="w-full flex items-center justify-between p-4 bg-stone-800 hover:bg-stone-750 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{group.icon}</span>
                              <div className="text-left">
                                <h3 className="font-semibold text-white">{group.name}</h3>
                                <p className="text-xs text-stone-400">
                                  {group.exercises.length} exercises
                                </p>
                              </div>
                            </div>
                            {expandedGroups.has(group.id) ? (
                              <ChevronDown className="w-5 h-5 text-stone-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-stone-400" />
                            )}
                          </button>

                          {expandedGroups.has(group.id) && (
                            <div className="bg-stone-850 divide-y divide-stone-700">
                              {group.exercises.map((exercise) => (
                                <button
                                  key={exercise.id}
                                  onClick={() => addExercise(exercise.id, exercise.name)}
                                  className="w-full text-left p-4 hover:bg-stone-700 transition-colors"
                                >
                                  <p className="font-medium text-white">{exercise.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {exercise.equipment && (
                                      <span className="text-xs text-stone-400">
                                        {exercise.equipment}
                                      </span>
                                    )}
                                    {exercise.difficulty && (
                                      <span
                                        className={`text-xs capitalize ${
                                          exercise.difficulty === 'beginner'
                                            ? 'text-green-400'
                                            : exercise.difficulty === 'intermediate'
                                              ? 'text-yellow-400'
                                              : 'text-red-400'
                                        }`}
                                      >
                                        • {exercise.difficulty}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}

                  {/* Cardio Exercises */}
                  {(selectedCategory === 'all' || selectedCategory === 'cardio') &&
                    cardioExercises.length > 0 && (
                      <div className="border border-stone-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleGroup('cardio')}
                          className="w-full flex items-center justify-between p-4 bg-stone-800 hover:bg-stone-750 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🏃</span>
                            <div className="text-left">
                              <h3 className="font-semibold text-white">Cardio</h3>
                              <p className="text-xs text-stone-400">
                                {cardioExercises.length} exercises
                              </p>
                            </div>
                          </div>
                          {expandedGroups.has('cardio') ? (
                            <ChevronDown className="w-5 h-5 text-stone-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-stone-400" />
                          )}
                        </button>

                        {expandedGroups.has('cardio') && (
                          <div className="bg-stone-850 divide-y divide-stone-700">
                            {cardioExercises.map((exercise) => (
                              <button
                                key={exercise.id}
                                onClick={() => addExercise(exercise.id, exercise.name)}
                                className="w-full text-left p-4 hover:bg-stone-700 transition-colors"
                              >
                                <p className="font-medium text-white">{exercise.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {exercise.equipment && (
                                    <span className="text-xs text-stone-400">
                                      {exercise.equipment}
                                    </span>
                                  )}
                                  {exercise.cardioType && (
                                    <span className="text-xs text-blue-400 capitalize">
                                      • {exercise.cardioType}
                                    </span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  {/* Sports & Activities */}
                  {(selectedCategory === 'all' || selectedCategory === 'sports') &&
                    sportsExercises.length > 0 && (
                      <div className="border border-stone-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleGroup('sports')}
                          className="w-full flex items-center justify-between p-4 bg-stone-800 hover:bg-stone-750 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">⚽</span>
                            <div className="text-left">
                              <h3 className="font-semibold text-white">Sports & Activities</h3>
                              <p className="text-xs text-stone-400">
                                {sportsExercises.length} exercises
                              </p>
                            </div>
                          </div>
                          {expandedGroups.has('sports') ? (
                            <ChevronDown className="w-5 h-5 text-stone-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-stone-400" />
                          )}
                        </button>

                        {expandedGroups.has('sports') && (
                          <div className="bg-stone-850 divide-y divide-stone-700">
                            {sportsExercises.map((exercise) => (
                              <button
                                key={exercise.id}
                                onClick={() => addExercise(exercise.id, exercise.name)}
                                className="w-full text-left p-4 hover:bg-stone-700 transition-colors"
                              >
                                <p className="font-medium text-white">{exercise.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {exercise.equipment && (
                                    <span className="text-xs text-stone-400">
                                      {exercise.equipment}
                                    </span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md bg-stone-900 border-emerald-500/50">
          <div className="text-center py-4">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-emerald-500" />
            </div>

            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white text-center">
                Workout Saved! 💪
              </DialogTitle>
              <DialogDescription className="text-stone-400 text-center">
                Great job! Your workout has been logged successfully.
              </DialogDescription>
            </DialogHeader>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 my-6">
              <div className="text-center p-4 bg-stone-800 rounded-lg">
                <Clock className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">
                  {Math.floor((lastWorkoutStats?.duration || 0) / 60)}:
                  {String((lastWorkoutStats?.duration || 0) % 60).padStart(2, '0')}
                </p>
                <p className="text-xs text-stone-400">Duration</p>
              </div>
              <div className="text-center p-4 bg-stone-800 rounded-lg">
                <Dumbbell className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{lastWorkoutStats?.sets || 0}</p>
                <p className="text-xs text-stone-400">Sets</p>
              </div>
              <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-xl font-bold text-emerald-400">
                  {lastWorkoutStats?.volume || 0}kg
                </p>
                <p className="text-xs text-emerald-400">Volume</p>
              </div>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
