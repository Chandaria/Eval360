import React from 'react';

export default function ScoreRing({ score, size = 120, strokeWidth = 10 }) {
  // Determine color based on score band
  let color = 'text-gold'; // default fallback
  if (score > 75) color = 'text-emerald-500';
  else if (score >= 50) color = 'text-amber-500';
  else color = 'text-rose-500'; // rust/poor

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background track */}
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress ring */}
        <circle
          className={`${color} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Score Text */}
      <span className="absolute text-3xl font-display font-semibold text-navy">
        {score}
      </span>
    </div>
  );
}
