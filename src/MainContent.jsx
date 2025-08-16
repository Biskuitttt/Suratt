// src/MainContent.jsx - Updated version
import React, { useState, useEffect } from 'react';
import { FirebaseService } from './services/firebase';
import SpecialPage from './components/SpecialPage';

// Falling Polaroids Component (unchanged)
const FallingPolaroids = () => {
  const [polaroids, setPolaroids] = useState([]);
  const [activeColumns, setActiveColumns] = useState(new Set());
  
  const images = ["/image1.png", "/image2.png", "/image3.png", "/image4.png", "/image5.png", "/image6.png", "/image7.png", "/image8.png", "/image9.png", "/image10.png", "/image11.png",
    "/image12.png", "/image13.png", "/image14.png", "/image15.png"];

  useEffect(() => {
    const generatePolaroid = () => {
      const columns = 6;
      let availableColumns = [];
      
      for (let i = 0; i < columns; i++) {
        if (!activeColumns.has(i)) {
          availableColumns.push(i);
        }
      }

      if (availableColumns.length === 0) return;

      const column = availableColumns[Math.floor(Math.random() * availableColumns.length)];
      setActiveColumns(prev => new Set([...prev, column]));

      const newPolaroid = {
        id: Date.now(),
        left: (column * (100 / columns)) + (Math.random() * 5),
        rotate: -10 + Math.random() * 20,
        scale: 0.5 + Math.random() * 0.2,
        duration: 8 + Math.random() * 4,
        column,
        image: images[Math.floor(Math.random() * images.length)]
      };
      
      setPolaroids(prev => [...prev, newPolaroid]);

      setTimeout(() => {
        setPolaroids(prev => prev.filter(p => p.id !== newPolaroid.id));
        setActiveColumns(prev => {
          const next = new Set(prev);
          next.delete(newPolaroid.column);
          return next;
        });
      }, newPolaroid.duration * 1000);
    };

    const interval = setInterval(generatePolaroid, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-1">
      {polaroids.map(polaroid => (
        <div
          key={polaroid.id}
          style={{
            position: 'absolute',
            left: `${polaroid.left}%`,
            top: '-100px',
            animation: `falling-${polaroid.id} ${polaroid.duration}s linear forwards`
          }}
        >
          <div 
            className="w-32 h-40 bg-white/30 backdrop-blur-sm p-2 shadow-xl rounded overflow-hidden"
            style={{
              transform: `rotate(${polaroid.rotate}deg) scale(${polaroid.scale})`,
            }}
          >
            <div className="w-full h-28 bg-gray-100/50 overflow-hidden">
              <img 
                src={polaroid.image}
                alt="Polaroid"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-2 h-8 bg-white/50"></div>
          </div>

          <style jsx>{`
            @keyframes falling-${polaroid.id} {
              0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
              }
              5% {
                opacity: 1;
              }
              90% {
                opacity: 1;
                transform: translateY(${window.innerHeight * 0.8}px) rotate(${polaroid.rotate * 1.5}deg);
              }
              100% {
                transform: translateY(${window.innerHeight + 200}px) rotate(${polaroid.rotate * 2}deg);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
};

// Updated Polaroid Component with Firebase integration
const Polaroid = ({ onSpecialCodeSuccess }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [specialCode, setSpecialCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!specialCode.trim()) {
      setError('Please enter a code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const isValid = await FirebaseService.validateSpecialCode(specialCode);
      
      if (isValid) {
        // Success! Show special page
        onSpecialCodeSuccess(specialCode.toLowerCase());
      } else {
        setError('Invalid code! Try again 🤔');
      }
    } catch (err) {
      setError('Error validating code. Please try again.');
      console.error('Code validation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`polaroid-container ${isVisible ? 'polaroid-enter' : ''}`}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 20,
        perspective: '1000px',
      }}
    >
      <div 
        className={`polaroid ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
        style={{
          width: '200px',
          height: '250px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s ease-in-out',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Side - Photo */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div 
            style={{
              width: '100%',
              height: '150px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid #ddd',
            }}
          >
            <img 
              src="/image2.png"
              alt="Special Photo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          <div style={{ 
            textAlign: 'center', 
            fontFamily: 'cursive', 
            fontSize: '14px', 
            color: '#333',
            marginTop: '10px'
          }}>
            Click me! 📸
          </div>
        </div>

        {/* Back Side - Code Input */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ 
            margin: 0, 
            fontSize: '16px', 
            color: '#333',
            textAlign: 'center',
            fontFamily: 'cursive'
          }}>
            🔐 Enter Your<br/>Special Code
          </h3>
          
          <form onSubmit={handleCodeSubmit} style={{ width: '100%' }}>
            <input
              type="text"
              value={specialCode}
              onChange={(e) => {
                setSpecialCode(e.target.value);
                setError(''); // Clear error when typing
              }}
              placeholder="Type here..."
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px',
                border: error ? '2px solid #ef4444' : '2px solid #ddd',
                borderRadius: '4px',
                textAlign: 'center',
                fontSize: '14px',
                marginBottom: '10px',
                opacity: isLoading ? 0.6 : 1,
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: isLoading ? '#999' : '#333',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => {
                if (!isLoading) e.target.style.backgroundColor = '#555';
              }}
              onMouseOut={(e) => {
                if (!isLoading) e.target.style.backgroundColor = '#333';
              }}
            >
              {isLoading ? 'Checking...' : 'Submit ✨'}
            </button>
          </form>
          
          {error && (
            <div style={{ 
              fontSize: '10px', 
              color: '#ef4444', 
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ 
            fontSize: '10px', 
            color: '#999', 
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            Try: "adventure", "mystery", or "treasure"
          </div>
        </div>
      </div>

      <style jsx>{`
        .polaroid-container {
          transform: translateY(100px) translateX(-50px) rotate(-15deg);
          opacity: 0;
          transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .polaroid-container.polaroid-enter {
          transform: translateY(0) translateX(0) rotate(-8deg);
          opacity: 1;
        }
        
        .polaroid:hover {
          transform: ${isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'} scale(1.05) rotate(-5deg);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
};

// FilmRoll Component (unchanged)
const FilmRoll = () => {
  const images = ["/image1.png", "/image2.png", "/image3.png", "/image4.png", "/image5.png", "/image6.png", "/image7.png", "/image8.png", "/image9.png", "/image10.png", "/image11.png",
    "/image12.png", "/image13.png", "/image14.png", "/image15.png"];
  const photos = Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    placeholder: `Photo ${index + 1}`,
    imageUrl: index < images.length ? images[index] : null
  }));

  return (
    <div className="film-strip-container">
      <div className="film-strip bg-stone-800 shadow-2xl">
        <div className="film-perforations top bg-stone-900">
          {Array.from({ length: 50 }, (_, i) => (
            <div key={`top-${i}`} className="perforation bg-black"></div>
          ))}
        </div>

        <div className="photo-frames bg-stone-700">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-frame bg-amber-50 border-stone-900 shadow-lg">
              {photo.imageUrl ? (
                <img 
                  src={photo.imageUrl} 
                  alt={photo.placeholder}
                  className="w-full h-full object-cover rounded-sm"
                />
              ) : (
                <div className="photo-placeholder">
                  <div className="placeholder-content bg-stone-100/90 text-stone-600">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    <span className="font-medium">{photo.placeholder}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {photos.map((photo) => (
            <div key={`dup-${photo.id}`} className="photo-frame bg-amber-50 border-stone-900 shadow-lg">
              {photo.imageUrl ? (
                <img 
                  src={photo.imageUrl} 
                  alt={photo.placeholder}
                  className="w-full h-full object-cover rounded-sm"
                />
              ) : (
                <div className="photo-placeholder">
                  <div className="placeholder-content">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    <span className="font-medium">{photo.placeholder}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="film-perforations bottom bg-stone-900">
          {Array.from({ length: 50 }, (_, i) => (
            <div key={`bottom-${i}`} className="perforation bg-black"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Component with Special Page integration
function MainContent() {
  const [showSpecialPage, setShowSpecialPage] = useState(false);
  const [currentSpecialCode, setCurrentSpecialCode] = useState('');

  const handleSpecialCodeSuccess = (code) => {
    setCurrentSpecialCode(code);
    setShowSpecialPage(true);
  };

  const handleBackFromSpecialPage = () => {
    setShowSpecialPage(false);
    setCurrentSpecialCode('');
  };

  // Show special page if active
  if (showSpecialPage) {
    return (
      <SpecialPage 
        specialCode={currentSpecialCode}
        onBack={handleBackFromSpecialPage}
      />
    );
  }

  return (
    <div className="relative">
      {/* Dark background overlay */}
      <div className="fixed inset-0 bg-slate-900 z-0"></div>
      
      {/* Falling Polaroids in background */}
      <FallingPolaroids />
      
      {/* Background layer behind film roll */}
      <div className="film-roll-backdrop fixed inset-0 pointer-events-none z-4">
        <div className="w-full h-full bg-gradient-to-b from-amber-100/5 to-stone-800/10"></div>
      </div>

      {/* Film roll layer */}
      <div className="film-roll-background fixed inset-0 pointer-events-none z-5">
        <FilmRoll />
      </div>
    
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-stone-100 mb-4 hero-title">Creative Studio</h1>
            <p className="text-xl text-stone-300 hero-subtitle">Where stories come to life</p>
          </div>
        </div>
      </div>

      {/* Polaroid Component */}
      <Polaroid onSpecialCodeSuccess={handleSpecialCodeSuccess} />
    </div>
  );
}

export default MainContent;