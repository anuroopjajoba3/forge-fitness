import { Card } from './ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DailyProgress {
  date: string;
  weight: number;
  calories: number;
  steps: number;
  workouts: number;
}

interface ProgressTrackerProps {
  dailyData: DailyProgress[];
  currentWeight: number;
  startWeight: number;
  targetWeight?: number;
}

export function ProgressTracker({
  dailyData,
  currentWeight,
  startWeight,
  targetWeight,
}: ProgressTrackerProps) {
  const weightChange = currentWeight - startWeight;
  const percentChange = ((weightChange / startWeight) * 100).toFixed(1);

  const targetProgress = targetWeight
    ? (
        (Math.abs(startWeight - currentWeight) / Math.abs(startWeight - targetWeight)) *
        100
      ).toFixed(0)
    : null;

  return (
    <div className="space-y-6">
      {/* Weight Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-500 mb-2">Starting Weight</p>
          <p className="text-3xl">{startWeight} kg</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-500 mb-2">Current Weight</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl">{currentWeight} kg</p>
            <div
              className={`flex items-center text-sm ${
                weightChange < 0
                  ? 'text-green-600'
                  : weightChange > 0
                    ? 'text-red-600'
                    : 'text-gray-600'
              }`}
            >
              {weightChange < 0 ? (
                <TrendingDown className="w-4 h-4 mr-1" />
              ) : weightChange > 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <Minus className="w-4 h-4 mr-1" />
              )}
              {Math.abs(weightChange).toFixed(1)} kg ({percentChange}%)
            </div>
          </div>
        </Card>

        {targetWeight && (
          <Card className="p-6">
            <p className="text-sm text-gray-500 mb-2">Target Weight</p>
            <p className="text-3xl">{targetWeight} kg</p>
            <p className="text-sm text-gray-600 mt-2">{targetProgress}% to goal</p>
          </Card>
        )}
      </div>

      {/* Weight Chart */}
      <Card className="p-6">
        <h3 className="text-lg mb-4">Weight Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 4 }}
              name="Weight (kg)"
            />
            {targetWeight && (
              <Line
                type="monotone"
                dataKey={() => targetWeight}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Target"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Activity Overview */}
      <Card className="p-6">
        <h3 className="text-lg mb-4">Activity Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis yAxisId="left" stroke="#6b7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="calories"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 3 }}
              name="Calories"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="steps"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3 }}
              name="Steps"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="workouts"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 3 }}
              name="Workouts"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500 mb-1">Total Workouts</p>
          <p className="text-2xl">{dailyData.reduce((sum, day) => sum + day.workouts, 0)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 mb-1">Avg Calories/Day</p>
          <p className="text-2xl">
            {Math.round(dailyData.reduce((sum, day) => sum + day.calories, 0) / dailyData.length)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 mb-1">Avg Steps/Day</p>
          <p className="text-2xl">
            {Math.round(
              dailyData.reduce((sum, day) => sum + day.steps, 0) / dailyData.length,
            ).toLocaleString()}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 mb-1">Days Tracked</p>
          <p className="text-2xl">{dailyData.length}</p>
        </Card>
      </div>
    </div>
  );
}
