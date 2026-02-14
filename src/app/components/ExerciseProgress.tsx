import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface ExerciseProgressProps {
  exerciseName: string;
  userId: string;
  onBack: () => void;
}

interface SetData {
  weight: number;
  reps: number;
  completed: boolean;
}

interface WorkoutData {
  id: string;
  date: string;
  exercises: Array<{
    name: string;
    sets: SetData[];
  }>;
}

interface ChartDataPoint {
  date: string;
  maxWeight: number;
  totalVolume: number;
  totalReps: number;
  sets: number;
}

export function ExerciseProgress({ exerciseName, userId, onBack }: ExerciseProgressProps) {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-56c079d7`;

  useEffect(() => {
    fetchExerciseHistory();
  }, [exerciseName, userId]);

  const fetchExerciseHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/workouts/${userId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('Raw API response:', text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        console.error('Response text:', text);
        throw new Error('Invalid JSON response from server');
      }
      
      if (data.success && data.workouts) {
        // Filter workouts that contain this exercise
        const filtered = data.workouts.filter((workout: WorkoutData) =>
          workout.exercises?.some((ex: { name: string }) => ex.name === exerciseName)
        );

        console.log(`Found ${filtered.length} workouts containing ${exerciseName}`);
        setWorkoutHistory(filtered);
        processChartData(filtered);
      } else {
        console.error('API returned unsuccessful response:', data);
      }
    } catch (error) {
      console.error('Error fetching exercise history:', error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (workouts: WorkoutData[]) => {
    const data: ChartDataPoint[] = workouts.map((workout) => {
      const exercise = workout.exercises.find((ex) => ex.name === exerciseName);
      
      if (!exercise) {
        return {
          date: new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          maxWeight: 0,
          totalVolume: 0,
          totalReps: 0,
          sets: 0,
        };
      }

      const completedSets = exercise.sets.filter((set) => set.completed);
      const maxWeight = Math.max(...completedSets.map((set) => set.weight), 0);
      const totalVolume = completedSets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
      const totalReps = completedSets.reduce((sum, set) => sum + set.reps, 0);

      return {
        date: new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        maxWeight,
        totalVolume,
        totalReps,
        sets: completedSets.length,
      };
    }).reverse(); // Most recent first

    setChartData(data);
  };

  const stats = {
    totalWorkouts: workoutHistory.length,
    maxWeightEver: Math.max(...chartData.map((d) => d.maxWeight), 0),
    avgVolume: chartData.length > 0 
      ? Math.round(chartData.reduce((sum, d) => sum + d.totalVolume, 0) / chartData.length)
      : 0,
    totalVolume: chartData.reduce((sum, d) => sum + d.totalVolume, 0),
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="text-stone-400">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="text-stone-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">{exerciseName}</h1>
          <p className="text-stone-400">Progress over time</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-stone-900 border-stone-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-stone-400">Total Sessions</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalWorkouts}</p>
        </Card>

        <Card className="bg-stone-900 border-stone-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <p className="text-xs text-stone-400">Max Weight</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.maxWeightEver}kg</p>
        </Card>

        <Card className="bg-stone-900 border-stone-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-stone-400">Avg Volume</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgVolume}kg</p>
        </Card>

        <Card className="bg-stone-900 border-stone-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <p className="text-xs text-stone-400">Total Volume</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalVolume}kg</p>
        </Card>
      </div>

      {/* Weight Progression Chart */}
      {chartData.length > 0 && (
        <Card className="bg-stone-900 border-stone-800 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Max Weight Progression</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1c1917', 
                  border: '1px solid #44403c',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="maxWeight" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Max Weight (kg)"
                dot={{ fill: '#10b981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Volume Chart */}
      {chartData.length > 0 && (
        <Card className="bg-stone-900 border-stone-800 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Volume Progression</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                label={{ value: 'Volume (kg)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1c1917', 
                  border: '1px solid #44403c',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar 
                dataKey="totalVolume" 
                fill="#8b5cf6" 
                name="Total Volume (kg)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Workout History List */}
      <Card className="bg-stone-900 border-stone-800 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Workout History</h3>
        <div className="space-y-3">
          {workoutHistory.length === 0 ? (
            <p className="text-center text-stone-400 py-8">No workouts found for {exerciseName}</p>
          ) : (
            workoutHistory.map((workout) => {
              const exercise = workout.exercises.find((ex) => ex.name === exerciseName);
              const completedSets = exercise?.sets.filter((s) => s.completed) || [];
              const volume = completedSets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
              const maxWeight = Math.max(...completedSets.map((s) => s.weight), 0);

              return (
                <div
                  key={workout.id}
                  className="p-4 bg-stone-800 rounded-lg border border-stone-700 hover:border-stone-600 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">
                        {new Date(workout.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-stone-400 mt-1">
                        {completedSets.length} sets • {maxWeight}kg max • {volume}kg volume
                      </p>
                    </div>
                  </div>

                  {/* Set Details */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {completedSets.map((set, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-sm text-emerald-400"
                      >
                        Set {idx + 1}: {set.weight}kg × {set.reps}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}