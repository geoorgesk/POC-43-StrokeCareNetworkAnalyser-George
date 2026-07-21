import { useEffect, useState } from 'react';

interface RiskGaugeProps {
  value: number; // 0-100
  loading?: boolean;
}

export default function RiskGauge({ value, loading = false }: RiskGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (loading) {
      setAnimatedValue(0);
      return;
    }
    
    // Simple animation
    const timeout = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [value, loading]);

  // Gauge settings
  const radius = 60;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Use a semi-circle gauge (actually about 75% of a circle)
  const arcLength = circumference * 0.75; 
  const strokeDashoffset = arcLength - (animatedValue / 100) * arcLength;

  const getColor = (val: number) => {
    if (val >= 70) return "#22C55E"; // Success
    if (val >= 40) return "#F59E0B"; // Warning
    return "#EF4444"; // Critical
  };

  const color = getColor(animatedValue);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        {/* SVG Gauge */}
        <svg
          height="160"
          width="160"
          className="transform rotate-[135deg]"
        >
          {/* Background track */}
          <circle
            stroke="#1F2937"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            style={{ strokeLinecap: "round" }}
            r={normalizedRadius}
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
          />
          {/* Foreground progress */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            style={{ 
              strokeLinecap: "round",
              strokeDashoffset: isNaN(strokeDashoffset) ? arcLength : strokeDashoffset,
              transition: "stroke-dashoffset 1s ease-in-out, stroke 1s ease-in-out" 
            }}
            r={normalizedRadius}
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          {loading ? (
            <div className="h-8 w-16 bg-slate-800 rounded animate-pulse"></div>
          ) : (
            <span className="text-4xl font-bold font-mono tracking-tighter" style={{ color }}>
              {Math.round(animatedValue)}<span className="text-xl">%</span>
            </span>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-400 font-medium -mt-6 uppercase tracking-wider">
        Meeting 60-min Target
      </div>
    </div>
  );
}
