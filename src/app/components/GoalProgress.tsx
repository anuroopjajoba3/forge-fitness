import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Target } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface GoalProgressProps {
  goals: Goal[];
}

export function GoalProgress({ goals }: GoalProgressProps) {
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5" />
        <h3 className="text-lg">Daily Goals</h3>
      </div>
      <div className="space-y-6">
        {goals.map((goal) => {
          const percentage = getProgressPercentage(goal.current, goal.target);
          return (
            <div key={goal.id}>
              <div className="flex justify-between mb-2">
                <span className="text-sm">{goal.name}</span>
                <span className="text-sm text-gray-500">
                  {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {percentage.toFixed(0)}% complete
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
