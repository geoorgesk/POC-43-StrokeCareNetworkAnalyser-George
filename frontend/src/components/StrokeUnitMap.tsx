import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import map components to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface StrokeUnitMapProps {
  data: any;
}

export default function StrokeUnitMap({ data }: StrokeUnitMapProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[400px] w-full bg-slate-900/50 rounded-lg animate-pulse"></div>;
  }

  // Generate some dummy hospitals in the Gulf region
  const hospitals = [
    { name: "Dubai General", lat: 25.2048, lng: 55.2708, dtn: data?.metrics?.avgDTN - 5 || 55, rate: 18, size: 20 },
    { name: "Abu Dhabi Central", lat: 24.4539, lng: 54.3773, dtn: data?.metrics?.avgDTN + 10 || 70, rate: 15, size: 25 },
    { name: "Riyadh Stroke Center", lat: 24.7136, lng: 46.6753, dtn: data?.metrics?.avgDTN - 10 || 50, rate: 22, size: 30 },
    { name: "Doha Medical", lat: 25.2854, lng: 51.5310, dtn: data?.metrics?.avgDTN + 25 || 85, rate: 12, size: 15 },
    { name: "Kuwait Hospital", lat: 29.3759, lng: 47.9774, dtn: data?.metrics?.avgDTN || 60, rate: 16, size: 18 },
  ];

  const getColor = (dtn: number) => {
    if (dtn <= 60) return "#22C55E";
    if (dtn <= 80) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-slate-800 relative z-0">
      <MapContainer 
        center={[25.0, 50.0]} 
        zoom={5} 
        style={{ height: '100%', width: '100%', backgroundColor: '#030712' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {hospitals.map((h, i) => (
          <CircleMarker
            key={i}
            center={[h.lat, h.lng]}
            radius={h.size / 2}
            pathOptions={{ 
              fillColor: getColor(h.dtn), 
              fillOpacity: 0.7, 
              color: getColor(h.dtn), 
              weight: 2 
            }}
          >
            <Popup className="real-rails-popup">
              <div className="bg-navy p-3 rounded-lg border border-slate-700 min-w-[200px]">
                <h3 className="font-bold text-white mb-2">{h.name}</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-gray-400">DTN Time:</div>
                  <div className="font-mono font-bold" style={{ color: getColor(h.dtn) }}>{h.dtn} min</div>
                  
                  <div className="text-gray-400">Thrombolysis:</div>
                  <div className="text-white font-mono">{h.rate}%</div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      
      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 bg-navy/90 backdrop-blur border border-slate-700 p-3 rounded-lg z-[1000] text-xs">
        <h4 className="text-gray-300 font-semibold mb-2">DTN Status</h4>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <span className="text-gray-400">&le; 60m (On Target)</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-warning"></div>
          <span className="text-gray-400">61-80m (At Risk)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-critical"></div>
          <span className="text-gray-400">&gt; 80m (Critical)</span>
        </div>
      </div>
      
      {/* Fix popup styling globally since we can't easily scope it inside the Popup component */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: #0B1117;
          border: 1px solid #1F2937;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .leaflet-popup-content {
          margin: 0;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #9CA3AF;
          padding: 8px 8px 0 0;
        }
      `}} />
    </div>
  );
}
