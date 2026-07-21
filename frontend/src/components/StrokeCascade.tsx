import { Activity, Clock, Hospital, Syringe, Brain, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface StrokeCascadeProps {
  data: any;
}

export default function StrokeCascade({ data }: StrokeCascadeProps) {
  const [activeStep, setActiveStep] = useState(0);

  // Animate through steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 8);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const baseDTN = data?.metrics?.avgDTN || 60;
  
  const steps = [
    { name: "Onset", icon: Brain, time: 0, cumTime: 0, status: "neutral" },
    { name: "EMS Call", icon: Activity, time: 15, cumTime: 15, status: "neutral" },
    { name: "Door", icon: Hospital, time: 25, cumTime: 40, status: "active" },
    { name: "Triage", icon: Stethoscope, time: 10, cumTime: 50, status: "active" },
    { name: "CT Scan", icon: Activity, time: 15, cumTime: 65, status: baseDTN > 70 ? "warning" : "active" },
    { name: "Read", icon: FileText, time: 15, cumTime: 80, status: baseDTN > 80 ? "critical" : "active" },
    { name: "Needle", icon: Syringe, time: 10, cumTime: baseDTN + 40, status: "target" },
    { name: "Outcome", icon: CheckCircle2, time: 0, cumTime: 0, status: "end" }
  ];

  const getStatusColor = (status: string, index: number, isActive: boolean) => {
    if (isActive) return "text-white bg-cyan border-cyan shadow-[0_0_15px_rgba(56,189,248,0.5)]";
    
    switch (status) {
      case "active": return "text-cyan bg-cyan/10 border-cyan/30";
      case "warning": return "text-warning bg-warning/10 border-warning/30";
      case "critical": return "text-critical bg-critical/10 border-critical/30";
      case "target": return "text-success bg-success/10 border-success/30";
      case "end": return "text-indigo bg-indigo/10 border-indigo/30";
      default: return "text-gray-400 bg-slate-800 border-slate-700";
    }
  };

  return (
    <div className="w-full py-4 relative">
      {/* Target Marker */}
      <div className="absolute left-[70%] top-0 bottom-0 border-l-2 border-dashed border-critical z-0 opacity-50">
        <div className="absolute -top-3 -left-10 bg-critical text-white text-[10px] font-bold px-2 py-0.5 rounded">60m TARGET</div>
      </div>

      <div className="flex justify-between items-center relative z-10">
        {steps.map((step, i) => {
          const isTarget = step.name === "Needle";
          const isActive = i === activeStep;
          const Icon = step.icon;
          
          return (
            <React.Fragment key={step.name}>
              {/* Step */}
              <div className="flex flex-col items-center group relative w-16">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                  ${getStatusColor(step.status, i, isActive)}
                `}>
                  <Icon size={16} />
                </div>
                
                <div className="text-[10px] font-medium text-gray-300 mt-2 text-center leading-tight">
                  {step.name}
                </div>
                
                {step.cumTime > 0 && (
                  <div className={`text-[10px] font-mono mt-1 ${isTarget && step.cumTime - 40 > 60 ? 'text-critical font-bold' : 'text-gray-500'}`}>
                    {step.cumTime - 40 > 0 && i >= 2 ? (step.cumTime - 40) : (i < 2 ? `+${step.time}` : '')}m
                  </div>
                )}
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="flex-1 h-1 bg-slate-800 relative -mx-2 -mt-6">
                  {i < activeStep && (
                    <div className="absolute top-0 left-0 h-full bg-cyan w-full shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
                  )}
                  {i === activeStep && (
                    <div className="absolute top-0 left-0 h-full bg-cyan animate-pulse w-full"></div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 mt-6 text-[10px] text-gray-400 justify-center">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan"></span> Optimal</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning"></span> Delay</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-critical"></span> Critical Bottleneck</div>
      </div>
    </div>
  );
}
