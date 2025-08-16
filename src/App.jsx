import React, { useState, useEffect } from "react";
import "./App.css";

// Import components
import Intro from "./Intro";
import MainContent from "./MainContent";
import Auth from "./components/Auth";

// Firebase
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

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
        ) : user ? (
          <MainContent />
        ) : (
          <Auth />
        )}
      </div>
    </div>
  );
}

export default App;
