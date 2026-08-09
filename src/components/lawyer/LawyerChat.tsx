import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, Paperclip, User, ArrowLeft } from 'lucide-react';

export const LawyerChat: React.FC = () => {
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    markConversationAsRead,
    t,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [showMobileChat, setShowMobileChat] = useState<boolean>(() => !!activeConversationId);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const activeMessages = activeConv ? messages[activeConv.id] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (activeConv) {
      markConversationAsRead(activeConv.id, 'lawyer');
    }
  }, [activeMessages.length, activeConversationId, activeConv?.id]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeConv) return;

    sendMessage(activeConv.id, inputMessage.trim(), 'lawyer');
    setInputMessage('');
  };

  const handleSelectConv = (id: string) => {
    setActiveConversationId(id);
    setShowMobileChat(true);
  };

  return (
    <div className="h-[calc(100dvh-180px)] sm:h-[calc(100vh-140px)] min-h-[460px] max-h-[850px] bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:grid md:grid-cols-3 mb-20 text-slate-800">
      {/* Sidebar - Client Conversations */}
      <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} flex-col h-full bg-slate-50 border-r border-slate-200 min-h-0`}>
        <div className="p-3.5 sm:p-4 border-b border-slate-200 shrink-0">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            <span>{t('ক্লায়েন্ট ইনকোয়ারি চ্যাট', 'Client Inquiries')}</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            {t('আপনার চেম্বারে প্রেরিত আইনি প্রশ্নাবলি', 'Messages from clients & seekers')}
          </p>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-slate-200 min-h-0">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              {t('কোনো ক্লায়েন্ট ইনকোয়ারি নেই।', 'No client inquiries yet.')}
            </div>
          ) : (
            conversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConv(conv.id)}
                  className={`p-3 sm:p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-white border-l-4 border-indigo-600 font-bold' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0 border border-indigo-100">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{conv.userName}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>

                  {conv.unreadCountLawyer > 0 && (
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                      {conv.unreadCountLawyer}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Thread */}
      <div className={`${!showMobileChat ? 'hidden md:flex' : 'flex'} md:col-span-2 flex-col h-full bg-white min-h-0`}>
        {activeConv ? (
          <>
            {/* Header */}
            <div className="p-2.5 sm:p-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden shrink-0"
                  title={t('তালিকায় ফিরুন', 'Back to client list')}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center border border-indigo-100 shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{activeConv.userName}</h3>
                  <p className="text-[10px] text-slate-400 truncate">{t('ক্লায়েন্ট আইডি: user-001', 'Client ID: user-001')}</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-slate-50 min-h-0">
              {activeMessages.map((msg) => {
                const isLawyer = msg.senderRole === 'lawyer';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isLawyer ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-2xl text-xs leading-relaxed ${
                        isLawyer
                          ? 'bg-indigo-600 text-white font-medium rounded-tr-none shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                      }`}
                    >
                      <p className="break-words">{msg.text}</p>
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                title={t('ফাইল যুক্ত করুন', 'Attach Document')}
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('এখানে ক্লায়েন্টের উত্তর লিখুন...', 'Type response to client...')}
                className="flex-1 min-w-0 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 sm:py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{t('পাঠান', 'Send')}</span>
              </button>
            </form>
          </>
        ) : (
          <div className="m-auto text-center p-6 text-slate-400 text-xs">
            {t('কোনো বার্তা নেই।', 'No conversations found.')}
          </div>
        )}
      </div>
    </div>
  );
};

