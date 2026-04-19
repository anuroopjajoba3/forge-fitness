import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, Calendar, RefreshCw } from 'lucide-react';
import { authedFetch } from '/utils/supabase/info';
import { ExerciseProgress } from './ExerciseProgress';

interface ProgressAnalyticsProps {
  userId: string;
  userProfile: any;
}

export function ProgressAnalytics({ userId, userProfile }: ProgressAnalyticsProps) {
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [volumeHistory, setVolumeHistory] = useState<any[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  useEffect(() => {
    loadProgressData();
  }, [userId]);

  const loadProgressData = async () => {
    try {
      console.log('Loading progress data for user:', userId);
      const response = await authedFetch(`/progress/${userId}`, {});

      console.log('Progress API response status:', response.status);
      const data = await response.json();
      console.log('Progress API data:', data);

      if (data.success) {
        console.log('Workout history:', data.workoutHistory);
        setWeightHistory(data.weightHistory || []);
        setVolumeHistory(data.volumeHistory || []);
        setWorkoutHistory(data.workoutHistory || []);
      } else {
        console.error('Progress API returned error:', data);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const currentWeight = userProfile?.weight || 0;
  const startWeight = userProfile?.startWeight || currentWeight;
  const targetWeight = userProfile?.targetWeight || currentWeight;
  const weightChange = currentWeight - startWeight;
  const weightToGoal = targetWeight - currentWeight;

  // If viewing exercise details, show that component
  if (selectedExercise) {
    return (
      <ExerciseProgress
        exerciseName={selectedExercise}
        userId={userId}
        onBack={() => setSelectedExercise(null)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Progress & Analytics</h1>
          <p className="text-stone-400">Track your transformation</p>
        </div>
        <Button
          onClick={loadProgressData}
          variant="outline"
          className="border-emerald-500 text-emerald-500"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Weight Progress */}
      <Card className="bg-stone-900 border-stone-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Weight Tracking</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-stone-800 rounded-lg">
            <p className="text-2xl font-bold text-white">{startWeight}kg</p>
            <p className="text-xs text-stone-400">Start</p>
          </div>
          <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <p className="text-2xl font-bold text-emerald-400">{currentWeight}kg</p>
            <p className="text-xs text-emerald-400">Current</p>
          </div>
          <div className="text-center p-4 bg-stone-800 rounded-lg">
            <p className="text-2xl font-bold text-white">{targetWeight}kg</p>
            <p className="text-xs text-stone-400">Target</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-stone-800 rounded-lg">
          <div>
            <p className="text-sm text-stone-400">Total Change</p>
            <p
              className={`text-xl font-bold ${weightChange < 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {weightChange > 0 ? '+' : ''}
              {weightChange.toFixed(1)}kg
            </p>
          </div>
          {weightChange < 0 ? (
            <TrendingDown className="w-8 h-8 text-green-400" />
          ) : (
            <TrendingUp className="w-8 h-8 text-red-400" />
          )}
        </div>
      </Card>

      {/* Volume Progression */}
      <Card className="bg-stone-900 border-stone-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Strength Progress</h3>
        <p className="text-stone-400 text-sm mb-4">
          Track your total volume lifted over time to measure strength gains
        </p>
        {volumeHistory.length === 0 ? (
          <div className="text-center py-8 text-stone-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Start logging workouts to see your progress</p>
          </div>
        ) : (
          <div className="space-y-2">
            {volumeHistory.slice(0, 5).map((entry: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-stone-800 rounded-lg"
              >
                <span className="text-sm text-stone-400">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <span className="text-lg font-bold text-purple-400">{entry.volume}kg</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Workout History */}
      <Card className="bg-stone-900 border-stone-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Workout History</h3>
        {workoutHistory.length === 0 ? (
          <div className="text-center py-8 text-stone-500">
            <p>No workouts logged yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workoutHistory.slice(0, 10).map((workout: any, index: number) => (
              <div key={index} className="p-4 bg-stone-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-white">
                      {new Date(workout.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-stone-400">
                      {workout.exercises?.length || 0} exercises • {workout.totalSets} sets
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-400">{workout.totalVolume}kg</p>
                    <p className="text-xs text-stone-400">{Math.floor(workout.duration / 60)}min</p>
                  </div>
                </div>
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {workout.exercises.map((ex: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedExercise(ex.name)}
                        className="text-xs px-2 py-1 bg-stone-700 hover:bg-emerald-500/20 hover:border-emerald-500/50 border border-stone-600 rounded text-stone-300 hover:text-emerald-400 transition-all cursor-pointer"
                      >
                        {ex.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
