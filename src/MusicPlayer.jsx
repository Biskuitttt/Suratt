import React, { useState, useEffect } from 'react';

const MusicPlayer = ({ isPlaying, onToggle }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      // Delay tampil setelah intro dimulai
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isPlaying]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
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
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: isExpanded ? '16px' : '25px',
          padding: isExpanded ? '16px' : '12px 16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          opacity: isVisible ? 1 : 0,
          minWidth: isExpanded ? '280px' : 'auto',
          maxWidth: isExpanded ? '320px' : 'auto'
        }}
        onClick={toggleExpanded}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px) scale(1.02)';
          e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Album Cover / Visualizer */}
          <div
            style={{
              width: isExpanded ? '60px' : '40px',
              height: isExpanded ? '60px' : '40px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Music visualizer bars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '50%' }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '3px',
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '1px',
                    animation: `musicBar 1.${i}s ease-in-out infinite alternate`,
                    animationDelay: `0.${i * 2}s`
                  }}
                />
              ))}
            </div>

            {/* Pulsing background effect */}
            <div
              style={{
                position: 'absolute',
                inset: '-10px',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          </div>

          {/* Song Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: isExpanded ? '4px' : '0'
              }}
            >
              {/* Playing indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#22c55e',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Playing
                </span>
              </div>
            </div>

            <div
              style={{
                color: '#ffffff',
                fontSize: isExpanded ? '0.95rem' : '0.85rem',
                fontWeight: '600',
                lineHeight: 1.3,
                marginBottom: isExpanded ? '2px' : '0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: isExpanded ? 'normal' : 'nowrap'
              }}
            >
              Kita Ke sana
            </div>

            <div
              style={{
                color: '#888888',
                fontSize: isExpanded ? '0.8rem' : '0.75rem',
                fontWeight: '400',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              Hindia
            </div>

            {/* Progress bar (only when expanded) */}
            {isExpanded && (
              <div style={{ marginTop: '12px' }}>
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
                      width: '35%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '2px',
                      animation: 'progress 3s ease-in-out infinite'
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '4px',
                    fontSize: '0.7rem',
                    color: '#666'
                  }}
                >
                  <span>1:23</span>
                  <span>3:45</span>
                </div>
              </div>
            )}
          </div>

          {/* Controls (only when expanded) */}
          {isExpanded && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle && onToggle();
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Expand/Collapse indicator */}
          {!isExpanded && (
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.7rem',
                transform: 'rotate(90deg)'
              }}
            >
              ⋯
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes musicBar {
          0% { transform: scaleY(0.3); opacity: 0.7; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes progress {
          0% { transform: translateX(-10px); }
          50% { transform: translateX(5px); }
          100% { transform: translateX(-10px); }
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;