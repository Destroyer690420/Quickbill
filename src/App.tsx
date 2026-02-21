import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Philosophy } from './components/Philosophy';
import { Protocol } from './components/Protocol';
import { Footer } from './components/Footer';
import { Onboarding } from './components/Onboarding';
import { AuthProvider } from './context/AuthContext';
import { CommandCenter } from './components/CommandCenter';
import { Login } from './components/Login';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

type ViewState = 'landing' | 'login' | 'signup' | 'dashboard';

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    // If user is already authenticated, check if they finished onboarding
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid, 'profile', 'companyDetails');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentView('dashboard');
          } else {
            setCurrentView('signup');
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setCurrentView('dashboard'); // fallback
        }
      } else {
        setCurrentView('landing');
      }
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#111116] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-green-volt)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <AuthProvider>
        <CommandCenter />
      </AuthProvider>
    );
  }

  if (currentView === 'login') {
    return <Login onBack={() => setCurrentView('landing')} onComplete={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'signup') {
    return <Onboarding onComplete={() => setCurrentView('dashboard')} onBack={() => setCurrentView('landing')} />;
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--color-indigo-midnight)] overflow-x-hidden selection:bg-[var(--color-green-volt)] selection:text-[var(--color-indigo-midnight)]">
      <Navbar onLogin={() => setCurrentView('login')} onSignup={() => setCurrentView('signup')} />
      <Hero onLogin={() => setCurrentView('login')} onSignup={() => setCurrentView('signup')} />
      <Features />
      <Philosophy />
      <Protocol />
      <Footer />
    </div>
  )
}

export default App
