import { Database, LineChart, Server } from 'lucide-react';

interface SourceConfidencePanelProps {
  loading?: boolean;
}

export default function SourceConfidencePanel({ loading }: SourceConfidencePanelProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 rounded animate-shimmer w-full bg-slate-800/50"></div>
        ))}
      </div>
    );
  }

  const sources = [
    { name: "SITS Registry API", type: "Registry", conf: 98, icon: Database },
    { name: "Angels Initiative Data", type: "Benchmark", conf: 95, icon: LineChart },
    { name: "Real-time HL7 Feed", type: "Live", conf: 76, icon: Server },
  ];

  const getColor = (conf: number) => {
    if (conf > 90) return "bg-success";
    if (conf > 70) return "bg-warning";
    return "bg-critical";
  };

  return (
    <div className="space-y-3">
      {sources.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="bg-black/20 p-3 rounded border border-slate-800/50">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Icon size={12} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-300">{s.name}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-gray-400">
                {s.type}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getColor(s.conf)} transition-all duration-1000`}
                  style={{ width: `${s.conf}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: getColor(s.conf).replace('bg-', 'var(--color-') + ')' }}>
                {s.conf}%
              </span>
            </div>
          </div>
        );
      })}
      
      <div className="mt-4 text-[10px] text-gray-500 text-center italic">
        Data fusion powered by Real Rails Intelligence Engine v2.4
      </div>
    </div>
  );
}
