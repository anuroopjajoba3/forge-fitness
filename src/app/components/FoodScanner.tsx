import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";

interface NutritionData {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  mealType?: string;
}

interface FoodScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NutritionData) => void;
}

export function FoodScanner({ isOpen, onClose, onSave }: FoodScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [mealType, setMealType] = useState<string>("breakfast");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyzeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    
    try {
      // In production, call your AI API here
      // For now, using mock data with variety
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockFoods = [
        {
          foodName: "Grilled Chicken Salad",
          calories: 350,
          protein: 32,
          carbs: 25,
          fat: 12,
          fiber: 8,
          sugar: 6,
          sodium: 320,
          servingSize: "1 bowl (300g)",
        },
        {
          foodName: "Salmon with Rice",
          calories: 520,
          protein: 38,
          carbs: 52,
          fat: 18,
          fiber: 4,
          sugar: 2,
          sodium: 480,
          servingSize: "1 plate (400g)",
        },
        {
          foodName: "Fruit Smoothie Bowl",
          calories: 280,
          protein: 8,
          carbs: 58,
          fat: 5,
          fiber: 12,
          sugar: 32,
          sodium: 95,
          servingSize: "1 bowl (350g)",
        },
      ];
      
      const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
      setNutritionData(randomFood);
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (nutritionData) {
      onSave({ ...nutritionData, mealType });
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setImage(null);
    setNutritionData(null);
    setIsAnalyzing(false);
    setMealType("breakfast");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Scan Food - AI Powered</DialogTitle>
          <DialogDescription>
            Upload an image of your food to get AI-powered nutrition analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!image ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Take a photo or upload an image of your food</p>
                <p className="text-sm text-gray-500 mb-4">Our AI will analyze and provide nutritional information</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative">
                <img
                  src={image}
                  alt="Food"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={handleReset}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Analyzing State */}
              {isAnalyzing && (
                <Card className="p-8 text-center">
                  <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
                  <p className="text-gray-600">AI is analyzing your food...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                </Card>
              )}

              {/* Nutrition Results */}
              {nutritionData && !isAnalyzing && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-600">AI Analysis Complete</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{nutritionData.foodName}</h3>
                  <p className="text-sm text-gray-500 mb-4">Serving Size: {nutritionData.servingSize}</p>

                  {/* Meal Type Selector */}
                  <div className="mb-6">
                    <Label htmlFor="mealType">Meal Type</Label>
                    <Select value={mealType} onValueChange={setMealType}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                        <SelectItem value="lunch">☀️ Lunch</SelectItem>
                        <SelectItem value="dinner">🌙 Dinner</SelectItem>
                        <SelectItem value="snack">🍪 Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{nutritionData.protein}g</p>
                      <p className="text-sm text-gray-600">Protein</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{nutritionData.carbs}g</p>
                      <p className="text-sm text-gray-600">Carbs</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{nutritionData.fat}g</p>
                      <p className="text-sm text-gray-600">Fat</p>
                    </div>
                  </div>

                  {/* Total Calories */}
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Calories</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {nutritionData.calories} kcal
                      </span>
                    </div>
                  </div>

                  {/* Micros */}
                  <div className="space-y-2">
                    <h4 className="font-medium mb-3">Additional Nutrients</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Fiber</span>
                        <span className="text-sm font-medium">{nutritionData.fiber}g</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Sugar</span>
                        <span className="text-sm font-medium">{nutritionData.sugar}g</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded col-span-2">
                        <span className="text-sm text-gray-600">Sodium</span>
                        <span className="text-sm font-medium">{nutritionData.sodium}mg</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={handleReset} className="flex-1">
                      Scan Another
                    </Button>
                    <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500">
                      Save to Log
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}