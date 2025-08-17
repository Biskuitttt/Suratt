// src/components/SpecialPage.jsx
import React, { useState, useEffect } from 'react';
import { FirebaseService } from '../services/firebase';

const SpecialPage = ({ specialCode, onBack }) => {
  const [pageData, setPageData] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample images untuk demo
  const sampleImages = [
    "/image1.png", "/image2.png", "/image3.png", "/image4.png", "/image5.png", 
    "/image6.png", "/image7.png", "/image8.png", "/image9.png", "/image10.png"
  ];

  useEffect(() => {
    loadSpecialPageData();
  }, [specialCode]);

  const loadSpecialPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate loading for demo
      setTimeout(() => {
        setPageData({
          name: specialCode || 'Guest',
          title: 'One Day in July',
          description: 'Our special memories together'
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
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-800 text-xl">Loading memories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-50 overflow-hidden">
      {/* Dark Paper Background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(transparent 0, transparent 39px, rgba(255,255,255,0.1) 40px),
              linear-gradient(90deg, transparent 0, transparent 79px, rgba(255,255,255,0.1) 80px)
            `,
            backgroundSize: '80px 40px'
          }}
        ></div>
      </div>

      {/* Header dengan style scrapbook */}
      <header className="relative z-10 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg text-white hover:bg-gray-700 transition-all border-2 border-gray-600"
            style={{ fontFamily: 'cursive' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back
          </button>
          
          {/* Main Title with decorative elements */}
          <div className="absolute left-1/2 top-4 transform -translate-x-1/2 text-center">
            <div className="relative">
              <h1 
                className="text-4xl font-bold text-yellow-400 mb-2 transform -rotate-2"
                style={{ 
                  fontFamily: 'cursive',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                ONE DAY
              </h1>
              <p 
                className="text-2xl text-pink-400 transform rotate-1"
                style={{ fontFamily: 'cursive' }}
              >
                In July
              </p>
              
              {/* Decorative doodles */}
              <div className="absolute -top-2 -right-8 text-yellow-300 text-2xl transform rotate-12">⭐</div>
              <div className="absolute -bottom-2 -left-6 text-pink-300 text-xl transform -rotate-12">✨</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Collage Content */}
      <main className="relative z-10 p-6 pt-24 h-full overflow-auto">
        {/* Collage Container */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Washi tape strips - darker colors for dark theme */}
            <div className="absolute top-20 left-10 w-32 h-6 bg-gradient-to-r from-pink-600 to-pink-700 transform -rotate-12 opacity-70 rounded shadow-lg"></div>
            <div className="absolute top-40 right-20 w-40 h-6 bg-gradient-to-r from-blue-600 to-blue-700 transform rotate-6 opacity-70 rounded shadow-lg"></div>
            <div className="absolute bottom-40 left-16 w-36 h-6 bg-gradient-to-r from-green-600 to-green-700 transform -rotate-6 opacity-70 rounded shadow-lg"></div>
            
            {/* Paper clips and pins */}
            <div className="absolute top-32 right-40">
              <div className="w-4 h-6 border-2 border-gray-300 rounded-sm transform rotate-45 shadow-md"></div>
            </div>
            <div className="absolute bottom-60 left-32 w-3 h-3 bg-red-400 rounded-full shadow-md"></div>
            <div className="absolute top-60 left-60 w-3 h-3 bg-yellow-400 rounded-full shadow-md"></div>
            
            {/* Doodles */}
            <svg className="absolute top-80 right-16 w-16 h-16 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>

          {/* Photo Grid - Scrapbook Style */}
          <div className="relative grid grid-cols-12 gap-4 min-h-screen">
            
            {/* Large center photo */}
            <div className="col-span-5 row-span-3 relative group">
              <div 
                className="bg-white p-3 shadow-xl transform -rotate-1 hover:rotate-0 transition-all duration-300 rounded"
                style={{ aspectRatio: '4/5' }}
              >
                <img 
                  src={sampleImages[0]} 
                  alt="Main memory" 
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute -bottom-2 -right-2 bg-red-500 text-white px-2 py-1 text-xs rounded transform rotate-12 shadow-lg" style={{ fontFamily: 'cursive' }}>
                  Best Day Ever! ✨
                </div>
              </div>
            </div>

            {/* Gaming device mockup */}
            <div className="col-span-4 row-span-2 relative">
              <div 
                className="bg-gray-800 p-4 rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-all duration-300"
                style={{ aspectRatio: '16/10' }}
              >
                <div className="bg-gray-900 rounded-lg p-2 relative">
                  <img 
                    src={sampleImages[1]} 
                    alt="Gaming moment" 
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="flex justify-between items-center mt-2 text-white text-xs">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div>PS VITA</div>
                  </div>
                </div>
                <div className="absolute -top-3 -left-3 bg-yellow-400 text-black px-2 py-1 text-xs rounded transform -rotate-12 shadow-lg" style={{ fontFamily: 'cursive' }}>
                  Gaming Time!
                </div>
              </div>
            </div>

            {/* Small polaroid photos */}
            <div className="col-span-3 space-y-4">
              {[2, 3, 4].map((index, i) => (
                <div key={index} className={`transform ${i % 2 === 0 ? 'rotate-3' : '-rotate-2'} hover:rotate-0 transition-all duration-300`}>
                  <div className="bg-white p-2 shadow-lg rounded">
                    <img 
                      src={sampleImages[index]} 
                      alt={`Memory ${index}`} 
                      className="w-full h-20 object-cover rounded"
                    />
                    <div className="h-6 flex items-center justify-center text-xs" style={{ fontFamily: 'cursive' }}>
                      Moment {index - 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Camera mockup */}
            <div className="col-span-3 row-span-2 relative">
              <div 
                className="bg-gradient-to-br from-gray-300 to-gray-500 p-3 rounded-lg shadow-xl transform -rotate-3 hover:rotate-0 transition-all duration-300"
                style={{ aspectRatio: '4/3' }}
              >
                <div className="bg-black rounded p-2 relative">
                  <img 
                    src={sampleImages[5]} 
                    alt="Through camera lens" 
                    className="w-full h-24 object-cover rounded"
                  />
                  <div className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="text-white text-xs mt-1 text-center font-mono">Canon</div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-2 py-1 text-xs rounded transform rotate-6 shadow-lg" style={{ fontFamily: 'cursive' }}>
                  Behind the lens
                </div>
              </div>
            </div>

            {/* Sticky Note - positioned under PS Vita */}
            <div className="col-span-4 relative">
              <div 
                className="bg-yellow-200 p-4 shadow-2xl transform -rotate-1 hover:rotate-0 transition-all duration-300 relative"
                style={{ aspectRatio: '4/3' }}
              >
                {/* Sticky note corner fold */}
                <div className="absolute top-0 right-0 w-6 h-6 bg-yellow-300 transform rotate-45 origin-top-right translate-x-3 -translate-y-3 shadow-sm"></div>
                
                {/* Sticky note content */}
                <div className="h-full flex flex-col justify-center text-center">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: 'cursive' }}>
                      Dear {pageData?.name || 'Friend'} 💕
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'cursive' }}>
                      Thank you for being part of our beautiful journey. This day in July will forever be etched in our hearts.
                    </p>
                    <p className="text-xs text-gray-700 mt-2 leading-relaxed" style={{ fontFamily: 'cursive' }}>
                      Every laugh, every smile, every moment tells our story.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'cursive' }}>
                      With love,<br/>
                      <span className="font-bold">The Gang ✨</span>
                    </p>
                  </div>
                </div>
                
                {/* Small decorative elements */}
                <div className="absolute top-2 left-2 text-pink-400 text-xs">💝</div>
                <div className="absolute bottom-2 right-2 text-pink-400 text-xs">🌟</div>
                
                {/* Sticky note label */}
                <div className="absolute -top-3 -left-3 bg-orange-400 text-white px-2 py-1 text-xs rounded transform -rotate-12 shadow-lg" style={{ fontFamily: 'cursive' }}>
                  Special Note!
                </div>
              </div>
            </div>

            {/* Spotify Embed */}
            <div className="col-span-8 relative">
              <div 
                className="bg-gradient-to-br from-green-800 to-green-900 p-4 rounded-xl shadow-xl transform rotate-1 hover:rotate-0 transition-all duration-300"
                style={{ aspectRatio: '16/9' }}
              >
                <iframe 
                  data-testid="embed-iframe" 
                  style={{ borderRadius: '12px' }} 
                  src="https://open.spotify.com/embed/track/5WOSNVChcadlsCRiqXE45K?utm_source=generator" 
                  width="100%" 
                  height="200" 
                  frameBorder="0" 
                  allowFullScreen="" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                />
                <div className="absolute -top-3 -left-3 bg-green-400 text-black px-3 py-1 text-sm rounded transform -rotate-12 shadow-lg" style={{ fontFamily: 'cursive' }}>
                  Our Playlist 🎵
                </div>
              </div>
            </div>

            {/* Text elements and stickers - updated for dark theme */}
            <div className="col-span-12 relative h-32">
              <div className="absolute top-4 left-20 transform -rotate-3">
                <div className="bg-yellow-300 p-3 rounded shadow-lg border-l-4 border-yellow-500">
                  <p className="text-sm text-gray-800" style={{ fontFamily: 'cursive' }}>
                    "One day we spent together that became a lifetime of memories... 💕"
                  </p>
                </div>
              </div>
              
              <div className="absolute top-8 right-32 transform rotate-6">
                <div className="bg-pink-300 p-2 rounded-full shadow-lg">
                  <span className="text-2xl">🎮</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rotate-1">
                <div className="bg-gray-800 border-2 border-red-400 px-4 py-2 rounded shadow-lg border-dashed">
                  <p className="text-center font-bold text-red-400" style={{ fontFamily: 'cursive' }}>
                    18-07-2024
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Floating decorative elements */}
      <div className="fixed bottom-10 right-10 pointer-events-none">
        <div className="relative">
          <div className="text-4xl lg:text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🌟</div>
          <div className="absolute -top-4 -right-4 text-2xl lg:text-4xl animate-bounce" style={{ animationDelay: '1s' }}>✨</div>
          <div className="absolute -bottom-2 -left-2 text-xl lg:text-3xl animate-bounce" style={{ animationDelay: '2s' }}>💫</div>
        </div>
      </div>

      {/* Vinyl Record Player - Bottom Right */}
      <div className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-20">
        <div className="relative w-24 h-24 lg:w-32 lg:h-32">
          {/* Vinyl Record */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-full shadow-2xl animate-spin" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}>
            {/* Record grooves */}
            <div className="absolute inset-2 border border-gray-600 rounded-full opacity-30"></div>
            <div className="absolute inset-4 border border-gray-600 rounded-full opacity-20"></div>
            <div className="absolute inset-6 border border-gray-600 rounded-full opacity-15"></div>
            
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-600 rounded-full border-2 border-red-800 flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Tonearm */}
          <div className="absolute -top-2 right-2 w-12 lg:w-16 h-1 bg-gray-400 rounded-full transform origin-right rotate-45 shadow-lg">
            <div className="absolute right-0 w-2 h-2 bg-gray-600 rounded-full transform translate-x-1 -translate-y-0.5"></div>
          </div>
          
          {/* Now Playing Label */}
          <div className="absolute -top-8 left-0 bg-gray-800/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap" style={{ fontFamily: 'cursive' }}>
            🎵 Now Playing
          </div>
          
          {/* Song Info - you can replace this with dynamic content later */}
          <div className="absolute -bottom-12 lg:-bottom-16 left-0 right-0 bg-gray-800/90 backdrop-blur-sm text-white text-xs p-2 rounded shadow-lg text-center" style={{ fontFamily: 'cursive' }}>
            <div className="font-semibold">Your Song</div>
            <div className="text-gray-300">Artist Name</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialPage;