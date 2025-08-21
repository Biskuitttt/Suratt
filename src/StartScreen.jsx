import React, { useState, useEffect } from 'react';

const StartScreen = ({ onStart }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Animasi masuk
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Tampilkan button setelah text muncul
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleStart = () => {
    // Trigger start dengan audio info
    onStart();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        overflow: 'hidden'
      }}
    >
      {/* Background particles */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255,255,255,0.02) 0%, transparent 50%)
          `,
          animation: 'float 20s ease-in-out infinite'
        }}
      />

      {/* Main content */}
      <div 
        style={{
          textAlign: 'center',
          zIndex: 2,
          maxWidth: '90vw'
        }}
      >
        {/* Main title */}
        <h1 
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            fontWeight: '100',
            color: '#ffffff',
            marginBottom: '1rem',
            letterSpacing: '0.05em',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            textShadow: '0 0 30px rgba(255,255,255,0.1)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          Peter's World
        </h1>

        {/* Subtitle */}
        <p 
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            color: '#888888',
            marginBottom: '3rem',
            fontWeight: '300',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s',
            letterSpacing: '0.02em'
          }}
        >
          Where stories come to life
        </p>

        {/* Start button */}
        <div
          style={{
            opacity: showButton ? 1 : 0,
            transform: showButton ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s'
          }}
        >
          <button
            onClick={handleStart}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '50px',
              padding: '18px 40px',
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
            }}
            onMouseDown={(e) => {
              e.target.style.transform = 'translateY(0) scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
            }}
          >
            {/* Button ripple effect */}
            <span 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                borderRadius: '50px',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }}
            />
            
            {/* Button content */}
            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Start Experience
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{ marginLeft: '4px' }}
              >
                <polygon points="5,3 19,12 5,21 5,3" />
              </svg>
            </span>
          </button>
        </div>

        {/* Decorative elements */}
        <div 
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            opacity: showButton ? 0.6 : 0,
            transition: 'opacity 1s ease 1s'
          }}
        >
          <div 
            style={{
              width: '2px',
              height: '30px',
              background: 'linear-gradient(to bottom, #667eea, transparent)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
          <div 
            style={{
              fontSize: '0.75rem',
              color: '#666',
              transform: 'rotate(90deg)',
              transformOrigin: 'left center',
              whiteSpace: 'nowrap',
              marginLeft: '20px',
              letterSpacing: '2px',
              fontWeight: '300'
            }}
          >
            SCROLL TO EXPLORE
          </div>
        </div>
      </div>

      {/* Floating geometric shapes */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '100px',
          height: '100px',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50%',
          opacity: isLoaded ? 0.3 : 0,
          transition: 'opacity 2s ease 1s',
          animation: 'float 15s ease-in-out infinite'
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '15%',
          width: '60px',
          height: '60px',
          border: '1px solid rgba(255,255,255,0.1)',
          transform: 'rotate(45deg)',
          opacity: isLoaded ? 0.2 : 0,
          transition: 'opacity 2s ease 1.5s',
          animation: 'float 12s ease-in-out infinite reverse'
        }}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.6; 
            transform: scaleY(1);
          }
          50% { 
            opacity: 1; 
            transform: scaleY(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default StartScreen;