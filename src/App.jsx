import React, { useState } from 'react';
import './App.css';

// Import components
import Intro from './Intro';
import MainContent from './MainContent';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleIntroComplete = () => {
    // Mulai transisi
    setIsTransitioning(true);
    
    // Setelah fade out selesai, ganti ke main content
    setTimeout(() => {
      setShowIntro(false);
      setIsTransitioning(false);
    }, 800); // 800ms untuk fade out
  };

  return (
    <div className="App">
      <div 
        style={{
          transition: 'opacity 0.8s ease-in-out',
          opacity: isTransitioning ? 0 : 1,
        }}
      >
        {showIntro ? (
          <Intro onComplete={handleIntroComplete} />
        ) : (
          <MainContent />
        )}
      </div>
    </div>
  );
}

export default App;