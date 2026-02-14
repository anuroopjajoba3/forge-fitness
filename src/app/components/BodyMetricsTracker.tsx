import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Scale, Activity, Zap } from "lucide-react";

interface BodyMetrics {
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  date: string;
}

interface BodyMetricsTrackerProps {
  currentWeight: number;
  height: number;
  onSave: (metrics: BodyMetrics) => void;
}

export function BodyMetricsTracker({ currentWeight, height, onSave }: BodyMetricsTrackerProps) {
  const [weight, setWeight] = useState(currentWeight.toString());
  const [bodyFat, setBodyFat] = useState("");
  const [muscleMass, setMuscleMass] = useState("");

  const calculateBMI = (weightKg: number, heightCm: number) => {
    const heightM = heightCm / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { label: "Normal", color: "text-green-600" };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-600" };
    return { label: "Obese", color: "text-red-600" };
  };

  const handleSave = () => {
    const metrics: BodyMetrics = {
      weight: parseFloat(weight),
      bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
      muscleMass: muscleMass ? parseFloat(muscleMass) : undefined,
      date: new Date().toISOString(),
    };
    onSave(metrics);
    setBodyFat("");
    setMuscleMass("");
  };

  const bmi = parseFloat(calculateBMI(parseFloat(weight) || currentWeight, height));
  const bmiCategory = getBMICategory(bmi);

  return (
    <Card className="p-6">
      <h3 className="text-lg mb-4 flex items-center gap-2">
        <Scale className="w-5 h-5" />
        Body Metrics Tracker
      </h3>

      <div className="space-y-4">
        {/* Current Weight */}
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-2"
          />
        </div>

        {/* BMI Display */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">BMI</span>
            <span className={`text-xs ${bmiCategory.color}`}>{bmiCategory.label}</span>
          </div>
          <div className="text-3xl font-bold">{bmi}</div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
              style={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Body Fat Percentage */}
        <div>
          <Label htmlFor="bodyFat">Body Fat % (optional)</Label>
          <div className="relative mt-2">
            <Input
              id="bodyFat"
              type="number"
              step="0.1"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              placeholder="e.g., 15.5"
            />
            <Zap className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Muscle Mass */}
        <div>
          <Label htmlFor="muscleMass">Muscle Mass kg (optional)</Label>
          <div className="relative mt-2">
            <Input
              id="muscleMass"
              type="number"
              step="0.1"
              value={muscleMass}
              onChange={(e) => setMuscleMass(e.target.value)}
              placeholder="e.g., 45.2"
            />
            <Activity className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Estimated Body Composition */}
        {bodyFat && weight && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-gray-500">Fat Mass</p>
              <p className="text-lg font-medium">
                {((parseFloat(weight) * parseFloat(bodyFat)) / 100).toFixed(1)} kg
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Lean Mass</p>
              <p className="text-lg font-medium">
                {(parseFloat(weight) - (parseFloat(weight) * parseFloat(bodyFat)) / 100).toFixed(1)} kg
              </p>
            </div>
          </div>
        )}

        <Button onClick={handleSave} className="w-full">
          Save Metrics
        </Button>
      </div>
    </Card>
  );
}
