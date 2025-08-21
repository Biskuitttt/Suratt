import React, { useState, useEffect, useRef } from "react";
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
  const audioRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/audio/kita-ke-sana.mp3'); // Path ke file audio Anda
    audioRef.current.loop = true; // Loop musik
    audioRef.current.volume = 0.05; // Set volume awal (25% - lebih pelan)
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle musik play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.play().catch((error) => {
          console.log('Audio play failed:', error);
          // Fallback jika autoplay diblokir browser
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]);
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
    
    // Start music dengan user interaction untuk menghindari autoplay restriction
    setIsMusicPlaying(true);
    
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
    setIsMusicPlaying(prevState => {
      const newState = !prevState;
      console.log('Music toggled:', newState ? 'Playing' : 'Paused');
      return newState;
    });
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
          audioRef={audioRef}
        />
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px',
          fontSize: '12px',
          borderRadius: '4px',
          zIndex: 9999
        }}>
          Music: {isMusicPlaying ? 'Playing' : 'Paused'} | Screen: {currentScreen}
        </div>
      )}
    </div>
  );
}

export default App;