import React from 'react';
import { ContractStatus, StageStatus } from '../../types';

interface StatusBadgeProps {
  status: ContractStatus | StageStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return { label: 'Active', bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
      case 'in_progress':
        return { label: 'In Progress', bg: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
      case 'completed':
        return { label: 'Completed', bg: 'bg-teal-500/10 text-teal-700 border-teal-500/20' };
      case 'in_review':
        return { label: 'In Review', bg: 'bg-amber-500/10 text-amber-700 border-amber-500/20' };
      case 'awaiting_confirmation':
        return { label: 'Awaiting Signatures', bg: 'bg-purple-500/10 text-purple-700 border-purple-500/20' };
      case 'awaiting_acceptance':
        return { label: 'Awaiting Acceptance', bg: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20' };
      case 'disputed':
        return { label: 'Disputed', bg: 'bg-rose-500/10 text-rose-600 border-rose-500/20 font-semibold' };
      case 'overdue':
        return { label: 'Overdue', bg: 'bg-red-500/10 text-red-600 border-red-500/20 font-semibold' };
      case 'expired':
        return { label: 'Expired', bg: 'bg-slate-500/10 text-slate-600 border-slate-500/20' };
      case 'draft':
      case 'pending':
      default:
        return { label: 'Draft', bg: 'bg-gray-500/10 text-gray-600 border-gray-500/20' };
    }
  };

  const config = getStatusConfig();
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full border ${padding} ${config.bg} font-medium tracking-wide`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {config.label}
    </span>
  );
};

