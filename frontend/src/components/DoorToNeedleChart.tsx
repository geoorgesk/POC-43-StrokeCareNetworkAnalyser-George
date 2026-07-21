import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';

interface DoorToNeedleChartProps {
  data: any;
}

export default function DoorToNeedleChart({ data }: DoorToNeedleChartProps) {
  // Simulate data distribution around the avgDTN
  const avg = data?.metrics?.avgDTN || 60;
  
  const chartData = [
    { range: '0-15', count: Math.max(0, 5 - Math.abs(avg - 10) / 10), color: '#22C55E' },
    { range: '15-30', count: Math.max(0, 15 - Math.abs(avg - 25) / 5), color: '#22C55E' },
    { range: '30-45', count: Math.max(0, 35 - Math.abs(avg - 40) / 2), color: '#22C55E' },
    { range: '45-60', count: Math.max(0, 45 - Math.abs(avg - 55) / 2), color: '#22C55E' },
    { range: '60-75', count: Math.max(0, 30 - Math.abs(avg - 70) / 2), color: '#F59E0B' },
    { range: '75-90', count: Math.max(0, 15 - Math.abs(avg - 85) / 5), color: '#F59E0B' },
    { range: '90-105', count: Math.max(0, 8 - Math.abs(avg - 100) / 10), color: '#EF4444' },
    { range: '>105', count: Math.max(0, 4 - Math.abs(avg - 115) / 20), color: '#EF4444' },
  ].map(d => ({ ...d, count: Math.floor(d.count * 10) }));

  return (
    <div className="w-full h-64">
      <div className="text-xs text-gray-400 mb-2 font-mono">
        Cases meeting target: <span className="text-success font-bold">{data?.metrics?.meetingTarget || 0}%</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
          <XAxis 
            dataKey="range" 
            stroke="#9CA3AF" 
            fontSize={10} 
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={10} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#1F2937', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#0B1117', border: '1px solid #1F2937', borderRadius: '8px' }}
            itemStyle={{ color: '#E5E7EB' }}
          />
          <ReferenceLine x="45-60" stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'top', value: '60m Target', fill: '#EF4444', fontSize: 10 }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
