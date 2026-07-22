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
    
    const timeout = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [value, loading]);

  const radius = 60;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
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
        {/* Glow Ring */}
        <svg height="160" width="160" className="transform rotate-[135deg] absolute inset-0 z-0 opacity-30 blur-[8px]">
           <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth + 8}
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

        <svg height="160" width="160" className="transform rotate-[135deg] relative z-10">
          <defs>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <circle
            stroke="url(#trackGradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            style={{ strokeLinecap: "round" }}
            r={normalizedRadius}
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
          />
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
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = (tick / 100) * (270) * (Math.PI / 180);
            const x1 = radius + strokeWidth + Math.cos(angle) * (normalizedRadius - 10);
            const y1 = radius + strokeWidth + Math.sin(angle) * (normalizedRadius - 10);
            const x2 = radius + strokeWidth + Math.cos(angle) * (normalizedRadius - 2);
            const y2 = radius + strokeWidth + Math.sin(angle) * (normalizedRadius - 2);
            return (
              <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="2" />
            );
          })}
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4 z-20">
          {loading ? (
            <div className="h-8 w-16 bg-slate-800 rounded animate-pulse"></div>
          ) : (
            <span className="text-4xl font-bold font-mono tracking-tighter metric-value transition-colors duration-1000" style={{ color }}>
              {Math.round(animatedValue)}<span className="text-xl">%</span>
            </span>
          )}
        </div>

        {/* Small Labels */}
        <div className="absolute bottom-4 left-3 text-[10px] font-mono text-gray-500">0</div>
        <div className="absolute bottom-4 right-3 text-[10px] font-mono text-gray-500">100</div>
      </div>
      
      <div className="text-sm text-gray-400 font-medium -mt-6 uppercase tracking-wider">
        Meeting 60-min Target
      </div>
    </div>
  );
}
