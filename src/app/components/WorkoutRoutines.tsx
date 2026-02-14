import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { FolderOpen, Plus, Trash2, Play } from "lucide-react";
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface WorkoutRoutinesProps {
  userId: string;
}

interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: any[];
  createdAt: string;
}

export function WorkoutRoutines({ userId }: WorkoutRoutinesProps) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ name: '', description: '' });

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-56c079d7`;

  useEffect(() => {
    loadRoutines();
  }, [userId]);

  const loadRoutines = async () => {
    try {
      const response = await fetch(`${API_BASE}/routines/${userId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success && data.routines) {
        setRoutines(data.routines);
      }
    } catch (error) {
      console.error('Error loading routines:', error);
    }
  };

  const createRoutine = async () => {
    if (!newRoutine.name) {
      alert('Please enter a routine name');
      return;
    }

    const routine = {
      ...newRoutine,
      id: Date.now().toString(),
      userId,
      exercises: [],
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE}/routines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(routine),
      });

      const data = await response.json();
      if (data.success) {
        setRoutines([...routines, routine]);
        setIsCreateOpen(false);
        setNewRoutine({ name: '', description: '' });
      }
    } catch (error) {
      console.error('Error creating routine:', error);
    }
  };

  const deleteRoutine = async (routineId: string) => {
    if (!confirm('Delete this routine?')) return;

    try {
      const response = await fetch(`${API_BASE}/routines/${routineId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });

      const data = await response.json();
      if (data.success) {
        setRoutines(routines.filter(r => r.id !== routineId));
      }
    } catch (error) {
      console.error('Error deleting routine:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Routines</h1>
          <p className="text-stone-400">Organize your workouts into folders</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          New Routine
        </Button>
      </div>

      {routines.length === 0 ? (
        <Card className="bg-stone-900 border-stone-800 p-12 text-center">
          <FolderOpen className="w-16 h-16 text-stone-600 mx-auto mb-4" />
          <p className="text-stone-400 mb-4">No routines yet</p>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-emerald-500 hover:bg-emerald-600">
            Create Your First Routine
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {routines.map((routine) => (
            <Card key={routine.id} className="bg-stone-900 border-stone-800 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{routine.name}</h3>
                  {routine.description && (
                    <p className="text-sm text-stone-400">{routine.description}</p>
                  )}
                  <p className="text-xs text-stone-500 mt-2">
                    {routine.exercises?.length || 0} exercises
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteRoutine(routine.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600">
                <Play className="w-4 h-4 mr-2" />
                Start Workout
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Create Routine Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-stone-900 border-stone-800">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Routine</DialogTitle>
            <DialogDescription className="text-stone-400">Create a new workout routine</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Routine Name (e.g., Push Day, Leg Day)"
                value={newRoutine.name}
                onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                className="bg-stone-800 border-stone-700 text-white"
              />
            </div>
            <div>
              <Input
                placeholder="Description (optional)"
                value={newRoutine.description}
                onChange={(e) => setNewRoutine({ ...newRoutine, description: e.target.value })}
                className="bg-stone-800 border-stone-700 text-white"
              />
            </div>
            <Button onClick={createRoutine} className="w-full bg-emerald-500 hover:bg-emerald-600">
              Create Routine
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}