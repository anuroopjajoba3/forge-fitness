import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, Dumbbell, Activity as ActivityIcon, Heart } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  muscleGroups: string[];
  equipment: string[];
  caloriesPerMinute: number;
  description: string;
  instructions: string[];
}

const exerciseLibrary: Exercise[] = [
  {
    id: "1",
    name: "Push-ups",
    category: "Strength",
    difficulty: "beginner",
    muscleGroups: ["Chest", "Triceps", "Shoulders"],
    equipment: ["Bodyweight"],
    caloriesPerMinute: 7,
    description: "A classic upper body exercise that builds chest, shoulder, and tricep strength.",
    instructions: [
      "Start in a plank position with hands shoulder-width apart",
      "Lower your body until chest nearly touches the floor",
      "Push back up to starting position",
      "Keep core engaged throughout"
    ]
  },
  {
    id: "2",
    name: "Squats",
    category: "Strength",
    difficulty: "beginner",
    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"],
    equipment: ["Bodyweight", "Barbell"],
    caloriesPerMinute: 8,
    description: "Fundamental lower body exercise targeting legs and glutes.",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower hips back and down as if sitting",
      "Keep chest up and knees tracking over toes",
      "Push through heels to return to standing"
    ]
  },
  {
    id: "3",
    name: "Running",
    category: "Cardio",
    difficulty: "intermediate",
    muscleGroups: ["Legs", "Core", "Cardiovascular"],
    equipment: ["None"],
    caloriesPerMinute: 10,
    description: "High-impact cardiovascular exercise for endurance and calorie burning.",
    instructions: [
      "Start with proper warm-up and stretching",
      "Maintain good posture with slight forward lean",
      "Land midfoot and push off with toes",
      "Keep arms at 90 degrees swinging naturally"
    ]
  },
  {
    id: "4",
    name: "Plank",
    category: "Core",
    difficulty: "beginner",
    muscleGroups: ["Core", "Shoulders", "Back"],
    equipment: ["Bodyweight"],
    caloriesPerMinute: 5,
    description: "Isometric core exercise that builds stability and endurance.",
    instructions: [
      "Start in forearm plank position",
      "Keep body in straight line from head to heels",
      "Engage core and avoid sagging hips",
      "Hold position while breathing steadily"
    ]
  },
  {
    id: "5",
    name: "Deadlift",
    category: "Strength",
    difficulty: "advanced",
    muscleGroups: ["Back", "Glutes", "Hamstrings", "Core"],
    equipment: ["Barbell", "Dumbbells"],
    caloriesPerMinute: 9,
    description: "Compound exercise targeting posterior chain and overall strength.",
    instructions: [
      "Stand with feet hip-width apart, bar over midfoot",
      "Grip bar with hands just outside legs",
      "Hinge at hips, keep back straight",
      "Drive through heels to lift, extending hips and knees"
    ]
  },
  {
    id: "6",
    name: "Burpees",
    category: "Cardio",
    difficulty: "intermediate",
    muscleGroups: ["Full Body", "Cardiovascular"],
    equipment: ["Bodyweight"],
    caloriesPerMinute: 12,
    description: "Full-body conditioning exercise combining strength and cardio.",
    instructions: [
      "Start standing, then drop into squat position",
      "Place hands on ground and jump feet back to plank",
      "Perform a push-up",
      "Jump feet back to squat and explode upward"
    ]
  },
  {
    id: "7",
    name: "Pull-ups",
    category: "Strength",
    difficulty: "intermediate",
    muscleGroups: ["Back", "Biceps", "Shoulders"],
    equipment: ["Pull-up Bar"],
    caloriesPerMinute: 8,
    description: "Upper body pulling exercise for back and arm development.",
    instructions: [
      "Hang from bar with palms facing away",
      "Pull body up until chin is over bar",
      "Lower with control to full extension",
      "Avoid swinging or kipping"
    ]
  },
  {
    id: "8",
    name: "Yoga Flow",
    category: "Flexibility",
    difficulty: "beginner",
    muscleGroups: ["Full Body", "Core"],
    equipment: ["Yoga Mat"],
    caloriesPerMinute: 4,
    description: "Mind-body practice combining stretching, balance, and breathing.",
    instructions: [
      "Flow through poses with controlled breathing",
      "Focus on form and alignment",
      "Hold poses for 5-10 breaths",
      "Modify as needed for your flexibility level"
    ]
  }
];

export function ExerciseLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const categories = ["all", "Strength", "Cardio", "Core", "Flexibility"];

  const filteredExercises = exerciseLibrary.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscleGroups.some(mg => mg.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search exercises or muscle groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <Card
            key={exercise.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedExercise(exercise)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {exercise.category === "Strength" ? (
                  <Dumbbell className="w-5 h-5 text-blue-500" />
                ) : exercise.category === "Cardio" ? (
                  <Heart className="w-5 h-5 text-red-500" />
                ) : (
                  <ActivityIcon className="w-5 h-5 text-green-500" />
                )}
                <h3 className="font-medium">{exercise.name}</h3>
              </div>
              <Badge className={getDifficultyColor(exercise.difficulty)}>
                {exercise.difficulty}
              </Badge>
            </div>

            <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {exercise.muscleGroups.map((muscle, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {exercise.equipment.join(", ")}
                </span>
                <span className="text-orange-600 font-medium">
                  ~{exercise.caloriesPerMinute} cal/min
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedExercise(null)}
        >
          <Card 
            className="max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedExercise.name}</h2>
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(selectedExercise.difficulty)}>
                    {selectedExercise.difficulty}
                  </Badge>
                  <Badge variant="outline">{selectedExercise.category}</Badge>
                </div>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-700 mb-4">{selectedExercise.description}</p>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Target Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise.muscleGroups.map((muscle, idx) => (
                    <Badge key={idx} variant="secondary">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Equipment Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise.equipment.map((equip, idx) => (
                    <Badge key={idx} variant="outline">
                      {equip}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {selectedExercise.instructions.map((instruction, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Estimated Calories:</span>{" "}
                  ~{selectedExercise.caloriesPerMinute} kcal per minute
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {filteredExercises.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No exercises found matching your search.</p>
        </Card>
      )}
    </div>
  );
}
