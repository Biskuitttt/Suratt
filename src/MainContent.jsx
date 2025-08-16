import React, { useState, useEffect } from 'react';

// Polaroid Component
const Polaroid = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [specialCode, setSpecialCode] = useState('');

  useEffect(() => {
    // Delay polaroid entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000); // Muncul 2 detik setelah main content load

    return () => clearTimeout(timer);
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (specialCode.toLowerCase() === 'secret' || specialCode === '12345') {
      alert('Code correct! Welcome to the secret area! 🎉');
      // Di sini bisa redirect atau unlock fitur tertentu
    } else {
      alert('Wrong code! Try again 🤔');
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
              backgroundImage: 'url("/api/placeholder/170/150")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ddd',
            }}
          >
            {/* Placeholder jika tidak ada gambar */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
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
          onClick={(e) => e.stopPropagation()} // Prevent flip when clicking form
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
              onChange={(e) => setSpecialCode(e.target.value)}
              placeholder="Type here..."
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #ddd',
                borderRadius: '4px',
                textAlign: 'center',
                fontSize: '14px',
                marginBottom: '10px',
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#555'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#333'}
            >
              Submit ✨
            </button>
          </form>
          
          <div style={{ 
            fontSize: '10px', 
            color: '#999', 
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            Hint: Try "secret" or "12345"
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
        
        @keyframes polaroidBounce {
          0% {
            transform: translateY(100px) translateX(-50px) rotate(-15deg);
            opacity: 0;
          }
          70% {
            transform: translateY(-10px) translateX(5px) rotate(-5deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) translateX(0) rotate(-8deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const FilmRoll = () => {
  const photos = Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    placeholder: `Photo ${index + 1}`,
    imageUrl: index === 0 ? "image1.png" : null
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

function MainContent() {
  return (
    <div className="relative">
      <div className="film-roll-background fixed inset-0 pointer-events-none z-0">
        <FilmRoll />
      </div>
    
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-stone-800 mb-4">Creative Studio</h1>
            <p className="text-xl text-stone-600">Where stories come to life</p>
          </div>
        </div>
      </div>

      {/* Polaroid Component */}
      <Polaroid />
    </div>
  );
}

export default MainContent;