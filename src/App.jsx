import React, { useState, useEffect } from "react";
import "./App.css";

// Import components
import Intro from "./Intro";
import MainContent from "./MainContent";
import Auth from "./components/Auth";

// Firebase
import { auth } from "./firebase/config";
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [user, setUser] = useState(null);

  // Listen perubahan auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
    });
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

  const handleIntroComplete = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      setShowIntro(false);
      setIsTransitioning(false);
    }, 800);
  };

  return (
    <div className="App">
      <div
        style={{
          transition: "opacity 0.8s ease-in-out",
          opacity: isTransitioning ? 0 : 1,
        }}
      >
        {showIntro ? (
          <Intro onComplete={handleIntroComplete} />
        ) : (
          <MainContent user={user} />
        )}
      </div>
    </div>
  );
}

export default App;
