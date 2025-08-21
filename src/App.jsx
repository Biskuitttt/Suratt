import React, { useState, useEffect } from "react";
import "./App.css";

// Import components
import StartScreen from "./StartScreen";
import Intro from "./Intro";
import MainContent from "./MainContent";
import MusicPlayer from "./MusicPlayer";
import Auth from "./components/Auth";

// Firebase
import { auth } from "./firebase/config";
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { FirebaseService } from "./services/firebase";

function App() {
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start', 'intro', 'main'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [user, setUser] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Listen perubahan auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
    });
    
    // Make FirebaseService available globally for testing
    if (typeof window !== 'undefined') {
      window.FirebaseService = FirebaseService;
      console.log('FirebaseService available globally for testing');
    }
    
    return () => unsubscribe();
  }, []);

  // Check for email link authentication
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
          console.log('Successfully signed in with email link');
        })
        .catch((error) => {
          console.error('Error signing in with email link:', error);
        });
    }
  }, []);

  const handleStart = () => {
    setIsTransitioning(true);
    setIsMusicPlaying(true); // Start music when user clicks start
    
    setTimeout(() => {
      setCurrentScreen('intro');
      setIsTransitioning(false);
    }, 800);
  };

  const handleIntroComplete = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentScreen('main');
      setIsTransitioning(false);
    }, 800);
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen onStart={handleStart} />;
      case 'intro':
        return <Intro onComplete={handleIntroComplete} />;
      case 'main':
        return <MainContent user={user} />;
      default:
        return <StartScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="App">
      <div
        style={{
          transition: "opacity 0.8s ease-in-out",
          opacity: isTransitioning ? 0 : 1,
        }}
      >
        {renderCurrentScreen()}
      </div>

      {/* Music Player - only show after start screen */}
      {currentScreen !== 'start' && (
        <MusicPlayer 
          isPlaying={isMusicPlaying} 
          onToggle={toggleMusic}
        />
      )}
    </div>
  );
}

export default App;