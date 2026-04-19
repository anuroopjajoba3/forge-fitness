import { Activity, BarChart3, Dumbbell, Apple, FolderOpen, Bot, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  currentView: 'dashboard' | 'workout' | 'nutrition' | 'progress' | 'routines' | 'ai';
  onViewChange: (
    view: 'dashboard' | 'workout' | 'nutrition' | 'progress' | 'routines' | 'ai',
  ) => void;
  onLogout: () => void;
  userName: string;
}

export function Navigation({ currentView, onViewChange, onLogout, userName }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Activity },
    { id: 'workout' as const, label: 'Workout', icon: Dumbbell },
    { id: 'nutrition' as const, label: 'Nutrition', icon: Apple },
    { id: 'progress' as const, label: 'Progress', icon: BarChart3 },
    { id: 'routines' as const, label: 'Routines', icon: FolderOpen },
    { id: 'ai' as const, label: 'AI Trainer', icon: Bot },
  ];

  return (
    <>
      {/* Top Header - Desktop */}
      <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-sm border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Forge</h1>
                <p className="text-xs text-stone-400">Hi, {userName}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-white'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-sm border-t border-stone-800 safe-area-inset-bottom">
        <div className="grid grid-cols-6 gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all ${
                  isActive ? 'bg-emerald-500 text-white' : 'text-stone-400 active:bg-stone-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
