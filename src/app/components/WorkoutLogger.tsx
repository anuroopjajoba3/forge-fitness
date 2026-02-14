import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dumbbell, Clock, Flame } from "lucide-react";
import { Textarea } from "./ui/textarea";

export interface WorkoutData {
  id: string;
  name: string;
  type: string;
  duration: number;
  calories: number;
  date: string;
  notes?: string;
  exercises?: Array<{
    name: string;
    sets?: number;
    reps?: number;
    weight?: number;
  }>;
}

interface WorkoutLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: WorkoutData) => void;
}

const workoutTypes = [
  { value: "cardio", label: "Cardio", icon: "🏃" },
  { value: "strength", label: "Strength Training", icon: "💪" },
  { value: "yoga", label: "Yoga", icon: "🧘" },
  { value: "cycling", label: "Cycling", icon: "🚴" },
  { value: "swimming", label: "Swimming", icon: "🏊" },
  { value: "sports", label: "Sports", icon: "⚽" },
  { value: "other", label: "Other", icon: "🏋️" },
];

export function WorkoutLogger({ isOpen, onClose, onSave }: WorkoutLoggerProps) {
  const [workoutName, setWorkoutName] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!workoutName || !workoutType || !duration || !calories) {
      alert("Please fill in all required fields");
      return;
    }

    const workout: WorkoutData = {
      id: Date.now().toString(),
      name: workoutName,
      type: workoutType,
      duration: parseInt(duration),
      calories: parseInt(calories),
      date: new Date().toISOString(),
      notes: notes || undefined,
    };

    onSave(workout);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setWorkoutName("");
    setWorkoutType("");
    setDuration("");
    setCalories("");
    setNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Log Workout</DialogTitle>
          <DialogDescription>Record your workout session with details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="workout-name">Workout Name</Label>
            <Input
              id="workout-name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., Morning Run"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="workout-type">Workout Type</Label>
            <Select value={workoutType} onValueChange={setWorkoutType}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select workout type" />
              </SelectTrigger>
              <SelectContent>
                {workoutTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <div className="relative mt-2">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="30"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="calories">Calories (optional)</Label>
              <div className="relative mt-2">
                <Flame className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="calories"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="Auto"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about your workout..."
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Dumbbell className="w-4 h-4 mr-2" />
              Save Workout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}