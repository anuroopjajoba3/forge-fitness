import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { TrendingUp, Calendar, Flame, Footprints, Dumbbell } from "lucide-react";

interface AnalyticsData {
  weeklyStats: Array<{
    week: string;
    workouts: number;
    avgCalories: number;
    avgSteps: number;
    totalDuration: number;
  }>;
  monthlyStats: Array<{
    month: string;
    workouts: number;
    calories: number;
    steps: number;
  }>;
  workoutTypes: Array<{
    type: string;
    count: number;
    totalMinutes: number;
  }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        {/* Weekly Stats */}
        <TabsContent value="weekly" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="workouts" fill="#3b82f6" name="Workouts" />
                <Bar dataKey="totalDuration" fill="#10b981" name="Total Minutes" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg mb-4">Weekly Averages</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.weeklyStats.map((week, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{week.week}</p>
                  <p className="text-2xl font-bold">{week.workouts}</p>
                  <p className="text-xs text-gray-600">workouts</p>
                  <p className="text-sm mt-2">{week.avgCalories} cal/day</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Monthly Trends */}
        <TabsContent value="monthly" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis yAxisId="left" stroke="#6b7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="workouts"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Workouts"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="calories"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Calories"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.monthlyStats.map((month, idx) => (
              <Card key={idx} className="p-6">
                <h4 className="text-lg mb-4">{month.month}</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Dumbbell className="w-4 h-4" />
                      Workouts
                    </span>
                    <span className="text-lg font-medium">{month.workouts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      Calories
                    </span>
                    <span className="text-lg font-medium">{month.calories.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Footprints className="w-4 h-4" />
                      Steps
                    </span>
                    <span className="text-lg font-medium">{month.steps.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Workout Breakdown */}
        <TabsContent value="breakdown" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg mb-4">Workout Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.workoutTypes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="type" type="category" stroke="#6b7280" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" name="Sessions" />
                <Bar dataKey="totalMinutes" fill="#ec4899" name="Total Minutes" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg mb-4">Workout Frequency</h3>
              <div className="space-y-3">
                {data.workoutTypes.map((type, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{type.type}</p>
                      <p className="text-sm text-gray-500">{type.totalMinutes} min total</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{type.count}</p>
                      <p className="text-xs text-gray-500">sessions</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg mb-4">Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Most Frequent</p>
                  <p className="text-lg text-green-700 capitalize">
                    {data.workoutTypes.reduce((max, type) => 
                      type.count > max.count ? type : max
                    ).type}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Total Sessions</p>
                  <p className="text-lg text-blue-700">
                    {data.workoutTypes.reduce((sum, type) => sum + type.count, 0)} workouts
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">Total Time</p>
                  <p className="text-lg text-purple-700">
                    {Math.round(data.workoutTypes.reduce((sum, type) => sum + type.totalMinutes, 0) / 60)} hours
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
