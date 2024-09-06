import React from 'react';

function Background({ children }) {
  return (
    <div className="relative min-h-screen">
      {/* Dot grid background */}
      <div className="absolute inset-0 bg-gray-100" style={{
        backgroundImage: `
          radial-gradient(circle, rgba(0, 0, 0, 0.7) 1px, transparent 1px),
          radial-gradient(circle, rgba(0, 0, 0, 0.7) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
      }}>
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default Background;
