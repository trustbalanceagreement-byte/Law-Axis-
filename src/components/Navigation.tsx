import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, MessageSquare, User, Calendar, Briefcase } from 'lucide-react';
import { UserTab, LawyerTab } from '../types';

export const Navigation: React.FC = () => {
  const {
    role,
    userTab,
    setUserTab,
    lawyerTab,
    setLawyerTab,
    conversations,
    appointments,
    currentLawyerId,
    t,
  } = useApp();

  // Unread message count
  const userUnread = conversations.reduce((acc, c) => acc + c.unreadCountUser, 0);
  const lawyerUnread = conversations.reduce((acc, c) => acc + c.unreadCountLawyer, 0);

  // Pending appointment count for lawyer
  const pendingAppointments = appointments.filter(
    (a) => a.lawyerId === currentLawyerId && a.status === 'pending'
  ).length;

  if (role === 'user') {
    const navItems: { id: UserTab; labelBn: string; labelEn: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
      { id: 'home', labelBn: 'হোম', labelEn: 'Home', icon: Home },
      { id: 'search', labelBn: 'সার্চ', labelEn: 'Search', icon: Search },
      { id: 'chat', labelBn: 'চ্যাট', labelEn: 'Chat', icon: MessageSquare, badge: userUnread },
      { id: 'profile', labelBn: 'প্রোফাইল', labelEn: 'Profile', icon: User },
    ];

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 text-slate-500 py-2 px-4 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = userTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setUserTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all ${
                  isActive ? 'bg-indigo-50 text-indigo-600 font-bold' : 'hover:bg-slate-50 text-slate-500'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2.5 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[10px] mt-1 uppercase tracking-wider font-bold ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>
                  {t(item.labelBn, item.labelEn)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Lawyer Navigation
  const navItems: { id: LawyerTab; labelBn: string; labelEn: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home', icon: Home },
    { id: 'chat', labelBn: 'চ্যাট', labelEn: 'Chat', icon: MessageSquare, badge: lawyerUnread },
    { id: 'appointments', labelBn: 'অ্যাপয়েন্টমেন্ট', labelEn: 'Bookings', icon: Calendar, badge: pendingAppointments },
    { id: 'profile', labelBn: 'প্রোফাইল', labelEn: 'Profile', icon: Briefcase },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 text-slate-500 py-2 px-4 shadow-md">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = lawyerTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setLawyerTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all ${
                isActive ? 'bg-indigo-50 text-indigo-600 font-bold' : 'hover:bg-slate-50 text-slate-500'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] mt-1 uppercase tracking-wider font-bold ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>
                {t(item.labelBn, item.labelEn)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
