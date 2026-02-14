import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Plus, Droplets, Apple, History } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { NutritionHistory } from './NutritionHistory';

interface NutritionTrackerProps {
  userId: string;
  userProfile: any;
}

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: string;
  date: string;
}

export function NutritionTracker({ userId, userProfile }: NutritionTrackerProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    mealType: 'breakfast',
  });

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-56c079d7`;

  useEffect(() => {
    loadTodayMeals();
    loadWaterIntake();
  }, [userId]);

  const loadTodayMeals = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${API_BASE}/meals/${userId}/${today}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success && data.meals) {
        setMeals(data.meals);
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const loadWaterIntake = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${API_BASE}/water/${userId}/${today}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success) {
        setWaterIntake(data.amount || 0);
      }
    } catch (error) {
      console.error('Error loading water:', error);
    }
  };

  const addMeal = async () => {
    if (!newMeal.name || newMeal.calories === 0) {
      alert('Please fill in meal name and calories');
      return;
    }

    const meal = {
      ...newMeal,
      id: Date.now().toString(),
      userId,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE}/meals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(meal),
      });

      const data = await response.json();
      if (data.success) {
        setMeals([...meals, meal]);
        setIsAddMealOpen(false);
        setNewMeal({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0, mealType: 'breakfast' });
      }
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const addWater = async (amount: number) => {
    const newAmount = waterIntake + amount;
    setWaterIntake(newAmount);

    try {
      await fetch(`${API_BASE}/water`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          userId,
          amount: newAmount,
          date: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error updating water:', error);
    }
  };

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const calorieTarget = 2000; // Could be from user profile
  const proteinTarget = 150;
  const waterTarget = 2000; // ml

  // If showing history, render that component
  if (showHistory) {
    return <NutritionHistory userId={userId} onBack={() => setShowHistory(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Nutrition Tracker</h1>
        <p className="text-stone-400">Track your macros and hydration</p>
      </div>

      {/* Macro Dashboard */}
      <Card className="bg-stone-900 border-stone-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Today's Macros</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-stone-800 rounded-lg">
            <p className="text-3xl font-bold text-white">{totals.calories}</p>
            <p className="text-sm text-stone-400">Calories</p>
            <p className="text-xs text-emerald-400 mt-1">{calorieTarget} target</p>
          </div>
          <div className="text-center p-4 bg-stone-800 rounded-lg">
            <p className="text-3xl font-bold text-blue-400">{totals.protein}g</p>
            <p className="text-sm text-stone-400">Protein</p>
            <p className="text-xs text-blue-300 mt-1">{proteinTarget}g target</p>
          </div>
          <div className="text-center p-4 bg-stone-800 rounded-lg">
            <p className="text-3xl font-bold text-red-400">{totals.carbs}g</p>
            <p className="text-sm text-stone-400">Carbs</p>
          </div>
          <div className="text-center p-4 bg-stone-800 rounded-lg">
            <p className="text-3xl font-bold text-yellow-400">{totals.fats}g</p>
            <p className="text-sm text-stone-400">Fats</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-stone-400">Calories</span>
              <span className="text-white">{Math.round((totals.calories / calorieTarget) * 100)}%</span>
            </div>
            <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${Math.min((totals.calories / calorieTarget) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-stone-400">Protein</span>
              <span className="text-white">{Math.round((totals.protein / proteinTarget) * 100)}%</span>
            </div>
            <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${Math.min((totals.protein / proteinTarget) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Hydration Tracker */}
      <Card className="bg-stone-900 border-stone-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              Hydration
            </h3>
            <p className="text-sm text-stone-400 mt-1">{waterIntake}ml / {waterTarget}ml</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => addWater(250)} className="bg-cyan-500 hover:bg-cyan-600">
              +250ml
            </Button>
            <Button size="sm" onClick={() => addWater(500)} className="bg-cyan-500 hover:bg-cyan-600">
              +500ml
            </Button>
          </div>
        </div>
        <div className="h-3 bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
            style={{ width: `${Math.min((waterIntake / waterTarget) * 100, 100)}%` }}
          />
        </div>
      </Card>

      {/* Meals */}
      <Card className="bg-stone-900 border-stone-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Meals</h3>
          <Button onClick={() => setIsAddMealOpen(true)} className="bg-emerald-500 hover:bg-emerald-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Meal
          </Button>
        </div>

        {meals.length === 0 ? (
          <div className="text-center py-8">
            <Apple className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <p className="text-stone-400">No meals logged yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <div key={meal.id} className="p-4 bg-stone-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-white">{meal.name}</p>
                    <p className="text-xs text-stone-400 capitalize">{meal.mealType}</p>
                  </div>
                  <p className="text-lg font-bold text-emerald-400">{meal.calories} cal</p>
                </div>
                <div className="flex gap-4 text-xs text-stone-400">
                  <span>P: {meal.protein}g</span>
                  <span>C: {meal.carbs}g</span>
                  <span>F: {meal.fats}g</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add Meal Dialog */}
      <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
        <DialogContent className="bg-stone-900 border-stone-800">
          <DialogHeader>
            <DialogTitle className="text-white">Add Meal</DialogTitle>
            <DialogDescription className="text-stone-400">Add a new meal to your nutrition log</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="meal-name" className="text-white">Meal Name</Label>
              <Input
                id="meal-name"
                value={newMeal.name}
                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                placeholder="e.g., Chicken & Rice"
                className="bg-stone-800 border-stone-700 text-white mt-2"
              />
            </div>

            <div>
              <Label htmlFor="meal-type" className="text-white">Meal Type</Label>
              <Select value={newMeal.mealType} onValueChange={(v) => setNewMeal({ ...newMeal, mealType: v })}>
                <SelectTrigger className="bg-stone-800 border-stone-700 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-stone-800 border-stone-700">
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="calories" className="text-white">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={newMeal.calories || ''}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) || 0 })}
                  className="bg-stone-800 border-stone-700 text-white mt-2"
                />
              </div>
              <div>
                <Label htmlFor="protein" className="text-white">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={newMeal.protein || ''}
                  onChange={(e) => setNewMeal({ ...newMeal, protein: parseInt(e.target.value) || 0 })}
                  className="bg-stone-800 border-stone-700 text-white mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="carbs" className="text-white">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={newMeal.carbs || ''}
                  onChange={(e) => setNewMeal({ ...newMeal, carbs: parseInt(e.target.value) || 0 })}
                  className="bg-stone-800 border-stone-700 text-white mt-2"
                />
              </div>
              <div>
                <Label htmlFor="fats" className="text-white">Fats (g)</Label>
                <Input
                  id="fats"
                  type="number"
                  value={newMeal.fats || ''}
                  onChange={(e) => setNewMeal({ ...newMeal, fats: parseInt(e.target.value) || 0 })}
                  className="bg-stone-800 border-stone-700 text-white mt-2"
                />
              </div>
            </div>

            <Button onClick={addMeal} className="w-full bg-emerald-500 hover:bg-emerald-600">
              Add Meal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Button */}
      <Button onClick={() => setShowHistory(true)} className="w-full bg-stone-800 hover:bg-stone-700 text-white mt-4">
        <History className="w-4 h-4 mr-2" />
        View History
      </Button>
    </div>
  );
}