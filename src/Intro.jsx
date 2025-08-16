import React, { useState, useEffect, useRef, useMemo } from 'react';
import './Intro.css';
// BlurText Component
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
  const ref = useRef(null);

  useEffect(() => {
    // Auto-trigger animation immediately
    setInView(true);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <p ref={ref} className={`blur-text ${className} flex flex-wrap justify-center`}>
      {elements.map((segment, index) => (
        <span
          key={index}
          className="inline-block transition-all duration-700 ease-out will-change-transform"
          style={{
            filter: inView ? 'blur(0px)' : 'blur(10px)',
            opacity: inView ? 1 : 0,
            transform: inView 
              ? 'translateY(0px)' 
              : `translateY(${direction === 'top' ? '-50px' : '50px'})`,
            transitionDelay: `${index * delay}ms`,
          }}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </span>
      ))}
    </p>
  );
};

// Main Intro Component
function Intro({ onComplete }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [textKey, setTextKey] = useState(0);

  // Array text yang akan ditampilkan satu per satu
  const introTexts = [
    "Welcome to our world",
    "Where creativity meets innovation", 
    "Every moment tells a story",
    "Let's create something amazing together"
  ];

  useEffect(() => {
    if (currentTextIndex < introTexts.length) {
      const timer = setTimeout(() => {
        setCurrentTextIndex(prev => prev + 1);
        setTextKey(prev => prev + 1);
      }, 3000); // 3 detik per text

      return () => clearTimeout(timer);
    } else {
      // Setelah semua text selesai, tunggu 1 detik lalu panggil onComplete
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 1000);

      return () => clearTimeout(finalTimer);
    }
  }, [currentTextIndex, introTexts.length, onComplete]);

  const handleAnimationComplete = () => {
    console.log(`Text ${currentTextIndex + 1} animation completed!`);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center fixed inset-0 z-50">
      <div className="text-center w-full max-w-4xl px-8">
        {currentTextIndex < introTexts.length && (
          <BlurText
            key={textKey}
            text={introTexts[currentTextIndex]}
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-4xl md:text-6xl font-light text-white text-center"
            stepDuration={0.35}
          />
        )}
      </div>
    </div>
  );
}

export default Intro;