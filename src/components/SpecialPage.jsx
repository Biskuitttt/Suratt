// src/components/SpecialPage.jsx
import React, { useState, useEffect } from 'react';
import { FirebaseService } from '../services/firebase';

const SpecialPage = ({ specialCode, onBack }) => {
  const [pageData, setPageData] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadSpecialPageData();
  }, [specialCode]);

  const loadSpecialPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load page data and images in parallel
      const [pageDataResult, imagesResult] = await Promise.all([
        FirebaseService.getSpecialCodeData(specialCode),
        FirebaseService.getImagesForCode(specialCode)
      ]);

      if (pageDataResult) {
        setPageData(pageDataResult);
        setImages(imagesResult);
      } else {
        setError('Special code not found');
      }
    } catch (err) {
      setError('Failed to load special page');
      console.error('Error loading special page:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
          <p className="text-white text-xl">Loading special content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900 z-50 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back
        </button>
        <h1 className="text-2xl font-bold text-white">
          {pageData?.title || `Special Code: ${specialCode}`}
        </h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full p-8">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {pageData?.welcomeMessage || 'Welcome to Secret Area!'}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {pageData?.description || 'You have unlocked exclusive content!'}
          </p>
        </div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="relative w-full max-w-4xl">
            {/* Main Image Display */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
              <div className="relative h-96 overflow-hidden rounded-xl">
                <img
                  src={images[currentImageIndex]?.url || '/placeholder.jpg'}
                  alt={images[currentImageIndex]?.title || 'Special Image'}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Image Title & Description */}
              {images[currentImageIndex] && (
                <div className="mt-4 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {images[currentImageIndex].title}
                  </h3>
                  {images[currentImageIndex].description && (
                    <p className="text-gray-300">
                      {images[currentImageIndex].description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 overflow-x-auto pb-4">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-white scale-110'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Special Content */}
        {pageData?.specialContent && (
          <div className="mt-8 max-w-2xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Special Message</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {pageData.specialContent}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-gray-400">
          Thank you for discovering our secret! 🎉
        </p>
      </footer>
    </div>
  );
};

export default SpecialPage;