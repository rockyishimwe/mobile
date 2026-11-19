import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  ExternalLink, 
  FileText, 
  AlertTriangle, 
  Layers, 
  Clock, 
  RotateCcw,
  Bot,
  User,
  ArrowRight
} from 'lucide-react';

export const AIAssistantView: React.FC = () => {
  const { aiMessages, sendAIMessage, t, setActiveContractId, setActiveTab } = useApp();
  const [inputText, setInputText] = useState('');

  // The 5 Exact questions from Proposal Section 7.1
  const quickQueries = [
    {
      label: t('Expired with unfinished work', 'Ibyarangiye bitarangiye'),
      prompt: 'Show contracts that expired with unfinished work.'
    },
    {
      label: t('Jobs overdue this week', 'Imirimo yatinze muri iki cyumweru'),
      prompt: 'Which jobs are overdue this week?'
    },
    {
      label: t('Frameworks expiring soon', 'Amasezerano rusange ari hafi kurangira'),
      prompt: 'Which framework agreements expire next month?'
    },
    {
      label: t('Summarise contract changes', 'Incamake y impinduka z amasezerano'),
      prompt: 'Summarise the changes to this contract.'
    },
    {
      label: t('How to request extension?', 'Ndasaba nte kongera igihe cy akazi?'),
      prompt: 'How do I request an extension?'
    }
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendAIMessage(inputText.trim());
    setInputText('');
  };

  const handleActionClick = (contractId: string) => {
    setActiveContractId(contractId);
    setActiveTab('contracts');
  };

  return (
    <div className="pb-24 pt-2 flex flex-col h-[calc(100vh-140px)] max-h-[700px]">
      {/* Top Assistant Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 mb-3 shadow-sm shrink-0">
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-bold text-white">
                {t('IZERE AI Contract Assistant', 'Ubufasha bwa AI mu Masezerano')}
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-medium">
                Grounded
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {t('Proposal Sec 7: Bounded retrieval over authorized records', 'Isubiza gusa bishingiye ku masezerano yawe yemewe')}
            </p>
          </div>
        </div>

        {/* AI Acceptance Principle Callout (Proposal Sec 7.3) */}
        <div className="p-2 bg-slate-850 rounded-xl border border-slate-800 text-[10px] text-slate-400 flex items-start space-x-1.5 leading-relaxed">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            {t(
              'Acceptance Principle: Answers are strictly reproducible from verified records. AI never fabricates, alters contracts, or initiates payments.',
              'Itegeko: Ibisubizo byose bishingiye ku nyandiko ziri muri sisitemu. AI ntiyemerewe guhindura amasezerano cyangwa kwishyura.'
            )}
          </span>
        </div>
      </div>

      {/* Suggested Quick Prompt Pills (Proposal Section 7.1) */}
      <div className="shrink-0 mb-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 px-1">
          {t('Frequently Asked Queries (Proposal Sec 7.1):', 'Ibibazo Byerekeranye n Ingingo ya 7.1:')}
        </span>
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => sendAIMessage(item.prompt)}
              className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl text-[11px] whitespace-nowrap transition-all shadow-sm active:scale-95 flex items-center space-x-1 shrink-0"
            >
              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2">
        {aiMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-emerald-950 border border-emerald-700 text-emerald-400'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Body Text */}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Grounded Records Cards (Proposal Sec 7.2 Traceability) */}
                {msg.groundedRecords && msg.groundedRecords.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>{t('Grounded Records & Citations:', 'Inyandiko Zashingiweho:')}</span>
                    </span>

                    {msg.groundedRecords.map((rec, rIdx) => (
                      <div
                        key={rIdx}
                        onClick={() => handleActionClick(rec.contractId)}
                        className="p-2 bg-slate-850 hover:bg-slate-800 rounded-xl border border-slate-750 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] text-emerald-400 font-bold">
                            {rec.contractId}
                          </span>
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                            {rec.status}
                          </span>
                        </div>
                        <span className="text-white font-semibold text-[11px] block line-clamp-1">
                          {rec.contractTitle}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {rec.detail}
                        </p>
                        {rec.clauseReference && (
                          <span className="text-[9px] text-slate-500 italic block mt-1">
                            • {rec.clauseReference}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Interactive Action Link */}
                {msg.suggestedAction && (
                  <button
                    onClick={() => handleActionClick(msg.suggestedAction!.contractId)}
                    className="mt-2.5 w-full py-1.5 px-3 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-xl text-[11px] text-emerald-300 font-semibold flex items-center justify-center space-x-1 transition-colors"
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                <span className="text-[9px] text-slate-500 block text-right mt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Query Input Box */}
      <form onSubmit={handleSend} className="shrink-0 pt-2 border-t border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('Ask about contracts, late jobs, clauses...', 'Baza ikibazo ku masezerano yawe...')}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-1.5 p-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};

