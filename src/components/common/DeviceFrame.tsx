import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { viewMode, toggleViewMode, t } = useApp();

  if (viewMode === 'responsive') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
        <div className="w-full max-w-md min-h-screen bg-slate-950 flex flex-col relative shadow-2xl">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-6 px-3 flex flex-col items-center justify-center">
      {/* Top Demo Bar */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between text-xs text-slate-400 px-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">IZERE Mobile Prototype</span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            Rwanda Pilot
          </span>
        </div>

        <button
          onClick={toggleViewMode}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="text-[11px]">{t('Full Width', 'Ubugari bwose')}</span>
        </button>
      </div>

      {/* Realistic Smartphone Frame Mockup */}
      <div className="w-full max-w-[420px] bg-slate-950 border-[9px] border-slate-800 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden relative flex flex-col ring-1 ring-slate-700/50 min-h-[820px] max-h-[92vh]">
        
        {/* Phone Dynamic Island & Status Bar */}
        <div className="bg-slate-900 px-6 pt-3 pb-1 flex items-center justify-between text-[11px] text-slate-300 select-none z-50 shrink-0">
          <span className="font-bold tracking-tight">09:41</span>
          
          {/* Dynamic Island pill */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center space-x-1.5 px-2">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
          </div>

          <div className="flex items-center space-x-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Scrollable Mobile App Screen */}
        <div className="flex-1 overflow-y-auto bg-slate-950 relative flex flex-col px-3.5">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="bg-slate-900 py-1.5 flex justify-center shrink-0 z-50">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};

