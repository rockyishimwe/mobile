import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, User, ChevronDown, Check, Globe, Smartphone, Monitor } from 'lucide-react';
import { Role } from '../../types';

export const MobileHeader: React.FC = () => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    t, 
    unreadNotificationCount, 
    setIsNotificationOpen,
    viewMode,
    toggleViewMode 
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roleLabels: Record<Role, { title: string; subtitle: string; tag: string }> = {
    worker: {
      title: 'Jean-Pierre Nsengimana',
      subtitle: t('Service Provider / Mason', 'Umutekinisiye / Umwubatsi'),
      tag: t('Worker', 'Umukozi')
    },
    client: {
      title: 'Diane Uwera',
      subtitle: t('Property Owner / Payer', 'Nyirubwite / Umukiriya'),
      tag: t('Client', 'Umukiriya')
    },
    cooperative: {
      title: 'Kigali Artisans Coop',
      subtitle: t('SME / Cooperative Lead', 'Umuyobozi wa Koperative'),
      tag: t('Cooperative', 'Koperative')
    }
  };

  const currentRoleInfo = roleLabels[role];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-4 py-3 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-base shadow-sm">
            I
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold tracking-tight text-lg text-white">IZERE</span>
              <span className="text-[10px] font-medium bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                RW
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">
              {t('Clear contracts. Visible progress.', 'Amasezerano asobanutse. Umurimo ugaragara.')}
            </p>
          </div>
        </div>

        {/* Action Controls: Language, Notifications, View Mode */}
        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'rw' : 'en')}
            className="flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700"
            title="Toggle Language (English / Ikinyarwanda)"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">{language.toUpperCase()}</span>
          </button>

          {/* View Mode Toggle */}
          <button
            onClick={toggleViewMode}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title={viewMode === 'mobile-frame' ? 'Switch to Full Screen View' : 'Switch to Phone Frame View'}
          >
            {viewMode === 'mobile-frame' ? (
              <Monitor className="w-4 h-4 text-slate-300" />
            ) : (
              <Smartphone className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Role Switcher Pill */}
      <div className="relative mt-2">
        <button
          onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
          className="w-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 flex items-center justify-between text-left transition-all"
        >
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-white truncate">{currentRoleInfo.title}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-medium">
                  {currentRoleInfo.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{currentRoleInfo.subtitle}</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        </button>

        {/* Role Switcher Dropdown */}
        {isRoleDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-700/60">
            <div className="px-3 py-1.5 bg-slate-900/60 text-[10px] uppercase font-bold text-slate-400">
              {t('Switch Demo Persona (Proposal Sec 4.1)', 'Guhindura Uruhare rwawe')}
            </div>

            {(['worker', 'client', 'cooperative'] as Role[]).map((r) => {
              const info = roleLabels[r];
              const isSelected = role === r;
              return (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-700/50 transition-colors ${
                    isSelected ? 'bg-emerald-950/40' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {info.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                        {info.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{info.subtitle}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

