import React from 'react';

export default function Logo({ className = '', inverted = false }) {
  const primaryColor = inverted ? '#FAF7EF' : '#101826';
  const secondaryColor = '#B8912F'; // Gold

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Circle Icon */}
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background Circle */}
        <circle cx="32" cy="32" r="24" fill={primaryColor} />
        
        {/* Gold swoosh arc */}
        <path d="M14 22 A28 28 0 0 0 46 58" stroke={secondaryColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M46 58 A28 28 0 0 0 58 26" stroke={secondaryColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        
        {/* 3 Bar Chart */}
        <rect x="22" y="36" width="3.5" height="8" rx="1.5" fill={inverted ? '#101826' : '#FAF7EF'} />
        <rect x="30" y="28" width="3.5" height="16" rx="1.5" fill={inverted ? '#101826' : '#FAF7EF'} />
        <rect x="38" y="20" width="4.5" height="24" rx="2" fill={secondaryColor} />
      </svg>
      
      {/* Text Component */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline leading-none">
          <span className={`font-display font-semibold text-3xl tracking-tight`} style={{ color: primaryColor }}>eval</span>
          <span className={`font-display font-semibold text-3xl tracking-tight`} style={{ color: secondaryColor }}>360</span>
        </div>
        <span className={`text-[0.55rem] font-body tracking-[0.2em] font-semibold mt-1 uppercase ${inverted ? 'text-gray-300' : 'text-gray-500'}`}>
          Supplier Intelligence
        </span>
      </div>
    </div>
  );
}
