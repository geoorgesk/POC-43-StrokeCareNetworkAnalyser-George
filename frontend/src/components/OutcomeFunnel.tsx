import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface OutcomeFunnelProps {
  data: any;
}

export default function OutcomeFunnel({ data }: OutcomeFunnelProps) {
  const goodPct = data?.metrics?.goodOutcomeRate || 50;
  
  // Distribute based on good outcome rate
  const chartData = [
    { name: 'mRS 0 (No symptoms)', value: Math.floor(goodPct * 0.4), color: '#22C55E' },
    { name: 'mRS 1 (No significant disability)', value: Math.floor(goodPct * 0.4), color: '#4ADE80' },
    { name: 'mRS 2 (Slight disability)', value: Math.floor(goodPct * 0.2), color: '#86EFAC' },
    { name: 'mRS 3 (Moderate disability)', value: Math.floor((100 - goodPct) * 0.3), color: '#FCD34D' },
    { name: 'mRS 4 (Moderately severe)', value: Math.floor((100 - goodPct) * 0.3), color: '#F59E0B' },
    { name: 'mRS 5 (Severe disability)', value: Math.floor((100 - goodPct) * 0.2), color: '#EF4444' },
    { name: 'mRS 6 (Dead)', value: Math.floor((100 - goodPct) * 0.2), color: '#991B1B' },
  ];

  return (
    <div className="w-full h-32">
      <div className="flex justify-between items-end mb-2">
        <div className="text-xs text-gray-400 font-mono">
          Good outcome (mRS 0-2): <span className="text-success font-bold">{goodPct}%</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          layout="vertical" 
          data={chartData} 
          margin={{ top: 0, right: 30, left: 150, bottom: 0 }}
          barSize={20}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            width={140}
          />
          <Tooltip 
            cursor={{ fill: '#1F2937', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#0B1117', border: '1px solid #1F2937', borderRadius: '8px' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#9CA3AF', fontSize: 10, formatter: (val: number) => `${val}%` }}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
