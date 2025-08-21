import React, { useState, useEffect, useRef, useMemo } from 'react';

// BlurText Component - Fixed for mobile
const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Delay untuk memastikan component ter-render dengan baik
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
      // Auto-trigger animation setelah component visible
      const animationTimer = setTimeout(() => {
        setInView(true);
      }, 100);
      
      return () => clearTimeout(animationTimer);
    }, 50);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isVisible) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold, rootMargin, isVisible]);

  // Early return jika belum visible
  if (!isVisible) {
    return (
      <div ref={ref} className={`blur-text ${className}`} style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        opacity: 0 
      }}>
        {text}
      </div>
    );
  }

  return (
    <p ref={ref} className={`blur-text ${className}`} style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      justifyContent: 'center',
      gap: '0.25rem' // Tambah gap untuk mobile
    }}>
      {elements.map((segment, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            transition: 'all 1s ease-out', // Perlambat transisi untuk mobile
            willChange: 'transform, filter, opacity',
            filter: inView ? 'blur(0px)' : 'blur(8px)', // Kurangi blur intensity
            opacity: inView ? 1 : 0,
            transform: inView 
              ? 'translateY(0px) scale(1)' 
              : `translateY(${direction === 'top' ? '-30px' : '30px'}) scale(0.9)`, // Kurangi translateY
            transitionDelay: `${index * delay}ms`,
            // Tambahan untuk stabilitas mobile
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
          }}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </span>
      ))}
    </p>
  );
};

// Main Intro Component - Enhanced for mobile
function Intro({ onComplete }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [textKey, setTextKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Array text yang akan ditampilkan satu per satu
  const introTexts = [
    "Welcome to our world",
    "Where creativity meets innovation", 
    "Every moment tells a story",
    "Let's create something amazing together"
  ];

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (currentTextIndex < introTexts.length) {
      // Durasi berbeda untuk mobile dan desktop
      const duration = isMobile ? 4000 : 3000; // Lebih lama di mobile
      
      const timer = setTimeout(() => {
        setCurrentTextIndex(prev => prev + 1);
        setTextKey(prev => prev + 1);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Setelah semua text selesai, tunggu lalu panggil onComplete
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 1500); // Lebih lama untuk mobile

      return () => clearTimeout(finalTimer);
    }
  }, [currentTextIndex, introTexts.length, onComplete, isMobile]);

  const handleAnimationComplete = () => {
    console.log(`Text ${currentTextIndex + 1} animation completed!`);
  };

  // Responsive text sizes
  const getResponsiveClassName = () => {
    if (isMobile) {
      return "text-2xl sm:text-3xl md:text-4xl font-light text-white text-center leading-relaxed";
    }
    return "text-4xl md:text-6xl font-light text-white text-center leading-relaxed";
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        // Prevent zoom/pinch on mobile
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
      <div 
        style={{
          textAlign: 'center',
          width: '100%',
          maxWidth: isMobile ? '90vw' : '1024px', // Lebih sempit di mobile
          padding: isMobile ? '0 1rem' : '0 2rem',
          // Prevent text selection on mobile
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      >
        {currentTextIndex < introTexts.length && (
          <BlurText
            key={textKey}
            text={introTexts[currentTextIndex]}
            delay={isMobile ? 200 : 150} // Delay lebih lambat di mobile
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className={getResponsiveClassName()}
            stepDuration={isMobile ? 0.5 : 0.35} // Durasi lebih lambat di mobile
          />
        )}
        
        {/* Loading indicator untuk mobile */}
        {isMobile && (
          <div 
            style={{
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              opacity: 0.6
            }}
          >
            {introTexts.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: index <= currentTextIndex ? '#ffffff' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Intro;