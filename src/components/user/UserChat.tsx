import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, Paperclip, CheckCircle2, Calendar, Search, Sparkles, ArrowLeft } from 'lucide-react';

const QUICK_PROMPTS = [
  'I need information about a High Court writ petition regarding land dispute.',
  'What are the legal rules for child custody under family law?',
  'Need consultation to review startup partnership deed agreement.',
  'What is the process and timeline for bail application in High Court?',
];

export const UserChat: React.FC = () => {
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    markConversationAsRead,
    lawyers,
    setSelectedLawyer,
    setBookingLawyer,
    t,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [showMobileChat, setShowMobileChat] = useState<boolean>(() => !!activeConversationId);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const activeMessages = activeConv ? messages[activeConv.id] || [] : [];
  const activeLawyer = activeConv ? lawyers.find((l) => l.id === activeConv.lawyerId) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (activeConv) {
      markConversationAsRead(activeConv.id, 'user');
    }
  }, [activeMessages.length, activeConversationId, activeConv?.id]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeConv) return;

    sendMessage(activeConv.id, inputMessage.trim(), 'user');
    setInputMessage('');
  };

  const handleQuickPrompt = (promptText: string) => {
    if (!activeConv) return;
    sendMessage(activeConv.id, promptText, 'user');
  };

  const handleSelectConv = (id: string) => {
    setActiveConversationId(id);
    setShowMobileChat(true);
  };

  return (
    <div className="h-[calc(100dvh-180px)] sm:h-[calc(100vh-140px)] min-h-[460px] max-h-[850px] bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:grid md:grid-cols-3 mb-20 text-slate-800">
      {/* Sidebar - Conversation List */}
      <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} flex-col h-full bg-slate-50 border-r border-slate-200 min-h-0`}>
        <div className="p-3.5 sm:p-4 border-b border-slate-200 shrink-0">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            <span>{t('আইনজীবী চ্যাট', 'Lawyer Conversations')}</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            {t('আপনার সরাসরি আইনি বার্তা ও কনসালটেশন', 'Direct messaging with Advocates')}
          </p>
        </div>

        <div className="p-2.5 sm:p-3 border-b border-slate-200 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t('চ্যাট খুঁজুন...', 'Search conversations...')}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-slate-200 min-h-0">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              {t('কোনো চ্যাট থ্রেড নেই। যেকোনো আইনজীবীর প্রোফাইল থেকে চ্যাট শুরু করুন।', 'No conversations yet. Start chat from any lawyer profile.')}
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
                  <div className="relative shrink-0">
                    <img
                      src={conv.lawyerAvatar}
                      alt={conv.lawyerName}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-slate-200"
                    />
                    {conv.lawyerOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{conv.lawyerName}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>

                  {conv.unreadCountUser > 0 && (
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                      {conv.unreadCountUser}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Thread Window */}
      <div className={`${!showMobileChat ? 'hidden md:flex' : 'flex'} md:col-span-2 flex-col h-full bg-white min-h-0`}>
        {activeConv ? (
          <>
            {/* Chat Top Header */}
            <div className="p-2.5 sm:p-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden shrink-0"
                  title={t('তালিকায় ফিরুন', 'Back to chat list')}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div
                  onClick={() => activeLawyer && setSelectedLawyer(activeLawyer)}
                  className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
                >
                  <img
                    src={activeConv.lawyerAvatar}
                    alt={activeConv.lawyerName}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-slate-200 group-hover:border-indigo-600 transition-colors shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {activeConv.lawyerName}
                      </h3>
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      {activeConv.lawyerOnline ? t('অনলাইন • উত্তর দেবেন', 'Online • Ready') : t('অফলাইন', 'Offline')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeLawyer && (
                  <button
                    onClick={() => setBookingLawyer(activeLawyer)}
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('অ্যাপয়েন্টমেন্ট বুক', 'Book Slot')}</span>
                    <span className="sm:hidden">{t('বুকিং', 'Book')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-slate-50 min-h-0">
              {/* Top Privacy Disclaimer */}
              <div className="text-center py-1">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md inline-block">
                  🔒 {t('এই চ্যাটে আপনার সমস্ত আইনি তথ্য সম্পূর্ণ সুরক্ষিত', 'Encrypted and confidential legal chat')}
                </span>
              </div>

              {activeMessages.map((msg) => {
                const isUser = msg.senderRole === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-2xl text-xs leading-relaxed ${
                        isUser
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

            {/* Quick Prompt Pills */}
            <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-md bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-600 border border-slate-200 shrink-0 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
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
                placeholder={t('এখানে বার্তা লিখুন...', 'Type your message...')}
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
            {t('কোনো সক্রিয় চ্যাট থ্রেড নির্বাচন করা হয়নি।', 'No active conversation selected.')}
          </div>
        )}
      </div>
    </div>
  );
};

