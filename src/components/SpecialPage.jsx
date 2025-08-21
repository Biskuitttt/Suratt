// src/components/SpecialPage.jsx
import React, { useState, useEffect } from 'react';
import { FirebaseService } from '../services/firebase';

const SpecialPage = ({ specialCode, onBack }) => {
  const [pageData, setPageData] = useState(null);
  const [images, setImages] = useState([]);
  const [participantPhoto, setParticipantPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample images untuk demo
  const sampleImages = [
    "/image1.png", "/image2.png", "/image3.png", "/image4.png", "/image5.png", 
    "/image6.png", "/image7.png", "/image8.png", "/image9.png", "/image10.png"
  ];

  useEffect(() => {
    loadSpecialPageData();
    
    // Make FirebaseService available globally for testing
    if (typeof window !== 'undefined') {
      window.FirebaseService = FirebaseService;
    }
  }, [specialCode]);

  const loadSpecialPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch participant photo from Firebase
      if (specialCode) {
        try {
          // Debug the document structure first
          console.log('=== DEBUGGING PARTICIPANT DOCUMENT ===');
          const debugInfo = await FirebaseService.debugParticipantDocument(specialCode);
          console.log('Debug info:', debugInfo);
          
          // Fetch the photo
          console.log('Fetching photo for:', specialCode);
          const photoURL = await FirebaseService.getParticipantPhoto(specialCode);
          setParticipantPhoto(photoURL);
          console.log('✅ Participant photo loaded:', photoURL);
          
          // Additional debug: check if it's a local path or Firebase URL
          if (photoURL.startsWith('/Peserta/')) {
            console.log('🚨 Using LOCAL fallback photo (Firebase document not found)');
            console.log('💡 Run this to create the document: FirebaseService.setupCompleteDatabase()');
          } else {
            console.log('🔥 Using Firebase photo successfully!');
          }
        } catch (photoError) {
          console.error('Error loading participant photo:', photoError);
          // Fallback to default image
          setParticipantPhoto(sampleImages[1]);
        }
      }

      // Get the participant's display name and memo from Firebase
      let participantDisplayName = specialCode || 'Guest';
      let participantMemo1 = null;
      let participantMemo2 = null;
      
      try {
        const specialCodeData = await FirebaseService.getSpecialCodeData(specialCode);
        if (specialCodeData && specialCodeData.name) {
          participantDisplayName = specialCodeData.name;
          console.log('📝 Using display name from Firebase:', participantDisplayName);
        } else {
          console.log('📝 No name field found in Firebase, using code:', participantDisplayName);
        }
        
        // Ambil field memo1 jika ada
        if (specialCodeData && specialCodeData.memo1) {
          participantMemo1 = specialCodeData.memo1;
          console.log('📝 Found memo1 for participant:', participantMemo1);
        } else {
          console.log('📝 No memo1 field found for this participant');
        }
        
        // Ambil field memo2 jika ada
        if (specialCodeData && specialCodeData.memo2) {
          participantMemo2 = specialCodeData.memo2;
          console.log('📝 Found memo2 for participant:', participantMemo2);
        } else {
          console.log('📝 No memo2 field found for this participant');
        }
      } catch (nameError) {
        console.error('Error getting participant name from Firebase:', nameError);
        // Keep the fallback name (specialCode)
      }

      // Simulate loading for demo
      setTimeout(() => {
        setPageData({
          name: participantDisplayName,
          title: 'One Day in UMN',
          description: 'Our special memories together',
          memo1: participantMemo1,
          memo2: participantMemo2
        });
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to load special page');
      console.error('Error loading special page:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-amber-100 flex items-center justify-center z-50" style={{ margin: 0, padding: 0 }}>
        <div className="text-center flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-800 mb-4 mx-auto"></div>
          <p className="text-amber-800 text-xl" style={{ fontFamily: 'cursive' }}>Loading memories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-amber-100 flex items-center justify-center z-50">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-amber-800 text-white rounded hover:bg-amber-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
            Back
          </button>
        </div>
      </header>

      {/* Main Content - Bulletin Board Style */}
      <main 
        className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden pt-16"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(217, 119, 6, 0.6) transparent'
        }}
      >
        <style jsx>{`
          main::-webkit-scrollbar {
            width: 6px;
          }
          
          main::-webkit-scrollbar-track {
            background: transparent;
          }
          
          main::-webkit-scrollbar-thumb {
            background: rgba(217, 119, 6, 0.4);
            border-radius: 3px;
            transition: opacity 0.2s ease;
          }
          
          main::-webkit-scrollbar-thumb:hover {
            background: rgba(217, 119, 6, 0.7);
          }
          
          main::-webkit-scrollbar-thumb:active {
            background: rgba(180, 83, 9, 0.8);
          }
          
          /* Hide scrollbar but keep functionality */
          main {
            scrollbar-width: none;
          }
          
          /* Show only on hover for modern feel */
          main:not(:hover)::-webkit-scrollbar-thumb {
            opacity: 0;
          }
          
          main:hover::-webkit-scrollbar-thumb {
            opacity: 1;
          }
        `}</style>
        <div className="p-6 pt-4">
          <div className="relative max-w-6xl mx-auto pb-24">{/* Added bottom padding for record player space */}
          
          {/* Title Board - Pinned at the top */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Paper background for title */}
              <div 
                className="bg-yellow-100 p-6 transform -rotate-1 shadow-xl border border-yellow-200"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(255,192,203,0.1) 1px, transparent 1px),
                    linear-gradient(rgba(255,192,203,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              >
                <h1 
                  className="text-4xl lg:text-6xl font-bold text-red-600 mb-2 text-center transform rotate-1"
                  style={{ 
                    fontFamily: 'cursive',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  ONE DAY
                </h1>
                <p 
                  className="text-2xl lg:text-3xl text-blue-600 text-center transform -rotate-1"
                  style={{ fontFamily: 'cursive' }}
                >
                  In UMN
                </p>
            </div>

          {/* Mobile: Scrapbook Style */}
          <div className="lg:hidden space-y-8">
            {/* Scrapbook Page 1 */}
            <div 
              className="bg-white mx-4 p-6 shadow-xl rounded-lg border border-gray-200 transform -rotate-1"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, rgba(255,182,193,0.1) 1px, transparent 1px),
                  linear-gradient(rgba(255,182,193,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            >
              {/* Page title */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-purple-600 transform rotate-1" style={{ fontFamily: 'cursive' }}>
                  Our Best Moments 💕
                </h2>
                <div className="w-full h-0.5 bg-pink-200 mt-2"></div>
              </div>

              {/* Main photo with decorative frame */}
              <div className="relative mb-6">
                <div className="bg-yellow-100 p-4 transform rotate-2 shadow-lg border-2 border-yellow-200">
                  <img 
                    src={sampleImages[0]} 
                    alt="Main memory" 
                    className="w-full h-64 object-cover border border-yellow-300"
                  />
                  <div className="mt-2 text-center">
                    <div className="text-lg font-bold text-red-500" style={{ fontFamily: 'cursive' }}>
                      Best Day Ever! ✨
                    </div>
                  </div>
                </div>
                {/* Decorative tape */}
                <div className="absolute -top-2 left-8 w-16 h-6 bg-pink-400 transform -rotate-12 opacity-80 rounded shadow"></div>
                <div className="absolute -bottom-2 right-8 w-16 h-6 bg-blue-400 transform rotate-12 opacity-80 rounded shadow"></div>
              </div>

              {/* Gaming section - Photo Frame Style */}
              <div className="relative mb-6">
                <div className="bg-gradient-to-b from-amber-50 to-amber-100 p-6 transform -rotate-1 shadow-xl border-4 border-amber-200 rounded-lg">
                  
                  {/* Ornate Photo Frame */}
                  <div className="relative">
                    {/* Outer decorative frame */}
                    <div className="bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 p-1 rounded-lg shadow-lg">
                      {/* Inner frame */}
                      <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-3 rounded-md">
                        {/* Photo container with ornate border */}
                        <div className="relative bg-white p-2 rounded shadow-inner border-2 border-amber-300">
                          <img 
                            src={participantPhoto || sampleImages[1]} 
                            alt="Gaming moment" 
                            className="w-full h-48 object-cover rounded border border-gray-200"
                            onLoad={() => console.log('🖼️ Mobile gaming image loaded:', participantPhoto || sampleImages[1])}
                            onError={(e) => {
                              console.error('❌ Mobile gaming image failed to load:', participantPhoto || sampleImages[1]);
                              console.log('Falling back to sample image');
                              e.target.src = sampleImages[1];
                            }}
                          />
                          
                          {/* Corner decorations */}
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-amber-400 rotate-45 border border-amber-500"></div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rotate-45 border border-amber-500"></div>
                          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-amber-400 rotate-45 border border-amber-500"></div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rotate-45 border border-amber-500"></div>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="flex justify-center mt-3 space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Frame nameplate */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-amber-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-amber-700">
                        {pageData?.name || 'Player'}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Heart sticker */}
                <div className="absolute top-2 right-2 text-2xl">💖</div>
                {/* Frame hanging wire effect */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-400 rounded-full shadow-sm"></div>
              </div>
            </div>

            {/* Scrapbook Page 2 */}
            <div 
              className="bg-white mx-4 p-6 shadow-xl rounded-lg border border-gray-200 transform rotate-1"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, rgba(144,238,144,0.1) 1px, transparent 1px),
                  linear-gradient(rgba(144,238,144,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-green-600 transform -rotate-1" style={{ fontFamily: 'cursive' }}>
                  Memory Lane 📸
                </h2>
                <div className="w-full h-0.5 bg-green-200 mt-2"></div>
              </div>

              {/* Photo strip */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[2, 3, 4].map((index, i) => (
                  <div key={index} className="relative">
                    <div className={`bg-white p-2 shadow-md transform ${i % 2 === 0 ? 'rotate-2' : '-rotate-2'} border border-gray-300`}>
                      <img 
                        src={sampleImages[index]} 
                        alt={`Memory ${index}`} 
                        className="w-full h-40 object-cover"
                      />
                      <div className="mt-1 text-center text-xs text-gray-700" style={{ fontFamily: 'cursive' }}>
                        Moment {index - 1}
                      </div>
                    </div>
                    {/* Corner tape */}
                    <div className={`absolute -top-1 ${i % 2 === 0 ? '-left-1' : '-right-1'} w-8 h-4 bg-yellow-400 transform rotate-45 opacity-70 shadow`}></div>
                  </div>
                ))}
              </div>

              {/* Camera section */}
              <div className="relative">
                <div className="bg-pink-50 p-4 transform rotate-2 shadow-md border border-pink-200 rounded">
                  <h3 className="text-lg font-bold text-pink-600 mb-3" style={{ fontFamily: 'cursive' }}>
                    Behind the Lens 📷
                  </h3>
                  <div className="bg-black rounded p-3 relative">
                    <img 
                      src={sampleImages[5]} 
                      alt="Through camera lens" 
                      className="w-full h-48 object-cover rounded"
                    />
                    <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="text-white text-sm mt-2 text-center font-mono">Canon EOS</div>
                  </div>
                </div>
                {/* Star stickers */}
                <div className="absolute top-1 right-1 text-xl">⭐</div>
                <div className="absolute bottom-1 left-1 text-lg">✨</div>
              </div>
            </div>

            {/* Scrapbook Page 3 */}
            <div 
              className="bg-white mx-4 p-6 shadow-xl rounded-lg border border-gray-200 transform -rotate-1"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, rgba(255,228,181,0.2) 1px, transparent 1px),
                  linear-gradient(rgba(255,228,181,0.2) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-orange-600 transform rotate-1" style={{ fontFamily: 'cursive' }}>
                  Sweet Messages 💌
                </h2>
                <div className="w-full h-0.5 bg-orange-200 mt-2"></div>
              </div>

              {/* Special note */}
              <div className="relative mb-6">
                <div className="bg-yellow-200 p-6 shadow-lg transform -rotate-2 relative border border-yellow-300 rounded">
                  {/* Sticky note corner fold */}
                  <div className="absolute top-0 right-0 w-6 h-6 bg-yellow-300 transform rotate-45 origin-top-right translate-x-3 -translate-y-3 shadow-sm border-r border-b border-yellow-400"></div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'cursive' }}>
                      Dear {pageData?.name || 'Friend'} 💕
                    </h3>
                    {pageData?.memo1 && (
                      <p className="text-sm text-gray-700 leading-relaxed mb-3" style={{ fontFamily: 'cursive' }}>
                        {pageData.memo1}
                      </p>
                    )}
                    {pageData?.memo2 && (
                      <p className="text-sm text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'cursive' }}>
                        {pageData.memo2}
                      </p>
                    )}
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'cursive' }}>
                      With love,<br/>
                      <span className="font-bold">The Gang ✨</span>
                    </p>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-2 left-2 text-pink-500 text-lg">💝</div>
                  <div className="absolute bottom-2 right-2 text-pink-500 text-lg">🌟</div>
                </div>
                {/* Washi tape */}
                <div className="absolute -top-1 left-4 w-20 h-4 bg-green-400 transform -rotate-6 opacity-70 rounded shadow"></div>
              </div>

              {/* Memory quote */}
              <div className="relative">
                <div className="bg-blue-100 p-4 rounded-lg shadow-md border-l-4 border-blue-500 transform rotate-1">
                  <p className="text-sm text-gray-800 italic leading-relaxed" style={{ fontFamily: 'cursive' }}>
                    "One day we spent together that became a lifetime of memories... 💕"
                  </p>
                </div>
                {/* Date stamp */}
                <div className="mt-4 flex justify-center">
                  <div className="bg-red-600 text-white px-4 py-2 rounded shadow-lg border-2 border-red-800 transform -rotate-2">
                    <p className="text-center font-bold" style={{ fontFamily: 'courier, monospace' }}>
                      18-07-2024
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrapbook Page 4 - Music */}
            <div 
              className="bg-white mx-4 p-6 shadow-xl rounded-lg border border-gray-200 transform rotate-1"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, rgba(221,160,221,0.1) 1px, transparent 1px),
                  linear-gradient(rgba(221,160,221,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-purple-600 transform -rotate-1" style={{ fontFamily: 'cursive' }}>
                  Our Soundtrack 🎵
                </h2>
                <div className="w-full h-0.5 bg-purple-200 mt-2"></div>
              </div>

              {/* Spotify player */}
              <div className="relative mb-6">
                <div className="bg-green-50 p-4 rounded-xl shadow-lg transform rotate-2 border border-green-200">
                  <iframe 
                    data-testid="embed-iframe" 
                    style={{ borderRadius: '8px' }} 
                    src="https://open.spotify.com/embed/track/5WOSNVChcadlsCRiqXE45K?utm_source=generator" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen="" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                  />
                  <div className="mt-3 text-center text-gray-700 text-sm" style={{ fontFamily: 'cursive' }}>
                    The song that reminds us of this day 🎶
                  </div>
                </div>
                {/* Musical notes decoration */}
                <div className="absolute -top-2 right-2 text-2xl">🎵</div>
                <div className="absolute -bottom-2 left-2 text-xl">🎶</div>
              </div>

              {/* Final message */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg shadow-md border border-pink-200 transform -rotate-1">
                  <p className="text-lg font-bold text-purple-700 mb-2" style={{ fontFamily: 'cursive' }}>
                    "Sometimes the smallest moments take up the most room in your heart"
                  </p>
                  <div className="flex justify-center space-x-2 mt-3">
                    <span className="text-2xl">💕</span>
                    <span className="text-2xl">✨</span>
                    <span className="text-2xl">🌟</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom spacing for mobile */}
            <div className="h-20"></div>
          </div>
              
              {/* Push pins for title */}
              <div className="absolute -top-2 left-4 w-4 h-4 bg-red-500 rounded-full shadow-lg border-2 border-red-600"></div>
              <div className="absolute -top-2 right-4 w-4 h-4 bg-blue-500 rounded-full shadow-lg border-2 border-blue-600"></div>
            </div>
          </div>

          {/* Desktop: Bulletin Board, Mobile: Scrapbook */}
          <div className="hidden lg:grid grid-cols-12 gap-6 min-h-screen">
            {/* Desktop bulletin board layout remains the same */}
            
            {/* Large center photo - pinned */}
            <div className="col-span-12 lg:col-span-5 row-span-3 relative group">
              <div className="relative">
                <div 
                  className="bg-white p-4 shadow-2xl transform -rotate-2 hover:rotate-0 transition-all duration-300 border border-gray-200"
                  style={{ aspectRatio: '4/5' }}
                >
                  <img 
                    src={sampleImages[0]} 
                    alt="Main memory" 
                    className="w-full h-full object-cover"
                  />
                  <div className="mt-3 text-center">
                    <div className="text-sm text-gray-700" style={{ fontFamily: 'cursive' }}>
                      Best Day Ever! ✨
                    </div>
                  </div>
                </div>
                {/* Push pins */}
                <div className="absolute -top-2 left-6 w-4 h-4 bg-yellow-500 rounded-full shadow-lg border-2 border-yellow-600"></div>
                <div className="absolute -top-2 right-6 w-4 h-4 bg-green-500 rounded-full shadow-lg border-2 border-green-600"></div>
              </div>
            </div>

            {/* Gaming device mockup - Photo Frame Style */}
            <div className="col-span-12 lg:col-span-4 row-span-2 relative">
              <div className="relative">
                <div 
                  className="bg-gradient-to-b from-amber-50 to-amber-100 p-6 rounded-lg shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-300 border-4 border-amber-200"
                  style={{ aspectRatio: '1/1' }}
                >
                  
                  {/* Ornate Photo Frame */}
                  <div className="relative">
                    {/* Outer decorative frame */}
                    <div className="bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 p-1 rounded-lg shadow-lg">
                      {/* Inner frame */}
                      <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-3 rounded-md">
                        {/* Photo container with ornate border */}
                        <div className="relative bg-white p-2 rounded shadow-inner border-2 border-amber-300">
                          <img 
                            src={participantPhoto || sampleImages[1]} 
                            alt="Gaming moment" 
                            className="w-full h-100 object-cover rounded border border-gray-200"
                            onLoad={() => console.log('🖼️ Desktop gaming image loaded:', participantPhoto || sampleImages[1])}
                            onError={(e) => {
                              console.error('❌ Desktop gaming image failed to load:', participantPhoto || sampleImages[1]);
                              console.log('Falling back to sample image');
                              e.target.src = sampleImages[1];
                            }}
                          />
                          
                          {/* Corner decorations */}
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-amber-400 rotate-45 border border-amber-500"></div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rotate-45 border border-amber-500"></div>
                          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-amber-400 rotate-45 border border-amber-500"></div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rotate-45 border border-amber-500"></div>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="flex justify-center mt-2 space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Frame nameplate */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-amber-700">
                        {pageData?.name || 'Player'}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Push pin */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-lg border-2 border-purple-600"></div>
                {/* Frame hanging wire effect */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-400 rounded-full shadow-sm"></div>
              </div>
            </div>

            {/* Small polaroid photos - pinned */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              {[2, 3, 4].map((index, i) => (
                <div key={index} className="relative">
                  <div className={`bg-white p-3 shadow-lg transform ${i % 2 === 0 ? 'rotate-3' : '-rotate-2'} hover:rotate-0 transition-all duration-300 border border-gray-200`}>
                    <img 
                      src={sampleImages[index]} 
                      alt={`Memory ${index}`} 
                      className="w-full h-40 object-cover"
                    />
                    <div className="mt-2 text-center text-xs text-gray-700" style={{ fontFamily: 'cursive' }}>
                      Moment {index - 1}
                    </div>
                  </div>
                  {/* Push pin */}
                  <div className={`absolute -top-2 ${i % 2 === 0 ? 'left-2' : 'right-2'} w-3 h-3 bg-${['red', 'blue', 'green'][i]}-500 rounded-full shadow-md border border-${['red', 'blue', 'green'][i]}-600`}></div>
                </div>
              ))}
            </div>

            {/* Camera mockup - pinned */}
            <div className="col-span-12 lg:col-span-3 row-span-2 relative">
              <div className="relative">
                <div 
                  className="bg-white p-4 rounded-lg shadow-xl transform -rotate-3 hover:rotate-0 transition-all duration-300 border border-gray-200"
                  style={{ aspectRatio: '1/1' }}
                >
                  <div className="bg-black rounded p-3 relative">
                    <img 
                      src={sampleImages[5]} 
                      alt="Through camera lens" 
                      className="w-full h-40 object-cover rounded"
                    />
                    <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="text-white text-xs mt-2 text-center font-mono">Canon EOS</div>
                  </div>
                  <div className="mt-2 text-center text-gray-700 text-sm" style={{ fontFamily: 'cursive' }}>
                    Behind the Lens 📸
                  </div>
                </div>
                {/* Push pins */}
                <div className="absolute -top-2 left-3 w-4 h-4 bg-orange-500 rounded-full shadow-lg border-2 border-orange-600"></div>
                <div className="absolute -top-2 right-3 w-4 h-4 bg-teal-500 rounded-full shadow-lg border-2 border-teal-600"></div>
              </div>
            </div>

            {/* Sticky Note - pinned */}
            <div className="col-span-12 lg:col-span-4 relative">
              <div className="relative">
                <div 
                  className="bg-yellow-200 p-6 shadow-2xl transform -rotate-2 hover:rotate-0 transition-all duration-300 relative border border-yellow-300"
                  style={{ aspectRatio: '4/3' }}
                >
                  {/* Sticky note corner fold */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-300 transform rotate-45 origin-top-right translate-x-4 -translate-y-4 shadow-sm border-r border-b border-yellow-400"></div>
                  
                  {/* Sticky note content */}
                  <div className="h-full flex flex-col justify-center text-center">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'cursive' }}>
                        Dear {pageData?.name || 'Friend'} 💕
                      </h3>
                      {pageData?.memo1 && (
                        <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'cursive' }}>
                          {pageData.memo1}
                        </p>
                      )}
                      {pageData?.memo2 && (
                        <p className="text-sm text-gray-700 mt-3 leading-relaxed" style={{ fontFamily: 'cursive' }}>
                          {pageData.memo2}
                        </p>
                      )}
                    </div>
                    <div className="mt-auto">
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'cursive' }}>
                        With love,<br/>
                        <span className="font-bold">The Gang ✨</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Small decorative elements */}
                  <div className="absolute top-3 left-3 text-pink-500 text-lg">💝</div>
                  <div className="absolute bottom-3 right-3 text-pink-500 text-lg">🌟</div>
                </div>
                
                {/* Push pin for sticky note */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pink-500 rounded-full shadow-lg border-2 border-pink-600"></div>
              </div>
            </div>

            {/* Spotify Embed - pinned to board */}
            <div className="col-span-12 lg:col-span-8 relative">
              <div className="relative">
                <div 
                  className="bg-white p-4 rounded-xl shadow-xl transform rotate-1 hover:rotate-0 transition-all duration-300 border border-gray-200"
                  style={{ aspectRatio: '16/9' }}
                >
                  <iframe 
                    data-testid="embed-iframe" 
                    style={{ borderRadius: '8px' }} 
                    src="https://open.spotify.com/embed/playlist/1fhe63s4CJ4U2SpP5E7Xu6?utm_source=generator"
                    width="100%" 
                    height="500" 
                    frameBorder="0" 
                    allowFullScreen="" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                  />
                  <div className="mt-2 text-center text-gray-700 text-sm" style={{ fontFamily: 'cursive' }}>
                    Our Playlist 🎵
                  </div>
                </div>
                
                {/* Push pins for Spotify */}
                <div className="absolute -top-2 left-8 w-4 h-4 bg-green-500 rounded-full shadow-lg border-2 border-green-600"></div>
                <div className="absolute -top-2 right-8 w-4 h-4 bg-red-500 rounded-full shadow-lg border-2 border-red-600"></div>
              </div>
            </div>

            {/* Memory Cards - scattered and pinned */}
            <div className="col-span-12 relative h-40">
              {/* Memory card 1 */}
              <div className="absolute top-4 left-20 transform -rotate-3">
                <div className="bg-blue-100 p-4 rounded shadow-xl border-l-4 border-blue-500">
                  <p className="text-sm text-gray-800" style={{ fontFamily: 'cursive' }}>
                    "One day we spent together that became a lifetime of memories... 💕"
                  </p>
                </div>
                <div className="absolute -top-2 left-2 w-3 h-3 bg-blue-500 rounded-full shadow-md border border-blue-600"></div>
              </div>
              
              {/* Date stamp */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 rotate-1">
                <div className="bg-red-600 text-white px-6 py-3 rounded shadow-xl border-2 border-red-800">
                  <p className="text-center font-bold text-lg" style={{ fontFamily: 'courier, monospace' }}>
                    18-07-2024
                  </p>
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-lg border-2 border-red-700"></div>
              </div>

              {/* Emoji stickers */}
              <div className="absolute top-8 right-32 transform rotate-12">
                <div className="bg-white p-3 rounded-full shadow-lg border border-gray-200">
                  <span className="text-3xl">🎮</span>
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rounded-full shadow-md border border-yellow-600"></div>
              </div>

              {/* Memory quote */}
              <div className="absolute bottom-4 right-20 transform rotate-2">
                <div className="bg-pink-100 p-3 rounded-lg shadow-lg border border-pink-200 max-w-xs">
                  <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'cursive' }}>
                    "Sometimes the smallest moments take up the most room in your heart"
                  </p>
                </div>
                <div className="absolute -top-2 right-2 w-3 h-3 bg-pink-500 rounded-full shadow-md border border-pink-600"></div>
              </div>
            </div>



          </div>
        </div>
        </div>
      </main>



      {/* Vinyl Record Player - Bottom Right - styled for bulletin board */}
      <div className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-20">
        <div className="relative">
          {/* Record player base */}
          <div className="bg-amber-800 p-4 rounded shadow-xl border border-amber-900">
            <div className="relative w-20 h-20 lg:w-28 lg:h-28">
              {/* Vinyl Record */}
              <div className="absolute inset-0 rounded-full shadow-2xl animate-spin overflow-hidden" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}>
                <img 
                  src="/vinyl.png" 
                  alt="Vinyl Record" 
                  className="w-full h-full object-cover rounded-full"
                />
                
                {/* Center label overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-red-600 rounded-full border-2 border-red-800 flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-black rounded-full shadow-inner"></div>
                  </div>
                </div>
                
                {/* Subtle vinyl grooves overlay */}
                <div className="absolute inset-2 border border-black/10 rounded-full"></div>
                <div className="absolute inset-3 border border-black/5 rounded-full"></div>
                <div className="absolute inset-4 border border-black/5 rounded-full"></div>
                
                {/* Vinyl shine effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-30"></div>
              </div>
              
              {/* Tonearm */}
              <div className="absolute top-2 right-3 w-10 lg:w-14 h-1 bg-gray-300 rounded-full transform origin-right -rotate-65 shadow-lg border-t border-gray-500">
                <div className="absolute right-0 w-2 h-2 bg-gray-600 rounded-full transform translate-x-1 -translate-y-0.5 border border-gray-700"></div>
                {/* Tonearm counterweight */}
                <div className="absolute left-0 w-1.5 h-1.5 bg-gray-500 rounded-full transform -translate-x-1 -translate-y-0.25"></div>
              </div>
            </div>
          </div>
          
          {/* Push pin for record player - positioned correctly at top center */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full shadow-lg border-2 border-orange-600"></div>
          
          {/* Musical notes floating above record player */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="text-amber-700 text-lg lg:text-xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>♪</div>
          </div>
          <div className="absolute -top-12 left-2">
            <div className="text-amber-600 text-base lg:text-lg animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>♫</div>
          </div>
          <div className="absolute -top-14 -left-1">
            <div className="text-amber-800 text-sm lg:text-base animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>♬</div>
          </div>
          <div className="absolute -top-10 left-4">
            <div className="text-amber-500 text-xs lg:text-sm animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.2s' }}>♩</div>
          </div>
        </div>
      </div>

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

export default SpecialPage;