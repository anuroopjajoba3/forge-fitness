import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { Dashboard } from "./components/Dashboard";
import { WorkoutSession } from "./components/WorkoutSession";
import { NutritionTracker } from "./components/NutritionTracker";
import { ProgressAnalytics } from "./components/ProgressAnalytics";
import { AITrainerChat } from "./components/AITrainerChat";
import { WorkoutRoutines } from "./components/WorkoutRoutines";
import { Navigation } from "./components/Navigation";
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface UserProfile {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  goal: string;
  targetWeight?: number;
  startWeight?: number;
  startDate?: string;
}

function App() {
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'workout' | 'nutrition' | 'progress' | 'routines' | 'ai'>('dashboard');

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-56c079d7`;

  const checkSession = async () => {
    try {
      const storedUserId = localStorage.getItem('forge_user_id');
      if (storedUserId) {
        setUserId(storedUserId);
        setIsLoggedIn(true);
      } else {
        setIsLoadingProfile(false);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setIsLoadingProfile(false);
    }
  };

  const loadUserProfile = async () => {
    if (!userId) {
      setIsLoadingProfile(false);
      return;
    }

    try {
      setIsLoadingProfile(true);
      const response = await fetch(`${API_BASE}/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      
      if (data.success && data.profile) {
        setUserProfile(data.profile);
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setHasProfile(false);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn && userId) {
      loadUserProfile();
    }
  }, [isLoggedIn, userId]);

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      setAuthError("");
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      
      if (data.success) {
        setUserId(data.userId);
        localStorage.setItem('forge_user_id', data.userId);
        setIsLoggedIn(true);
        setHasProfile(false);
      } else {
        setAuthError(data.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setAuthError('Network error. Please try again.');
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setAuthError("");
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        setUserId(data.userId);
        localStorage.setItem('forge_user_id', data.userId);
        setIsLoggedIn(true);
      } else {
        setAuthError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fittrack_user_id');
    setIsLoggedIn(false);
    setUserId(null);
    setHasProfile(null);
    setUserProfile(null);
    setAuthView('login');
    setCurrentView('dashboard');
  };

  const saveProfile = async (profile: UserProfile) => {
    try {
      const profileWithStart = {
        ...profile,
        startWeight: profile.weight,
        startDate: new Date().toISOString(),
        userId,
      };
      
      const response = await fetch(`${API_BASE}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(profileWithStart),
      });
      
      const data = await response.json();
      if (data.success) {
        setUserProfile(profileWithStart);
        setHasProfile(true);
      } else {
        console.error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (!isLoggedIn) {
    if (authView === 'signup') {
      return (
        <SignUpPage
          onSignUp={handleSignUp}
          onSwitchToLogin={() => {
            setAuthView('login');
            setAuthError("");
          }}
          error={authError}
        />
      );
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToSignUp={() => {
          setAuthView('signup');
          setAuthError("");
        }}
        error={authError}
      />
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-stone-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (hasProfile === false) {
    return <OnboardingFlow onComplete={saveProfile} />;
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="text-center">
          <Activity className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <p className="text-stone-400">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-stone-950">
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        userName={userProfile.name || 'User'}
      />

      <main className="w-full pb-28 md:pb-8">
        {currentView === 'dashboard' && (
          <Dashboard userId={userId!} userProfile={userProfile} onNavigateToWorkout={() => setCurrentView('workout')} />
        )}
        {currentView === 'workout' && (
          <WorkoutSession userId={userId!} />
        )}
        {currentView === 'nutrition' && (
          <NutritionTracker userId={userId!} userProfile={userProfile} />
        )}
        {currentView === 'progress' && (
          <ProgressAnalytics userId={userId!} userProfile={userProfile} />
        )}
        {currentView === 'routines' && (
          <WorkoutRoutines userId={userId!} />
        )}
        {currentView === 'ai' && (
          <AITrainerChat userId={userId!} userProfile={userProfile} />
        )}
      </main>
    </div>
  );
}

export default App;