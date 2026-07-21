"use client";

import { useEffect, useState, useRef } from "react";
import { Activity } from "lucide-react";
import MainStage from "@/components/MainStage";
import IntelligenceSidebar from "@/components/IntelligenceSidebar";

export default function DashboardPage() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [scenarioId, setScenarioId] = useState("full_network");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initial fetch
  useEffect(() => {
    // Simulated fetch for scenarios
    setTimeout(() => {
      setScenarios([
        { id: "full_network", name: "Full Network", description: "All active hospitals" },
        { id: "peak_hours", name: "Peak Hours", description: "08:00 - 18:00 load" },
        { id: "weekend", name: "Weekend", description: "Reduced staffing models" },
        { id: "reroute", name: "Reroute Active", description: "Bypass full centers" }
      ]);
    }, 200);
  }, []);

  // Fetch data when scenario changes
  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    const timer = setTimeout(() => {
      setData({
        scenario: scenarioId,
        metrics: {
          avgDTN: Math.floor(Math.random() * 40) + 45, // 45-85
          meetingTarget: Math.floor(Math.random() * 50) + 30, // 30-80
          thrombolysisRate: Math.floor(Math.random() * 15) + 10, // 10-25
          goodOutcomeRate: Math.floor(Math.random() * 30) + 40, // 40-70
        }
      });
      setLoading(false);
      
      showToast(`Scenario changed to: ${scenarioId}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [scenarioId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-obsidian text-gray-100">
      {/* Header Bar */}
      <header className="h-14 bg-navy border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan/10 rounded border border-cyan/30 text-cyan">
            <Activity size={18} className="animate-pulse-slow" />
          </div>
          <h1 className="font-semibold text-sm tracking-wide text-gray-200">
            REAL RAILS INTELLIGENCE
            <span className="text-gray-500 mx-2">|</span>
            <span className="text-gray-400 font-normal">Stroke Care Network Analyser</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-cyan animate-pulse"></div>
            <span className="text-xs font-mono text-cyan">SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* 70% Main Stage */}
        <div className="flex-[7] min-w-0 overflow-y-auto">
          <MainStage data={data} loading={loading} />
        </div>

        {/* 30% Intelligence Sidebar */}
        <div className="flex-[3] min-w-[320px] max-w-[450px] border-l border-slate-800 bg-navy overflow-y-auto">
          <IntelligenceSidebar 
            scenarioId={scenarioId}
            setScenarioId={setScenarioId}
            data={data}
            loading={loading}
            scenarios={scenarios}
          />
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glassmorphism px-4 py-3 rounded-lg flex items-center gap-3 animate-slide-in-toast cyan-border-glow">
          <div className="text-cyan">
            <Activity size={16} />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
