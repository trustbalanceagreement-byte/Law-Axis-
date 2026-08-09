import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Scale, Bell, User, CheckCircle2, Trash2, X, CalendarCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    userProfile,
    lawyers,
    currentLawyerId,
    setUserTab,
    setLawyerTab,
    notifications,
    clearAllNotifications,
    markNotificationsAsRead,
    t,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLawyer = lawyers.find((l) => l.id === currentLawyerId) || lawyers[0];
  const activeRole = role || 'user';
  const currentRecipientId = activeRole === 'lawyer' ? currentLawyerId : userProfile?.id || 'user-001';

  const avatar = activeRole === 'lawyer' ? currentLawyer?.avatar : userProfile?.avatar;
  const displayName = activeRole === 'lawyer' ? currentLawyer?.name : userProfile?.name;

  // Filter notifications strictly for the active role & active recipient
  const filteredNotifications = notifications.filter((n) => {
    if (n.recipientRole !== activeRole) return false;
    if (n.recipientId && currentRecipientId && n.recipientId !== currentRecipientId) return false;
    return true;
  });

  const unreadCount = filteredNotifications.filter((n) => !n.isRead).length;

  const handleToggleNotifications = () => {
    if (!showNotifications) {
      markNotificationsAsRead(activeRole, currentRecipientId);
    }
    setShowNotifications((prev) => !prev);
  };

  const handleClearAll = () => {
    clearAllNotifications(activeRole, currentRecipientId);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (role === 'lawyer') {
      setLawyerTab('profile');
    } else {
      if (!role) setRole('user');
      setUserTab('profile');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 px-3 sm:px-4 py-2 sm:py-2.5 shadow-xs w-full max-w-full overflow-visible">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 relative">
        {/* Logo & Platform Name */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
            <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 block leading-none">
              LAW AXIS
            </span>
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative" ref={dropdownRef}>
          {/* Interactive Notification Bell */}
          <div className="relative">
            <button
              onClick={handleToggleNotifications}
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer focus:outline-none"
              title={t('নোটিফিকেশন দেখুন', 'View Notifications')}
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Panel Header */}
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-sm">
                      Notifications
                    </span>
                    {filteredNotifications.length > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {filteredNotifications.length}
                      </span>
                    )}
                  </div>

                  {filteredNotifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 px-2.5 py-1 rounded-lg border border-red-800/50 transition-colors font-medium cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Bell className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-xs font-medium text-slate-600">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((notif, idx) => (
                      <div
                        key={`${notif.id}-${idx}`}
                        className="p-3.5 hover:bg-slate-50 transition-colors flex gap-3 items-start"
                      >
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {notif.userName || notif.lawyerName || notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed font-normal">
                            {notif.message}
                          </p>
                          {notif.appointmentId && (
                            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                              <CalendarCheck className="w-3 h-3" />
                              <span>
                                {notif.recipientRole === 'lawyer'
                                  ? 'New Appointment Booking'
                                  : 'Appointment Confirmed'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User / Lawyer Profile Avatar Button in Header */}
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer focus:outline-none shrink-0"
            title={t('প্রোফাইলে যান', 'Go to Profile')}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={displayName || 'Profile'}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-200 shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
