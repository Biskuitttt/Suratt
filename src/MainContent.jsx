import React from 'react';

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
    </div>
  );
}

export default MainContent;