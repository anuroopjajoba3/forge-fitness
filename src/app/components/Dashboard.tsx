import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dumbbell, Flame, Clock, TrendingUp, Target, Droplets, Footprints } from 'lucide-react';
import { authedFetch } from '/utils/supabase/info';

interface DashboardProps {
  userId: string;
  userProfile: any;
  onNavigateToWorkout: () => void;
}

export function Dashboard({ userId, userProfile, onNavigateToWorkout }: DashboardProps) {
  const [todayStats, setTodayStats] = useState({
    workouts: 0,
    duration: 0,
    caloriesBurned: 0,
    volumeLifted: 0,
    waterIntake: 0,
    steps: 0,
  });

  const [weekStats, setWeekStats] = useState({
    workouts: 0,
    duration: 0,
    caloriesBurned: 0,
    volumeLifted: 0,
    waterIntake: 0,
  });

  const [weekActivity, setWeekActivity] = useState([
    { day: 'Mon', active: false },
    { day: 'Tue', active: false },
    { day: 'Wed', active: false },
    { day: 'Thu', active: false },
    { day: 'Fri', active: false },
    { day: 'Sat', active: false },
    { day: 'Sun', active: false },
  ]);
  useEffect(() => {
    loadTodayStats();
  }, [userId]);

  const loadTodayStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Fetch ALL workouts
      const workoutsResponse = await authedFetch(`/workouts/${userId}`, {});
      const workoutsData = await workoutsResponse.json();
      const allWorkouts = workoutsData.workouts || [];

      // Calculate stats for TODAY
      const todaysWorkouts = allWorkouts.filter((w: any) => {
        const workoutDate = new Date(w.date).toISOString().split('T')[0];
        return workoutDate === today;
      });

      const todayWorkoutsCount = todaysWorkouts.length;
      const todayDuration = todaysWorkouts.reduce(
        (sum: number, w: any) => sum + (w.duration || 0),
        0,
      );
      const todayVolume = todaysWorkouts.reduce(
        (sum: number, w: any) => sum + (w.totalVolume || 0),
        0,
      );
      const todayCaloriesBurned = Math.round((todayDuration / 60) * 5);

      // Fetch today's water
      const waterResponse = await authedFetch(`/water/${userId}/${today}`, {});
      const waterData = await waterResponse.json();
      const todayWater = waterData.amount || 0;

      // Calculate WEEKLY activity (last 7 days)
      const weeklyActivity = [];
      let weekWorkoutsCount = 0;
      let weekDuration = 0;
      let weekVolume = 0;
      let weekWater = 0;

      const waterPromises = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Check if there's a workout on this day
        const dayWorkouts = allWorkouts.filter((w: any) => {
          const workoutDate = new Date(w.date).toISOString().split('T')[0];
          return workoutDate === dateStr;
        });

        const hasWorkout = dayWorkouts.length > 0;
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];

        weeklyActivity.push({
          day: dayName,
          active: hasWorkout,
          workouts: dayWorkouts.length,
        });

        // Accumulate weekly stats
        if (hasWorkout) {
          weekWorkoutsCount += dayWorkouts.length;
          weekDuration += dayWorkouts.reduce((sum: number, w: any) => sum + (w.duration || 0), 0);
          weekVolume += dayWorkouts.reduce((sum: number, w: any) => sum + (w.totalVolume || 0), 0);
        }

        // Fetch water for this day
        waterPromises.push(
          authedFetch(`/water/${userId}/${dateStr}`, {})
            .then((res) => res.json())
            .catch(() => ({ amount: 0 })),
        );
      }

      // Get all water data for the week
      const weekWaterData = await Promise.all(waterPromises);
      weekWater = weekWaterData.reduce((sum: number, data: any) => sum + (data.amount || 0), 0);

      const weekCaloriesBurned = Math.round((weekDuration / 60) * 5);

      console.log('Weekly activity:', weeklyActivity);
      console.log('Week stats:', { weekWorkoutsCount, weekDuration, weekVolume, weekWater });

      setWeekActivity(weeklyActivity);

      // Set TODAY stats
      setTodayStats({
        workouts: todayWorkoutsCount,
        duration: Math.round(todayDuration / 60), // Convert to minutes
        caloriesBurned: todayCaloriesBurned,
        volumeLifted: todayVolume,
        waterIntake: todayWater,
        steps: 0,
      });

      // Set WEEKLY stats
      setWeekStats({
        workouts: weekWorkoutsCount,
        duration: Math.round(weekDuration / 60), // Convert to minutes
        caloriesBurned: weekCaloriesBurned,
        volumeLifted: weekVolume,
        waterIntake: weekWater,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const goals = [
    {
      id: 'steps',
      name: 'Steps',
      current: todayStats.steps,
      target: 10000,
      icon: Footprints,
      color: 'blue',
    },
    {
      id: 'calories',
      name: 'Calories',
      current: todayStats.caloriesBurned,
      target: 500,
      icon: Flame,
      color: 'red',
    },
    {
      id: 'water',
      name: 'Water (ml)',
      current: todayStats.waterIntake,
      target: 2000,
      icon: Droplets,
      color: 'cyan',
    },
    {
      id: 'duration',
      name: 'Active Minutes',
      current: todayStats.duration,
      target: 60,
      icon: Clock,
      color: 'green',
    },
  ];

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-stone-400">Your weekly summary</p>
        </div>

        {/* Weekly Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 p-6">
            <Dumbbell className="w-8 h-8 text-white/80 mb-3" />
            <p className="text-3xl font-bold text-white">{weekStats.workouts}</p>
            <p className="text-sm text-white/80">Workouts This Week</p>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 p-6">
            <Clock className="w-8 h-8 text-white/80 mb-3" />
            <p className="text-3xl font-bold text-white">{formatTime(weekStats.duration)}</p>
            <p className="text-sm text-white/80">Total Duration</p>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-0 p-6">
            <Flame className="w-8 h-8 text-white/80 mb-3" />
            <p className="text-3xl font-bold text-white">{weekStats.caloriesBurned}</p>
            <p className="text-sm text-white/80">Calories Burned</p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 border-0 p-6">
            <TrendingUp className="w-8 h-8 text-white/80 mb-3" />
            <p className="text-3xl font-bold text-white">{weekStats.volumeLifted}kg</p>
            <p className="text-sm text-white/80">Total Volume</p>
          </Card>
        </div>

        {/* Activity Trends */}
        <Card className="bg-stone-900 border-stone-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Activity</h3>
          <p className="text-sm text-stone-400 mb-4">
            {weekStats.workouts} workouts completed this week
          </p>
          <div className="flex items-end justify-between gap-2 h-40">
            {weekActivity.map((day, index) => (
              <div key={`${day.day}-${index}`} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-full rounded-lg transition-all flex items-end justify-center ${
                    day.active ? 'bg-emerald-500 h-full' : 'bg-stone-700 h-10'
                  }`}
                  title={`${day.day}: ${day.active ? `${(day as any).workouts || 1} workout(s)` : 'Rest day'}`}
                >
                  {day.active && (
                    <span className="text-white text-xs font-bold pb-2">
                      {(day as any).workouts || 1}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${day.active ? 'text-emerald-400' : 'text-stone-500'}`}
                >
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Goal Progress */}
        <Card className="bg-stone-900 border-stone-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Goals</h3>
          <div className="space-y-4">
            {goals.map((goal) => {
              const Icon = goal.icon;
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 text-${goal.color}-500`} />
                      <span className="text-sm text-white font-medium">{goal.name}</span>
                    </div>
                    <span className="text-sm text-stone-400">
                      {goal.current} / {goal.target}
                    </span>
                  </div>
                  <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-${goal.color}-500 transition-all`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* AI Recommendations */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-700/50 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">AI Recommendation</h3>
              <p className="text-stone-300 mb-4">
                Based on your profile ({userProfile?.goal || 'maintain'}), we recommend focusing on{' '}
                {userProfile?.goal === 'Lose Weight'
                  ? 'cardio and high-rep training'
                  : userProfile?.goal === 'Build Muscle'
                    ? 'progressive overload with compound movements'
                    : 'balanced strength and cardio training'}{' '}
                this week.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-purple-500 hover:bg-purple-600"
                  onClick={onNavigateToWorkout}
                >
                  View Suggested Workout
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
