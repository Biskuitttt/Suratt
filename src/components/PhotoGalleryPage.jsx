// src/components/PhotoGalleryPage.jsx
import React, { useState, useEffect, useRef } from 'react';

const PhotoGalleryPage = ({ specialCode, onBack }) => {
  const [polaroids, setPolaroids] = useState([]);
  const [draggedPolaroid, setDraggedPolaroid] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // Sample photos - you can replace with actual gallery images
  const galleryImages = [
    "/image1.png", "/image2.png", "/image3.png", "/image4.png", "/image5.png",
    "/image6.png", "/image7.png", "/image8.png", "/image9.png", "/image10.png",
    "/image11.png", "/image12.png", "/image13.png", "/image14.png", "/image15.png", "/image16.png"
  ];

  // Photo captions
  const photoCaptions = [
    "Best Day Ever! 📸", "Squad Goals ✨", "Memory Lane 💕", "Fun Times 🎉",
    "Golden Moment ⭐", "Friendship Goals 👥", "Sweet Memory 🍭", "Good Vibes 🌈",
    "Happy Times 😊", "Adventures 🗺️", "Memories Made 💫", "Perfect Day ☀️",
    "Together Forever 🤝", "Cherished Moment 💖", "Life's Good 🌟", "Beautiful Day 🌸"
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

  // Initialize polaroids with random positions and rotations
  useEffect(() => {
    const initializePolaroids = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const polaroidWidth = isMobile ? 120 : 200;
      const polaroidHeight = isMobile ? 140 : 240;

      const newPolaroids = galleryImages.map((image, index) => ({
        id: index,
        image,
        caption: photoCaptions[index] || `Photo ${index + 1}`,
        x: Math.random() * (containerWidth - polaroidWidth),
        y: Math.random() * (containerHeight - polaroidHeight - 100) + 50, // Leave space for header
        rotation: -15 + Math.random() * 30, // Random rotation between -15 and 15 degrees
        zIndex: index
      }));

      setPolaroids(newPolaroids);
    };

    // Delay initialization to ensure container is rendered
    const timer = setTimeout(initializePolaroids, 100);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Mouse/Touch event handlers
  const handleStart = (e, polaroidId) => {
    e.preventDefault();
    const polaroid = polaroids.find(p => p.id === polaroidId);
    if (!polaroid) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setDraggedPolaroid(polaroidId);
    setDragOffset({
      x: clientX - polaroid.x,
      y: clientY - polaroid.y
    });

    // Bring to front
    setPolaroids(prev => prev.map(p => 
      p.id === polaroidId 
        ? { ...p, zIndex: Math.max(...prev.map(p => p.zIndex)) + 1 }
        : p
    ));
  };

  const handleMove = (e) => {
    if (!draggedPolaroid) return;

    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const polaroidWidth = isMobile ? 120 : 200;
    const polaroidHeight = isMobile ? 140 : 240;

    const newX = Math.max(0, Math.min(
      clientX - containerRect.left - dragOffset.x,
      containerRect.width - polaroidWidth
    ));
    const newY = Math.max(0, Math.min(
      clientY - containerRect.top - dragOffset.y,
      containerRect.height - polaroidHeight
    ));

    setPolaroids(prev => prev.map(p => 
      p.id === draggedPolaroid 
        ? { ...p, x: newX, y: newY }
        : p
    ));
  };

  const handleEnd = () => {
    setDraggedPolaroid(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Add event listeners
  useEffect(() => {
    const handleMouseMove = (e) => handleMove(e);
    const handleMouseUp = () => handleEnd();
    const handleTouchMove = (e) => handleMove(e);
    const handleTouchEnd = () => handleEnd();

    if (draggedPolaroid) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [draggedPolaroid, dragOffset, isMobile]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Cork Board Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#D4A574',
          backgroundImage: `
            radial-gradient(circle at 20% 80%, #C9975B 2px, transparent 2px),
            radial-gradient(circle at 80% 20%, #C9975B 2px, transparent 2px),
            radial-gradient(circle at 40% 40%, #B8926F 1px, transparent 1px),
            radial-gradient(circle at 90% 70%, #B8926F 1px, transparent 1px),
            radial-gradient(circle at 10% 90%, #C9975B 1.5px, transparent 1.5px),
            radial-gradient(circle at 60% 10%, #B8926F 1px, transparent 1px),
            radial-gradient(circle at 30% 70%, #C9975B 2px, transparent 2px),
            radial-gradient(circle at 70% 90%, #B8926F 1px, transparent 1px)
          `,
          backgroundSize: '150px 150px, 200px 200px, 100px 100px, 180px 180px, 120px 120px, 160px 160px, 140px 140px, 110px 110px'
        }}
      >
        {/* Cork texture overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 49%, rgba(139, 117, 89, 0.1) 50%, transparent 51%),
              linear-gradient(-45deg, transparent 49%, rgba(139, 117, 89, 0.1) 50%, transparent 51%)
            `,
            backgroundSize: '8px 8px'
          }}
        ></div>
      </div>

      {/* Push Pins scattered around */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Push pins */}
        <div className="absolute top-20 left-16 w-4 h-4 bg-red-500 rounded-full shadow-lg border-2 border-red-600"></div>
        <div className="absolute top-32 right-24 w-4 h-4 bg-blue-500 rounded-full shadow-lg border-2 border-blue-600"></div>
        <div className="absolute bottom-40 left-20 w-4 h-4 bg-yellow-500 rounded-full shadow-lg border-2 border-yellow-600"></div>
        <div className="absolute bottom-24 right-16 w-4 h-4 bg-green-500 rounded-full shadow-lg border-2 border-green-600"></div>
        <div className="absolute top-1/2 left-8 w-4 h-4 bg-purple-500 rounded-full shadow-lg border-2 border-purple-600"></div>
        <div className="absolute top-1/3 right-8 w-4 h-4 bg-pink-500 rounded-full shadow-lg border-2 border-pink-600"></div>
        
        {/* Additional smaller pins */}
        <div className="absolute top-60 left-1/3 w-3 h-3 bg-orange-500 rounded-full shadow-md border border-orange-600"></div>
        <div className="absolute bottom-60 right-1/3 w-3 h-3 bg-teal-500 rounded-full shadow-md border border-teal-600"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-amber-800/90 backdrop-blur-sm rounded-full shadow-lg text-white hover:bg-amber-700 transition-all border-2 border-amber-900"
            style={{ fontFamily: 'cursive' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Memories
          </button>
          
          {/* Title */}
          <div className="text-center flex-1">
            <h1 
              className="text-2xl lg:text-4xl font-bold text-amber-900 drop-shadow-lg"
              style={{ 
                fontFamily: 'cursive',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              📸 Photo Gallery
            </h1>
            <p 
              className="text-sm lg:text-base text-amber-800 mt-1"
              style={{ fontFamily: 'cursive' }}
            >
              Drag & arrange the polaroids!
            </p>
          </div>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Gallery Container */}
      <main 
        ref={containerRef}
        className="flex-1 relative overflow-hidden pt-20 pb-4"
        style={{
          touchAction: 'none', // Prevent scrolling on touch devices during drag
          userSelect: 'none'
        }}
      >
        {/* Instructions for mobile */}
        {isMobile && (
          <div 
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-amber-100/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-amber-300"
            style={{ fontFamily: 'cursive' }}
          >
            <p className="text-xs text-amber-800 text-center">
              ✋ Tap & drag polaroids to move them around!
            </p>
          </div>
        )}

        {/* Polaroid Photos */}
        {polaroids.map((polaroid) => (
          <div
            key={polaroid.id}
            style={{
              position: 'absolute',
              left: `${polaroid.x}px`,
              top: `${polaroid.y}px`,
              transform: `rotate(${polaroid.rotation}deg)`,
              zIndex: polaroid.zIndex,
              cursor: draggedPolaroid === polaroid.id ? 'grabbing' : 'grab',
              touchAction: 'none',
              userSelect: 'none',
              width: isMobile ? '120px' : '200px',
              height: isMobile ? '140px' : '240px'
            }}
            onMouseDown={(e) => handleStart(e, polaroid.id)}
            onTouchStart={(e) => handleStart(e, polaroid.id)}
          >
            {/* Polaroid Container */}
            <div 
              className={`
                bg-white shadow-xl border border-gray-200 
                ${draggedPolaroid === polaroid.id ? 'shadow-2xl scale-105' : 'hover:shadow-2xl hover:scale-102'} 
                transition-all duration-200 w-full h-full
              `}
              style={{
                padding: isMobile ? '8px 8px 20px 8px' : '12px 12px 32px 12px',
                borderRadius: '8px'
              }}
            >
              {/* Photo */}
              <div 
                className="w-full bg-gray-100 overflow-hidden rounded-sm"
                style={{ 
                  height: isMobile ? '80px' : '150px'
                }}
              >
                <img 
                  src={polaroid.image}
                  alt={polaroid.caption}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              
              {/* Caption */}
              <div 
                className="text-center mt-2"
                style={{ 
                  fontFamily: 'cursive',
                  fontSize: isMobile ? '10px' : '14px',
                  color: '#374151',
                  fontWeight: '600'
                }}
              >
                {polaroid.caption}
              </div>
              
              {/* Small decorative elements */}
              <div 
                className="absolute top-1 right-1 opacity-60"
                style={{ fontSize: isMobile ? '8px' : '12px' }}
              >
                ✨
              </div>
            </div>
            
            {/* Push pin */}
            <div 
              className={`
                absolute -top-2 left-1/2 transform -translate-x-1/2 
                ${isMobile ? 'w-3 h-3' : 'w-4 h-4'} 
                rounded-full shadow-lg border-2
              `}
              style={{
                backgroundColor: `hsl(${(polaroid.id * 60) % 360}, 70%, 60%)`,
                borderColor: `hsl(${(polaroid.id * 60) % 360}, 70%, 40%)`
              }}
            ></div>
          </div>
        ))}

        {/* Instructions for desktop */}
        {!isMobile && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <div className="bg-amber-100/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-amber-300">
              <p 
                className="text-sm text-amber-800 text-center"
                style={{ fontFamily: 'cursive' }}
              >
                🖱️ Click & drag the polaroids to rearrange them • Each photo has its own push pin!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Paper texture overlay for authenticity */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 100% 50%, transparent 20%, rgba(255,255,255,0.1) 21%, rgba(255,255,255,0.1) 34%, transparent 35%, transparent),
            linear-gradient(0deg, rgba(0,0,0,0.05) 50%, transparent 50%)
          `,
          backgroundSize: '30px 30px, 15px 15px'
        }}
      ></div>
    </div>
  );
};

export default PhotoGalleryPage;