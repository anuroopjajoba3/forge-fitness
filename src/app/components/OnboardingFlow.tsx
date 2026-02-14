import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Activity, User, Target, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface UserProfile {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  goal: string;
  targetWeight?: number;
}

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(profile as UserProfile);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile({ ...profile, ...data });
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return profile.name && profile.age && profile.gender;
      case 2:
        return profile.height && profile.weight;
      case 3:
        return profile.activityLevel && profile.goal;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-stone-900 border-stone-800">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome to Forge</h1>
            <p className="text-stone-400">Let's set up your profile</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-stone-400">Step {step} of 3</span>
            <span className="text-sm text-emerald-500 font-semibold">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-stone-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-semibold text-white">Personal Information</h2>
            </div>
            
            <div>
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                value={profile.name || ""}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Enter your name"
                className="mt-2 bg-stone-800 border-stone-700 text-white placeholder:text-stone-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age" className="text-white">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age || ""}
                  onChange={(e) => updateProfile({ age: parseInt(e.target.value) })}
                  placeholder="25"
                  className="mt-2 bg-stone-800 border-stone-700 text-white placeholder:text-stone-500"
                />
              </div>

              <div>
                <Label htmlFor="gender" className="text-white">Gender</Label>
                <Select value={profile.gender} onValueChange={(value) => updateProfile({ gender: value })}>
                  <SelectTrigger className="mt-2 bg-stone-800 border-stone-700 text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-stone-800 border-stone-700">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Physical Stats */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-semibold text-white">Physical Stats</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height" className="text-white">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profile.height || ""}
                  onChange={(e) => updateProfile({ height: parseInt(e.target.value) })}
                  placeholder="170"
                  className="mt-2 bg-stone-800 border-stone-700 text-white placeholder:text-stone-500"
                />
              </div>

              <div>
                <Label htmlFor="weight" className="text-white">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight || ""}
                  onChange={(e) => updateProfile({ weight: parseInt(e.target.value) })}
                  placeholder="70"
                  className="mt-2 bg-stone-800 border-stone-700 text-white placeholder:text-stone-500"
                />
              </div>
            </div>

            {/* BMI Display */}
            {profile.height && profile.weight && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <p className="text-sm text-emerald-400 mb-1 font-medium">Your BMI</p>
                <p className="text-3xl font-bold text-white">
                  {((profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1))}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  {parseFloat((profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)) < 18.5 ? 'Underweight' :
                   parseFloat((profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)) < 25 ? 'Normal weight' :
                   parseFloat((profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)) < 30 ? 'Overweight' : 'Obese'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-semibold text-white">Fitness Goals</h2>
            </div>

            <div>
              <Label htmlFor="activityLevel" className="text-white">Activity Level</Label>
              <Select value={profile.activityLevel} onValueChange={(value) => updateProfile({ activityLevel: value })}>
                <SelectTrigger className="mt-2 bg-stone-800 border-stone-700 text-white">
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
                <SelectContent className="bg-stone-800 border-stone-700">
                  <SelectItem value="sedentary">Sedentary (Little or no exercise)</SelectItem>
                  <SelectItem value="light">Light (Exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (Exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (Exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="veryActive">Very Active (Intense exercise daily)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="goal" className="text-white">Primary Goal</Label>
              <Select value={profile.goal} onValueChange={(value) => updateProfile({ goal: value })}>
                <SelectTrigger className="mt-2 bg-stone-800 border-stone-700 text-white">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent className="bg-stone-800 border-stone-700">
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Muscle</SelectItem>
                  <SelectItem value="improve">Improve Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(profile.goal === "lose" || profile.goal === "gain") && (
              <div>
                <Label htmlFor="targetWeight" className="text-white">Target Weight (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  value={profile.targetWeight || ""}
                  onChange={(e) => updateProfile({ targetWeight: parseInt(e.target.value) })}
                  placeholder="65"
                  className="mt-2 bg-stone-800 border-stone-700 text-white placeholder:text-stone-500"
                />
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={handleBack} 
              className="flex-1 border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? "Complete Setup" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
}