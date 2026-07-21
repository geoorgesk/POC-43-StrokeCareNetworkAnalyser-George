import { Activity } from 'lucide-react';

interface ScenarioSelectorProps {
  scenarios: any[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function ScenarioSelector({ scenarios, activeId, onSelect }: ScenarioSelectorProps) {
  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 rounded animate-shimmer"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {scenarios.map((scenario) => {
        const isActive = activeId === scenario.id;
        
        return (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario.id)}
            className={`
              relative p-3 rounded-lg text-left transition-all overflow-hidden
              ${isActive ? 'bg-cyan/10 cyan-border-glow' : 'glassmorphism hover:bg-slate-800/80'}
            `}
          >
            {isActive && (
              <div className="absolute top-2 right-2 text-cyan">
                <Activity size={12} className="animate-pulse" />
              </div>
            )}
            <div className={`font-semibold text-xs mb-1 ${isActive ? 'text-cyan' : 'text-gray-300'}`}>
              {scenario.name}
            </div>
            <div className="text-[10px] text-gray-500 leading-tight">
              {scenario.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
