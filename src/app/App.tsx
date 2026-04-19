import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { OnboardingFlow } from './components/OnboardingFlow';
import { Dashboard } from './components/Dashboard';
import { WorkoutSession } from './components/WorkoutSession';
import { NutritionTracker } from './components/NutritionTracker';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { AITrainerChat } from './components/AITrainerChat';
import { WorkoutRoutines } from './components/WorkoutRoutines';
import { Navigation } from './components/Navigation';
import { supabase, authedFetch } from '/utils/supabase/info';
import type { UserProfile } from './types/user';

type View = 'dashboard' | 'workout' | 'nutrition' | 'progress' | 'routines' | 'ai';

function App() {
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  // Subscribe to Supabase auth. The client handles session persistence and
  // refresh tokens; we just mirror it into React state.
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const session = data.session;
      if (session) {
        setUserId(session.user.id);
        setIsLoggedIn(true);
      } else {
        setIsLoadingProfile(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session) {
        setUserId(session.user.id);
        setIsLoggedIn(true);
      } else {
        setUserId(null);
        setIsLoggedIn(false);
        setHasProfile(null);
        setUserProfile(null);
        setIsLoadingProfile(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !userId) return;
    void loadUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, userId]);

  const loadUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await authedFetch('/profile');
      const data = await response.json();
      if (data.success && data.profile) {
        setUserProfile(data.profile as UserProfile);
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setHasProfile(false);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      setAuthError('');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) {
        setAuthError(error.message);
        return;
      }
      if (data.session) {
        setUserId(data.session.user.id);
        setIsLoggedIn(true);
        setHasProfile(false);
      } else {
        // Email confirmation required
        setAuthError('Account created — please check your email to confirm before logging in.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setAuthError('Network error. Please try again.');
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setAuthError('');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
        return;
      }
      if (data.session) {
        setUserId(data.session.user.id);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      setAuthError('Network error. Please try again.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // State cleared via the onAuthStateChange listener.
    setAuthView('login');
    setCurrentView('dashboard');
  };

  const saveProfile = async (profile: UserProfile) => {
    try {
      const profileWithStart: UserProfile = {
        ...profile,
        startWeight: profile.weight,
        startDate: new Date().toISOString(),
      };

      const response = await authedFetch('/profile', {
        method: 'POST',
        body: JSON.stringify(profileWithStart),
      });
      const data = await response.json();
      if (data.success) {
        setUserProfile(profileWithStart);
        setHasProfile(true);
      } else {
        console.error('Failed to save profile');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  if (!isLoggedIn) {
    if (authView === 'signup') {
      return (
        <SignUpPage
          onSignUp={handleSignUp}
          onSwitchToLogin={() => {
            setAuthView('login');
            setAuthError('');
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
          setAuthError('');
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

  if (!userProfile || !userId) {
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
          <Dashboard
            userId={userId}
            userProfile={userProfile}
            onNavigateToWorkout={() => setCurrentView('workout')}
          />
        )}
        {currentView === 'workout' && <WorkoutSession userId={userId} />}
        {currentView === 'nutrition' && (
          <NutritionTracker userId={userId} userProfile={userProfile} />
        )}
        {currentView === 'progress' && (
          <ProgressAnalytics userId={userId} userProfile={userProfile} />
        )}
        {currentView === 'routines' && <WorkoutRoutines userId={userId} />}
        {currentView === 'ai' && <AITrainerChat userId={userId} userProfile={userProfile} />}
      </main>
    </div>
  );
}

export default App;
