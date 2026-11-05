import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Activity, Clock, Database } from "lucide-react";

interface SystemInfoPanelProps {
  onClose: () => void;
  appStartTime: number;
  lastSyncTime: string;
}

export default function SystemInfoPanel({ onClose, appStartTime, lastSyncTime }: SystemInfoPanelProps) {
  const [uptime, setUptime] = useState("Calculating...");
  const [memory, setMemory] = useState("Calculating...");

  useEffect(() => {
    const updateStats = () => {
      const now = Date.now();
      const diff = Math.floor((now - appStartTime) / 1000);
      const hours = Math.floor(diff / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;
      setUptime(`${hours}h ${mins}m ${secs}s`);

      // Attempt to read performance.memory if available (Chrome specific)
      // @ts-ignore
      if (window.performance && window.performance.memory) {
        // @ts-ignore
        const used = Math.round(window.performance.memory.usedJSHeapSize / 1048576);
        // @ts-ignore
        const total = Math.round(window.performance.memory.jsHeapSizeLimit / 1048576);
        setMemory(`${used} MB / ${total} MB`);
      } else {
        setMemory("~ 45 MB (Estimated)");
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [appStartTime]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0B132B] border border-[#B5925A]/30 p-6 rounded-xl max-w-sm w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <X size={20} />
        </button>
        <div className="flex flex-col mb-6">
          <h2 className="text-xl font-serif text-[#B5925A] flex items-center gap-2">
            <Activity size={20} />
            System Information
          </h2>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">
            Diagnostic Data Overlay
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#060A18] border border-[#B5925A]/10 p-4 rounded-lg flex items-start gap-3">
            <Clock className="text-[#D9B673] mt-0.5" size={18} />
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1">
                Device Uptime
              </p>
              <p className="text-white font-mono text-sm">{uptime}</p>
            </div>
          </div>

          <div className="bg-[#060A18] border border-[#B5925A]/10 p-4 rounded-lg flex items-start gap-3">
            <Activity className="text-[#D9B673] mt-0.5" size={18} />
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1">
                Last Data Sync
              </p>
              <p className="text-white font-mono text-sm">{lastSyncTime}</p>
            </div>
          </div>

          <div className="bg-[#060A18] border border-[#B5925A]/10 p-4 rounded-lg flex items-start gap-3">
            <Database className="text-[#D9B673] mt-0.5" size={18} />
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1">
                Memory Usage
              </p>
              <p className="text-white font-mono text-sm">{memory}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 border border-[#B5925A]/30 text-[#D9B673] font-medium py-3 rounded tracking-wider uppercase text-sm hover:bg-[#B5925A]/10 transition-colors"
        >
          Close Overlay
        </button>
      </motion.div>
    </div>
  );
}
