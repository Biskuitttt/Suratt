import React, { useState } from 'react';
import './App.css';

// Import components
import Intro from './Intro';
import MainContent from './MainContent';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <div className="App">
      {showIntro ? (
        <Intro onComplete={handleIntroComplete} />
      ) : (
        <MainContent />
      )}
    </div>
  );
}

export default App;