import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LawyerCard } from '../LawyerCard';
import { PracticeArea } from '../../types';
import { Search, ShieldAlert, Scale, Sparkles, PhoneCall, CheckCircle2, ArrowRight } from 'lucide-react';

const CATEGORIES: { name: PracticeArea; nameBn: string; icon: string }[] = [
  { name: 'Land & Property', nameBn: 'Land & Property Law', icon: '📜' },
  { name: 'Family & Divorce', nameBn: 'Family & Divorce Law', icon: '👨‍👩‍👧' },
  { name: 'Criminal Law', nameBn: 'Criminal Law & Bail', icon: '⚖️' },
  { name: 'Civil Law', nameBn: 'Civil Law & Contracts', icon: '🏛️' },
  { name: 'Cyber & Digital Security', nameBn: 'Cyber Security Law', icon: '💻' },
  { name: 'Tax, VAT & Customs', nameBn: 'Tax & VAT Legal Advice', icon: '📈' },
  { name: 'Writ & Constitutional', nameBn: 'High Court Writ Petition', icon: '📜' },
  { name: 'Corporate & Commercial', nameBn: 'Corporate Legal Support', icon: '🏢' },
];

export const UserHome: React.FC = () => {
  const { lawyers, setUserTab, language, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserTab('search');
  };

  const handleCategoryClick = (category: PracticeArea) => {
    setUserTab('search');
  };

  const featuredLawyers = lawyers.slice(0, 4);

  return (
    <div className="space-y-8 pb-20 text-slate-800">
      {/* Hero Banner Section */}
      <section className="relative rounded-2xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('ভারতের সুপ্রিম কোর্ট ও হাইকোর্টের আইনজীবী ডিরেক্টরি', 'Supreme Court & High Court Advocates across India')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug mb-2">
            {t('আপনার বিশ্বস্ত আইনি উপদেষ্টা', 'Find Top Legal Advocates in India')} <br />
            <span className="text-indigo-600">{t('খুঁজুন ও অ্যাপয়েন্টমেন্ট নিন', 'Book Consultations Directly')}</span>
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
            {t(
              'লো অ্যাক্সিস-এ যেকোনো আইনি জটিলতায় ভারতের সেরা সুপ্রিম কোর্ট, হাইকোর্ট ও জজ কোর্টের অভিজ্ঞ ভারতীয় আইনজীবীদের প্রোফাইল দেখুন, লাইভ চ্যাট করুন এবং অতি সহজে বুকিং করুন।',
              'Search verified advocates across Indian courts, view transparent client reviews, live chat, and book appointments in one click.'
            )}
          </p>

          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl w-full">
            <div className="relative flex items-center w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('আইনজীবীর নাম, স্পেশালিটি বা কোর্ট...', 'Search lawyer by name, specialty, or court...')}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-22 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs sm:text-sm transition-colors shrink-0"
              >
                {t('খুঁজুন', 'Search')}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <span>{t('আইনি সেবার ক্যাটাগরি', 'Legal Specialty Areas')}</span>
          </h2>
          <button
            onClick={() => setUserTab('search')}
            className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
          >
            <span>{t('সব দেখুন', 'View All')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryClick(cat.name)}
              className="group cursor-pointer p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all text-left flex items-start gap-3"
            >
              <span className="text-xl p-2 rounded-lg bg-indigo-50 border border-indigo-100 group-hover:scale-105 transition-transform shrink-0">
                {cat.icon}
              </span>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {language === 'bn' ? cat.nameBn : cat.name}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">
                  {t('বিশেষজ্ঞ আইনজীবী', 'Verified Advocates')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Helpline Banner */}
      <section className="p-5 rounded-2xl bg-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-900 border border-indigo-800 text-indigo-300 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {t('জরুরি আইনি সহায়তা বা জামিন আবেদন প্রয়োজন?', 'Urgent Legal Aid or Emergency Hearing?')}
            </h3>
            <p className="text-xs text-indigo-200 mt-0.5">
              {t('আমাদের অন-কল সিনিয়র আইনজীবীদের সাথে সরাসরি কথা বলুন বা লাইভ চ্যাটে যুক্ত হন।', 'Connect with available Advocates on-call right now.')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setUserTab('chat')}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shrink-0 flex items-center gap-2 transition-all shadow-xs"
        >
          <PhoneCall className="w-4 h-4" />
          <span>{t('জরুরি পরামর্শ নিন', 'Emergency Advice')}</span>
        </button>
      </section>

      {/* Top Lawyers Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t('শীর্ষ ও বিশ্বস্ত আইনজীবীগণ', 'Top Rated Lawyers')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('ইউজারদের ইতিবাচক রিভিউ ও সফল কেস হিস্ট্রি সমৃদ্ধ আইনজীবীদের তালিকা', 'Based on verified client reviews in your court area')}
            </p>
          </div>

          <button
            onClick={() => setUserTab('search')}
            className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
          >
            <span>{t('সকল আইনজীবী', 'All Lawyers')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* High Density Lawyer Cards Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {featuredLawyers.map((lawyer) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} />
          ))}
        </div>
      </section>
    </div>
  );
};
