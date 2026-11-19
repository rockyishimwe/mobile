import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, CheckCircle2, Wallet, Scale, Sparkles } from 'lucide-react';

export const MobileTabBar: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const tabs = [
    {
      id: 'contracts' as const,
      label: t('Contracts', 'Amasezerano'),
      icon: FileText
    },
    {
      id: 'tracker' as const,
      label: t('Stages', 'Intambwe'),
      icon: CheckCircle2
    },
    {
      id: 'payments' as const,
      label: t('Payments', 'Kwishyura'),
      icon: Wallet
    },
    {
      id: 'remedies' as const,
      label: t('Remedies', 'Ibihano'),
      icon: Scale
    },
    {
      id: 'assistant' as const,
      label: t('AI Help', 'Ubufasha bwa AI'),
      icon: Sparkles,
      highlight: true
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 z-40">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-emerald-400 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.highlight && !isActive && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
              <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-500/15' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[70px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

