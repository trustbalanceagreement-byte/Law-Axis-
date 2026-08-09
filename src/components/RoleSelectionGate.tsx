import React from 'react';
import { useApp } from '../context/AppContext';
import { Scale, UserCheck, Briefcase, ShieldCheck, Search, MessageSquare, Star, ArrowRight, Languages } from 'lucide-react';
import { motion } from 'motion/react';

export const RoleSelectionGate: React.FC = () => {
  const { setRole, language, setLanguage, t } = useApp();

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col justify-between items-center p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Header Top Bar */}
      <div className="w-full max-w-5xl flex justify-between items-center z-10 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-900 rounded-lg flex items-center justify-center text-white shadow-xs">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-indigo-950">
            LAW AXIS
          </span>
        </div>

        <button
          onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-xs md:text-sm font-bold shadow-xs"
        >
          <Languages className="w-4 h-4 text-indigo-600" />
          <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
        </button>
      </div>

      {/* Main Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl my-auto text-center z-10 py-8"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-4">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>{t('আইনি পরামর্শ ও বিশ্বস্ত আইনজীবী প্ল্যাটফর্ম', 'Trusted Legal Consultation Platform')}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
          {t('আপনার আইনি প্রয়োজনে সঠিক সহযোগী', 'Your Legal Access Simplified')} <br />
          <span className="text-indigo-600">{t('খুঁজুন সহজে ও সরাসরি', 'Find Advocates & Book Consultations')}</span>
        </h1>

        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          {t(
            'লো অ্যাক্সিস-এ যেকোনো আইনি সমস্যায় সেরা আইনজীবীদের খুঁজুন, লাইভ চ্যাট ও সরাসরি অ্যাপয়েন্টমেন্ট বুক করুন।',
            'LAW AXIS connects citizens with top advocates for instant advice, appointments, and live chat.'
          )}
        </p>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
          {/* Card 1: User Role */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => setRole('user')}
            className="group cursor-pointer p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <UserCheck className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {t('Go as a User', 'Go as a User')}
              </h3>

              <p className="text-slate-500 text-xs mb-5 leading-relaxed">
                {t(
                  'আইনজীবী সার্চ করুন, প্রোফাইল দেখুন, সরাসরি চ্যাট করুন ও অ্যাপয়েন্টমেন্ট বুকিং করুন।',
                  'Search verified advocates, view detailed profiles, live chat, and book appointments.'
                )}
              </p>

              <div className="space-y-2 mb-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t('অভিজ্ঞতা ও কোর্ট এলাকা অনুযায়ী ফিল্টার', 'Filter by Experience & Court Location')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t('ইনস্ট্যান্ট লাইভ চ্যাট সুবিধা', 'Instant Live Messaging Support')}</span>
                </div>
              </div>
            </div>

            <div className="w-full py-3 px-5 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors text-xs sm:text-sm shadow-xs">
              <span>{t('Go as a User', 'Go as a User')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 2: Lawyer Role */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => setRole('lawyer')}
            className="group cursor-pointer p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Briefcase className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {t('Go as a Lawyer', 'Go as a Lawyer')}
              </h3>

              <p className="text-slate-500 text-xs mb-5 leading-relaxed">
                {t(
                  'আপনার অ্যাডভোকেট প্রোফাইল সাজান, নতুন ক্লায়েন্ট পান ও অনলাইন/চেম্বার অ্যাপয়েন্টমেন্ট পরিচালনা করুন।',
                  'Manage your chamber, accept client bookings, manage chat inquiries and edit profile.'
                )}
              </p>

              <div className="space-y-2 mb-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t('চেম্বার ফি ও প্র্যাকটিস কোর্ট ম্যানেজমেন্ট', 'Manage Consultation Fees & Court Badges')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t('অনলাইন / চেম্বার সময়সূচি কনফিগারেশন', 'Configure Online / Chamber Slots')}</span>
                </div>
              </div>
            </div>

            <div className="w-full py-3 px-5 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors text-xs sm:text-sm shadow-xs">
              <span>{t('Go as a Lawyer', 'Go as a Lawyer')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="w-full max-w-5xl text-center text-slate-500 text-xs py-4 border-t border-slate-200 z-10 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© {new Date().getFullYear()} LAW AXIS — Legal Access Simplified</p>
        <p className="text-slate-600 font-medium">
          {t('যেকোনো সময় উপরে সুইচ করে অন্য মোডে যেতে পারবেন', 'You can switch role anytime from the top bar')}
        </p>
      </div>
    </div>
  );
};
