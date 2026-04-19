import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Target, Droplets, Footprints, Flame } from 'lucide-react';

export interface Goals {
  caloriesBurn: number;
  caloriesIntake: number;
  steps: number;
  water: number; // in ml
  activeMinutes: number;
  protein: number; // grams
  workoutsPerWeek: number;
}

interface GoalsSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoals: Goals;
  onSave: (goals: Goals) => void;
}

export function GoalsSettings({ isOpen, onClose, currentGoals, onSave }: GoalsSettingsProps) {
  const [goals, setGoals] = useState(currentGoals);

  const handleSave = () => {
    onSave(goals);
    onClose();
  };

  const updateGoal = (field: keyof Goals, value: number) => {
    setGoals({ ...goals, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Daily Goals Settings</DialogTitle>
          <DialogDescription>Set your daily fitness and nutrition targets</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Calorie Goals */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              Calorie Goals
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="caloriesBurn">Daily Burn Target (kcal)</Label>
                <Input
                  id="caloriesBurn"
                  type="number"
                  value={goals.caloriesBurn}
                  onChange={(e) => updateGoal('caloriesBurn', parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="caloriesIntake">Daily Intake Target (kcal)</Label>
                <Input
                  id="caloriesIntake"
                  type="number"
                  value={goals.caloriesIntake}
                  onChange={(e) => updateGoal('caloriesIntake', parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Activity Goals */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Footprints className="w-4 h-4 text-blue-500" />
              Activity Goals
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="steps">Daily Steps</Label>
                <Input
                  id="steps"
                  type="number"
                  value={goals.steps}
                  onChange={(e) => updateGoal('steps', parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="activeMinutes">Active Minutes</Label>
                <Input
                  id="activeMinutes"
                  type="number"
                  value={goals.activeMinutes}
                  onChange={(e) => updateGoal('activeMinutes', parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Hydration Goal */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-500" />
              Hydration Goal
            </h3>
            <div>
              <Label htmlFor="water">Daily Water Intake (ml)</Label>
              <Input
                id="water"
                type="number"
                value={goals.water}
                onChange={(e) => updateGoal('water', parseInt(e.target.value) || 0)}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(goals.water / 1000).toFixed(1)}L or {Math.round(goals.water / 250)} glasses (250ml
                each)
              </p>
            </div>
          </div>

          {/* Nutrition Goals */}
          <div className="space-y-4">
            <h3 className="font-medium">Nutrition Goals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="protein">Daily Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={goals.protein}
                  onChange={(e) => updateGoal('protein', parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="workouts">Workouts Per Week</Label>
                <Input
                  id="workouts"
                  type="number"
                  value={goals.workoutsPerWeek}
                  onChange={(e) => updateGoal('workoutsPerWeek', parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Recommended Goals Info */}
          <div className="p-4 bg-blue-50 rounded-lg text-sm">
            <p className="font-medium mb-2">💡 Recommendations:</p>
            <ul className="space-y-1 text-gray-700">
              <li>• Adults: 8,000-10,000 steps/day</li>
              <li>• Water: 2,000-3,000ml (8-12 glasses)/day</li>
              <li>• Protein: 1.6-2.2g per kg body weight for active individuals</li>
              <li>• Active minutes: 150-300 minutes/week moderate activity</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Goals
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
