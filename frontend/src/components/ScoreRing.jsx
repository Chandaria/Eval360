import React from 'react';

export default function ScoreRing({ score, size = 'sm' }) {
  const isNull = score === null || score === undefined;
  
  // Determine color based on score band
  let bandColor = 'text-rust';
  if (isNull) bandColor = 'text-gray-300';
  else if (score >= 80) bandColor = 'text-emerald';
  else if (score >= 60) bandColor = 'text-amber';

  const isSmall = size === 'sm';
  const sizeClass = isSmall ? 'w-8 h-8' : 'w-[120px] h-[120px]';
  const strokeWidth = isSmall ? 8 : 10;
  const viewBoxSize = 100;
  const radius = (viewBoxSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = isNull ? 0 : circumference - (score / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClass}`}>
      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
        {/* Background track */}
        <circle
          className={isNull ? "text-gray-100" : "text-gold opacity-20"}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
        />
        {/* Progress ring */}
        <circle
          className={`${bandColor} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
        />
      </svg>
      {/* Score Text */}
      <span className={`absolute font-display font-semibold ${isNull ? 'text-gray-400' : 'text-navy'} ${isSmall ? 'text-[10px]' : 'text-3xl'}`}>
        {isNull ? 'N/A' : score}
      </span>
    </div>
  );
}
