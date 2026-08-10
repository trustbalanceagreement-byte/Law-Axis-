import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Users,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  MessageSquare,
  IndianRupee,
  Power,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const LawyerDashboard: React.FC = () => {
  const {
    currentLawyerId,
    lawyers,
    appointments,
    conversations,
    updateLawyerProfile,
    updateAppointmentStatus,
    setLawyerTab,
    language,
    t,
  } = useApp();

  const currentLawyer = lawyers.find((l) => l.id === currentLawyerId) || lawyers[0];

  const pendingApps = appointments.filter(
    (a) => a.lawyerId === currentLawyer.id && a.status === 'pending'
  );
  const confirmedApps = appointments.filter(
    (a) => a.lawyerId === currentLawyer.id && a.status === 'confirmed'
  );
  const completedApps = appointments.filter(
    (a) => a.lawyerId === currentLawyer.id && a.status === 'completed'
  );

  const totalEarnings = 0;

  const handleToggleOnline = () => {
    updateLawyerProfile({
      availability: {
        ...currentLawyer.availability,
        isOnlineNow: !currentLawyer.availability.isOnlineNow,
      },
    });
  };

  return (
    <div className="space-y-6 pb-20 text-slate-100">
      {/* Welcome Banner & Online Toggle */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 p-6 rounded-3xl border border-blue-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentLawyer.avatar}
            alt={currentLawyer.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-400 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {language === 'bn' ? currentLawyer.nameBn : currentLawyer.name}
              </h1>
              <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
            </div>

            <p className="text-xs text-blue-300 font-medium mt-0.5">
              {language === 'bn' ? currentLawyer.titleBn : currentLawyer.title}
            </p>

            <p className="text-[11px] text-slate-400 mt-1">
              {currentLawyer.barAssociation}
            </p>
          </div>
        </div>

        {/* Online Readiness Toggle */}
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 w-full md:w-auto">
          <div>
            <span className="text-xs font-bold text-white block">
              {currentLawyer.availability.isOnlineNow
                ? t('নতুন ক্লায়েন্ট গ্রহণের জন্য প্রস্তুত', 'Accepting New Clients')
                : t('অফলাইন মোড', 'Offline Mode')}
            </span>
            <span className="text-[10px] text-slate-400">
              {currentLawyer.availability.isOnlineNow
                ? t('ইউজাররা এখন আপনাকে সরাসরি বার্তা ও কল দিতে পারবেন', 'Visible in online active directory')
                : t('বর্তমানে নতুন কোনো রিকোয়েস্ট আসছে না', 'Not visible for instant calls')}
            </span>
          </div>

          <button
            onClick={handleToggleOnline}
            className={`p-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all shadow-md ${
              currentLawyer.availability.isOnlineNow
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{currentLawyer.availability.isOnlineNow ? t('অনলাইন', 'ONLINE') : t('অফলাইন', 'OFFLINE')}</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">{t('পেন্ডিং বুকিং', 'Pending Requests')}</span>
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-white">{pendingApps.length}</span>
          <p className="text-[10px] text-slate-400">{t('নতুন ক্লায়েন্ট রিকোয়েস্ট', 'Awaiting review')}</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">{t('নিশ্চিত কনসালটেশন', 'Confirmed Slots')}</span>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-white">{confirmedApps.length}</span>
          <p className="text-[10px] text-slate-400">{t('আসন্ন সময়সূচি', 'Scheduled upcoming')}</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">{t('গড় ইউজার রেটিং', 'Rating Score')}</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-white">{currentLawyer.rating} ★</span>
          <p className="text-[10px] text-slate-400">({currentLawyer.totalReviews} {t('রিভিউ', 'reviews')})</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">{t('মোট কনসালটেশন আয়', 'Consultation Income')}</span>
            <IndianRupee className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-amber-400">₹{totalEarnings}</span>
          <p className="text-[10px] text-slate-400">{t('চলতি মাস', 'Current Month')}</p>
        </div>
      </div>

      {/* Pending Client Requests Queue */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>{t('নতুন ক্লায়েন্ট অ্যাপয়েন্টমেন্ট আবেদন', 'Incoming Client Appointment Requests')}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {t('ক্লায়েন্টদের আবেদনের উপর ভিত্তি করে বুকিং গ্রহণ বা সময় পুনর্নির্ধারণ করুন', 'Accept or manage pending client bookings')}
            </p>
          </div>

          <button
            onClick={() => setLawyerTab('appointments')}
            className="text-xs text-blue-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>{t('সব দেখুন', 'View All')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingApps.length === 0 ? (
          <div className="text-center py-8 bg-slate-950/50 rounded-xl border border-slate-800/80 text-xs text-slate-400">
            {t('বর্তমানে কোনো পেন্ডিং আবেদন নেই।', 'No pending client requests right now.')}
          </div>
        ) : (
          <div className="space-y-3">
            {pendingApps.map((app, idx) => (
              <div
                key={`dash-app-${app.id || idx}-${idx}`}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{app.userName}</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                      {app.consultationMode.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-300 font-medium mt-1">
                    {t('বিষয়:', 'Case Subject:')} {app.caseType}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {t('তারিখ ও সময়:', 'Requested Time:')} <strong className="text-white">{app.date} ({app.timeSlot})</strong>
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {t('ফোন:', 'Phone:')} {app.userPhone}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateAppointmentStatus(app.id, 'confirmed')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                  >
                    {t('বুকিং গ্রহণ করুন', 'Accept Booking')}
                  </button>

                  <button
                    onClick={() => updateAppointmentStatus(app.id, 'cancelled')}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs font-semibold transition-colors"
                  >
                    {t('বাতিল', 'Reject')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
