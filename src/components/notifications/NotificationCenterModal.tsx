import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, AlertTriangle, Clock, CheckCircle2, FileText, Check } from 'lucide-react';

export const NotificationCenterModal: React.FC = () => {
  const { 
    notifications, 
    isNotificationOpen, 
    setIsNotificationOpen, 
    markNotificationRead, 
    markAllNotificationsRead,
    setActiveContractId,
    setActiveTab,
    t,
    language 
  } = useApp();

  if (!isNotificationOpen) return null;

  const handleNotificationClick = (contractId: string, notifId: string) => {
    markNotificationRead(notifId);
    setActiveContractId(contractId);
    setActiveTab('contracts');
    setIsNotificationOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 text-white shadow-2xl animate-in slide-in-from-bottom-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {t('Notification Center', 'Ibyatanzweho Ubutumwa')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t('Proposal Sec 5.3: Configurable alerts & milestones', 'Ubutumwa n iminsi ntarengwa')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] text-emerald-400 hover:underline px-2 py-1"
            >
              {t('Mark all read', 'Byose byasomwe')}
            </button>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {notifications.map((notif) => {
            const isRead = notif.isRead;
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.contractId, notif.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                  isRead
                    ? 'bg-slate-850/60 border-slate-800 text-slate-400'
                    : 'bg-slate-800 border-slate-700 text-white shadow-sm'
                }`}
              >
                {!isRead && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400" />
                )}

                <div className="flex items-start space-x-2.5">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    notif.type === 'milestone_overdue' || notif.type === 'dispute_raised'
                      ? 'bg-rose-500/15 text-rose-400'
                      : notif.type === 'completion_submitted'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-blue-500/15 text-blue-400'
                  }`}>
                    {notif.type === 'milestone_overdue' || notif.type === 'dispute_raised' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : notif.type === 'completion_submitted' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 pr-3">
                    <span className="text-xs font-bold block mb-0.5">
                      {language === 'rw' ? notif.titleRw : notif.title}
                    </span>
                    <p className="text-[11px] leading-relaxed mb-1.5 opacity-90">
                      {language === 'rw' ? notif.messageRw : notif.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="truncate max-w-[180px]">{notif.contractTitle}</span>
                      <span>{notif.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500">
            {t(
              'Audit Rule: Notification delivery status is logged. Sent messages do not constitute legal proof of acceptance.',
              'Icyitonderwa: Kohereza ubutumwa ntibisobanura ko uwo bwohererejwe yabyemeye.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

