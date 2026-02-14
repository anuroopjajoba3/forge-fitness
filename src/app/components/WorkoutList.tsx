import { Card } from "./ui/card";
import { Dumbbell, Clock, Flame } from "lucide-react";

interface Workout {
  id: string;
  name: string;
  duration: number;
  calories: number;
  date: string;
  type: string;
}

interface WorkoutListProps {
  workouts: Workout[];
}

export function WorkoutList({ workouts }: WorkoutListProps) {
  const getWorkoutColor = (type: string) => {
    const colors: Record<string, string> = {
      cardio: 'bg-red-100 text-red-700',
      strength: 'bg-blue-100 text-blue-700',
      yoga: 'bg-purple-100 text-purple-700',
      cycling: 'bg-green-100 text-green-700',
    };
    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg mb-4">Recent Workouts</h3>
      <div className="space-y-4">
        {workouts.map((workout) => (
          <div 
            key={workout.id} 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-full">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium">{workout.name}</h4>
                <p className="text-sm text-gray-500">{workout.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{workout.duration} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm">{workout.calories} cal</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${getWorkoutColor(workout.type)}`}>
                {workout.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
