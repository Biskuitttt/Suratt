import React, { useState, useEffect } from 'react';

const MusicPlayer = ({ isPlaying, onToggle, audioRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show music player after intro starts, regardless of playing state
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []); // Remove isPlaying dependency

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleLoad = () => setIsLoading(false);
    const handleError = () => {
      console.error('Audio loading error');
      setIsLoading(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadeddata', handleLoad);
    audio.addEventListener('error', handleError);

    // Initial check if metadata is already loaded
    if (audio.duration) {
      setDuration(audio.duration);
      setIsLoading(false);
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', handleLoad);
      audio.removeEventListener('error', handleError);
    };
  }, [audioRef]);

  // Format time helper
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    onToggle && onToggle();
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div
        style={{
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          opacity: isVisible ? 1 : 0,
        }}
        onClick={toggleExpanded}
      >
        {/* Vinyl Record Player */}
        <div className="relative">
          {/* Record player base */}
          <div 
            style={{
              background: '#92400e', // amber-800
              padding: isExpanded ? '20px' : '16px',
              borderRadius: '8px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              border: '1px solid #78350f', // amber-900
              transition: 'all 0.3s ease'
            }}
          >
            <div 
              style={{
                position: 'relative',
                width: isExpanded ? '120px' : '80px',
                height: isExpanded ? '120px' : '80px',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Vinyl Record */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                  overflow: 'hidden',
                  animation: isPlaying ? 'spin 3s linear infinite' : 'none'
                }}
              >
                <img 
                  src="/vinyl.png" 
                  alt="Vinyl Record" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
                
                {/* Center label overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <div 
                    style={{
                      width: isExpanded ? '32px' : '24px',
                      height: isExpanded ? '32px' : '24px',
                      background: '#dc2626', // red-600
                      borderRadius: '50%',
                      border: '2px solid #991b1b', // red-800
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div 
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#000000',
                        borderRadius: '50%',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}
                    />
                  </div>
                </div>
                
                {/* Subtle vinyl grooves overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '50%'
                  }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    inset: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: '50%'
                  }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    inset: '16px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: '50%'
                  }}
                />
                
                {/* Vinyl shine effect */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, transparent 100%)',
                    opacity: 0.3
                  }}
                />
              </div>
              
              {/* Tonearm */}
              <div 
                style={{
                  position: 'absolute',
                  top: isExpanded ? '8px' : '8px',
                  right: isExpanded ? '12px' : '12px',
                  width: isExpanded ? '56px' : '40px',
                  height: '4px',
                  background: '#d1d5db', // gray-300
                  borderRadius: '2px',
                  transformOrigin: 'right center',
                  transform: 'rotate(-65deg)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  borderTop: '1px solid #6b7280', // gray-500
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    right: 0,
                    width: '8px',
                    height: '8px',
                    background: '#4b5563', // gray-600
                    borderRadius: '50%',
                    transform: 'translate(4px, -2px)',
                    border: '1px solid #374151' // gray-700
                  }}
                />
                {/* Tonearm counterweight */}
                <div 
                  style={{
                    position: 'absolute',
                    left: 0,
                    width: '6px',
                    height: '6px',
                    background: '#6b7280', // gray-500
                    borderRadius: '50%',
                    transform: 'translate(-4px, -1px)'
                  }}
                />
              </div>
            </div>

            {/* Expanded Controls */}
            {isExpanded && (
              <div style={{ marginTop: '16px' }}>
                {/* Song Info */}
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                  <div 
                    style={{
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}
                  >
                    {isLoading ? 'Loading...' : 'Kita Ke sana'}
                  </div>
                  <div 
                    style={{
                      color: '#d1d5db',
                      fontSize: '0.8rem',
                      fontWeight: '400'
                    }}
                  >
                    Hindia
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '100%',
                      height: '3px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                        height: '100%',
                        background: '#dc2626', // red-600
                        borderRadius: '2px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '4px',
                      fontSize: '0.7rem',
                      color: '#9ca3af' // gray-400
                    }}
                  >
                    <span>{formatTime(currentTime)}</span>
                    <span>{isLoading ? '--:--' : formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={handlePlayPause}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      color: '#ffffff'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    {isPlaying ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Musical notes floating above record player */}
        {isPlaying && (
          <>
            <div 
              style={{
                position: 'absolute',
                top: '-64px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#92400e', // amber-700
                fontSize: isExpanded ? '1.25rem' : '1rem',
                animation: 'bounce 2s infinite'
              }}
            >
              ♪
            </div>
            <div 
              style={{
                position: 'absolute',
                top: '-48px',
                left: '8px',
                color: '#d97706', // amber-600
                fontSize: isExpanded ? '1.125rem' : '0.875rem',
                animation: 'bounce 2.5s infinite 0.5s'
              }}
            >
              ♫
            </div>
            <div 
              style={{
                position: 'absolute',
                top: '-56px',
                left: '-4px',
                color: '#78350f', // amber-800
                fontSize: isExpanded ? '1rem' : '0.75rem',
                animation: 'bounce 3s infinite 1s'
              }}
            >
              ♬
            </div>
            <div 
              style={{
                position: 'absolute',
                top: '-40px',
                left: '16px',
                color: '#f59e0b', // amber-500
                fontSize: isExpanded ? '0.875rem' : '0.625rem',
                animation: 'bounce 2.2s infinite 1.5s'
              }}
            >
              ♩
            </div>
          </>
        )}

        {/* Status indicator */}
        {!isExpanded && (
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '16px',
              height: '16px',
              background: isPlaying ? '#22c55e' : '#ef4444', // green-500 or red-500
              borderRadius: '50%',
              border: '2px solid #ffffff',
              animation: isPlaying ? 'pulse 2s infinite' : 'none'
            }}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 100% { 
            transform: translateY(0px);
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-8px);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;