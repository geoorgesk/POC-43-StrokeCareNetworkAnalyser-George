import { Clock, Target, Syringe, Heart } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import StrokeCascade from './StrokeCascade';
import DoorToNeedleChart from './DoorToNeedleChart';
import ThrombolysisRateTrend from './ThrombolysisRateTrend';
import OutcomeFunnel from './OutcomeFunnel';
import StrokeUnitMap from './StrokeUnitMap';
import HospitalBenchmarkTable from './HospitalBenchmarkTable';

interface MainStageProps {
  data: any;
  loading: boolean;
}

const MetricCard = ({ title, value, unit, icon: Icon, color, loading }: any) => {
  const animatedValue = useCountUp(loading ? 0 : value);
  
  return (
    <div className="glassmorphism rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-110`} style={{ backgroundColor: color }}></div>
      <div className="flex justify-between items-start">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <div className="p-2 rounded-lg bg-slate-800/50" style={{ color }}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        {loading ? (
          <div className="h-8 w-16 rounded animate-shimmer"></div>
        ) : (
          <>
            <span className="text-3xl font-bold tracking-tight text-white">{animatedValue}</span>
            <span className="text-gray-400 font-mono text-sm">{unit}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default function MainStage({ data, loading }: MainStageProps) {
  return (
    <div className="p-6 flex flex-col gap-6">
      {/* TOP ROW: Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard 
          title="Avg DTN Time" 
          value={data?.metrics?.avgDTN || 0} 
          unit="min" 
          icon={Clock} 
          color={data?.metrics?.avgDTN <= 60 ? "#22C55E" : (data?.metrics?.avgDTN <= 80 ? "#F59E0B" : "#EF4444")}
          loading={loading}
        />
        <MetricCard 
          title="% Meeting Target" 
          value={data?.metrics?.meetingTarget || 0} 
          unit="%" 
          icon={Target} 
          color="#38BDF8"
          loading={loading}
        />
        <MetricCard 
          title="Thrombolysis Rate" 
          value={data?.metrics?.thrombolysisRate || 0} 
          unit="%" 
          icon={Syringe} 
          color="#818CF8"
          loading={loading}
        />
        <MetricCard 
          title="Good Outcome Rate" 
          value={data?.metrics?.goodOutcomeRate || 0} 
          unit="%" 
          icon={Heart} 
          color="#22C55E"
          loading={loading}
        />
      </div>

      {/* SECOND ROW: Stroke Cascade */}
      <div className="glassmorphism rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide">STROKE TIME CASCADE</h2>
        {loading ? <div className="h-24 w-full rounded animate-shimmer" /> : <StrokeCascade data={data} />}
      </div>

      {/* THIRD ROW: Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glassmorphism rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide">DOOR-TO-NEEDLE DISTRIBUTION</h2>
          {loading ? <div className="h-64 w-full rounded animate-shimmer" /> : <DoorToNeedleChart data={data} />}
        </div>
        <div className="glassmorphism rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide">NETWORK THROMBOLYSIS TREND</h2>
          {loading ? <div className="h-64 w-full rounded animate-shimmer" /> : <ThrombolysisRateTrend data={data} />}
        </div>
      </div>

      {/* FOURTH ROW: Outcomes */}
      <div className="glassmorphism rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide">90-DAY DISABILITY OUTCOMES (mRS)</h2>
        {loading ? <div className="h-32 w-full rounded animate-shimmer" /> : <OutcomeFunnel data={data} />}
      </div>

      {/* FIFTH ROW: Map */}
      <div className="glassmorphism rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide">STROKE UNIT COVERAGE MAP</h2>
        {loading ? <div className="h-[400px] w-full rounded animate-shimmer" /> : <StrokeUnitMap data={data} />}
      </div>

      {/* SIXTH ROW: Table */}
      <div className="glassmorphism rounded-xl p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide">HOSPITAL-LEVEL BENCHMARKING</h2>
        {loading ? <div className="h-64 w-full rounded animate-shimmer" /> : <HospitalBenchmarkTable data={data} />}
      </div>
    </div>
  );
}
