import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Calendar, Droplets, Apple, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { authedFetch } from '/utils/supabase/info';

interface NutritionHistoryProps {
  userId: string;
  onBack: () => void;
}

interface DailyNutrition {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number;
  mealCount: number;
}

export function NutritionHistory({ userId, onBack }: NutritionHistoryProps) {
  const [history, setHistory] = useState<DailyNutrition[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  useEffect(() => {
    fetchHistory();
  }, [userId, viewMode]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const days = viewMode === 'week' ? 7 : 30;

      // Generate all date promises
      const datePromises = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        datePromises.push({
          date: date,
          dateStr: dateStr,
          mealsPromise: authedFetch(`/meals/${userId}/${dateStr}`, {})
            .then((res) => res.json())
            .catch(() => ({ success: false, meals: [] })),
          waterPromise: authedFetch(`/water/${userId}/${dateStr}`, {})
            .then((res) => res.json())
            .catch(() => ({ success: false, amount: 0 })),
        });
      }

      // Fetch all data in parallel
      const results = await Promise.all(
        datePromises.map(async ({ date, dateStr, mealsPromise, waterPromise }) => {
          const [mealsData, waterData] = await Promise.all([mealsPromise, waterPromise]);

          const meals = mealsData.meals || [];
          const totals = meals.reduce(
            (acc: any, meal: any) => ({
              calories: acc.calories + (meal.calories || 0),
              protein: acc.protein + (meal.protein || 0),
              carbs: acc.carbs + (meal.carbs || 0),
              fats: acc.fats + (meal.fats || 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fats: 0 },
          );

          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            calories: totals.calories,
            protein: totals.protein,
            carbs: totals.carbs,
            fats: totals.fats,
            water: waterData.amount || 0,
            mealCount: meals.length,
          };
        }),
      );

      setHistory(results.reverse());
    } catch (error) {
      console.error('Error fetching nutrition history:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    avgCalories:
      history.length > 0
        ? Math.round(history.reduce((sum, day) => sum + day.calories, 0) / history.length)
        : 0,
    avgProtein:
      history.length > 0
        ? Math.round(history.reduce((sum, day) => sum + day.protein, 0) / history.length)
        : 0,
    avgWater:
      history.length > 0
        ? Math.round(history.reduce((sum, day) => sum + day.water, 0) / history.length)
        : 0,
    totalMeals: history.reduce((sum, day) => sum + day.mealCount, 0),
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="text-stone-400">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Nutrition History</h1>
            <p className="text-stone-400">Loading your data...</p>
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-stone-900 border-stone-800 p-4 animate-pulse">
              <div className="h-4 bg-stone-700 rounded w-20 mb-3"></div>
              <div className="h-8 bg-stone-700 rounded w-16 mb-2"></div>
              <div className="h-3 bg-stone-700 rounded w-12"></div>
            </Card>
          ))}
        </div>

        <Card className="bg-stone-900 border-stone-800 p-6">
          <div className="h-6 bg-stone-700 rounded w-32 mb-4 animate-pulse"></div>
          <div className="h-64 bg-stone-800 rounded animate-pulse"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="text-stone-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Nutrition History</h1>
            <p className="text-stone-400">Track your nutrition over time</p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'week' | 'month')}>
          <TabsList className="bg-stone-800">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-stone-900 border-stone-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Apple className="w-4 h-4 text-emerald-400" />
            <p className="text-xs text-stone-400">Avg Calories</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgCalories}</p>
          <p className="text-xs text-stone-500 mt-1">per day</p>
        </Card>

        <Card className="bg-stone-900 border-stone-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-stone-400">Avg Protein</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgProtein}g</p>
          <p className="text-xs text-stone-500 mt-1">per day</p>
        </Card>

        <Card className="bg-stone-900 border-stone-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <p className="text-xs text-stone-400">Avg Water</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgWater}ml</p>
          <p className="text-xs text-stone-500 mt-1">per day</p>
        </Card>

        <Card className="bg-stone-900 border-stone-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-stone-400">Total Meals</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalMeals}</p>
          <p className="text-xs text-stone-500 mt-1">
            {viewMode === 'week' ? 'this week' : 'this month'}
          </p>
        </Card>
      </div>

      {/* Calories Chart */}
      {history.length > 0 && (
        <Card className="bg-stone-900 border-stone-800 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Calorie Intake</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                label={{ value: 'Calories', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1917',
                  border: '1px solid #44403c',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#10b981"
                strokeWidth={3}
                name="Calories"
                dot={{ fill: '#10b981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Macros Chart */}
      {history.length > 0 && (
        <Card className="bg-stone-900 border-stone-800 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Macronutrients</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                label={{ value: 'Grams', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1917',
                  border: '1px solid #44403c',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="protein" fill="#3b82f6" name="Protein (g)" />
              <Bar dataKey="carbs" fill="#ef4444" name="Carbs (g)" />
              <Bar dataKey="fats" fill="#eab308" name="Fats (g)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Hydration Chart */}
      {history.length > 0 && (
        <Card className="bg-stone-900 border-stone-800 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Hydration</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                label={{ value: 'Water (ml)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1917',
                  border: '1px solid #44403c',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="water" fill="#06b6d4" name="Water (ml)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Daily Breakdown */}
      <Card className="bg-stone-900 border-stone-800 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Daily Breakdown</h3>
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-center text-stone-400 py-8">No nutrition data yet</p>
          ) : (
            history
              .slice()
              .reverse()
              .map((day, idx) => (
                <div key={idx} className="p-4 bg-stone-800 rounded-lg border border-stone-700">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-white font-medium">{day.date}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-emerald-400">{day.calories} cal</span>
                      <span className="text-cyan-400">{day.water}ml</span>
                    </div>
                  </div>
                  <div className="flex gap-6 text-xs text-stone-400">
                    <span>
                      P: <span className="text-blue-400 font-medium">{day.protein}g</span>
                    </span>
                    <span>
                      C: <span className="text-red-400 font-medium">{day.carbs}g</span>
                    </span>
                    <span>
                      F: <span className="text-yellow-400 font-medium">{day.fats}g</span>
                    </span>
                    <span className="ml-auto">{day.mealCount} meals</span>
                  </div>
                </div>
              ))
          )}
        </div>
      </Card>
    </div>
  );
}
