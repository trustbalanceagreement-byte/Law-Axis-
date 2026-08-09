import React from 'react';
import { Lawyer } from '../types';
import { useApp } from '../context/AppContext';
import { Star, MapPin, Award, CheckCircle2, MessageSquare, Calendar, Bookmark, Heart } from 'lucide-react';

interface LawyerCardProps {
  lawyer: Lawyer;
}

export const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer }) => {
  const {
    setSelectedLawyer,
    setBookingLawyer,
    startConversationWithLawyer,
    setUserTab,
    toggleBookmark,
    bookmarkedLawyerIds,
    language,
    t,
  } = useApp();

  const isBookmarked = bookmarkedLawyerIds.includes(lawyer.id);

  const handleOpenProfile = () => {
    setSelectedLawyer(lawyer);
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookingLawyer(lawyer);
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    startConversationWithLawyer(lawyer);
    setUserTab('chat');
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(lawyer.id);
  };

  return (
    <div
      onClick={handleOpenProfile}
      className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 transition-all cursor-pointer group flex flex-col justify-between w-full max-w-full overflow-hidden"
    >
      <div className="w-full max-w-full overflow-hidden">
        {/* Top Header Grid */}
        <div className="flex gap-3 sm:gap-4 mb-3 items-start w-full min-w-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-xl overflow-hidden relative shrink-0 border border-slate-200">
            <img
              src={lawyer.avatar}
              alt={lawyer.name}
              className="w-full h-full object-cover"
            />
            {lawyer.availability.isOnlineNow && (
              <div className="absolute bottom-1 right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-white rounded-full" title="Online Now" />
            )}
          </div>

          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex justify-between items-center gap-1 mb-0.5">
              <div className="flex items-center gap-1 min-w-0 flex-1">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {language === 'bn' ? lawyer.nameBn : lawyer.name}
                </h4>
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0" title="Verified Advocate" />
              </div>

              <div className="flex items-center gap-0.5 text-yellow-600 font-extrabold text-xs shrink-0 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 shrink-0" />
                <span>{lawyer.rating}</span>
              </div>
            </div>

            <p className="text-indigo-600 text-[11px] sm:text-xs font-bold uppercase tracking-wide mb-1 truncate">
              {language === 'bn' ? lawyer.titleBn : lawyer.title}
            </p>

            <p className="text-slate-500 text-[11px] sm:text-xs flex items-center gap-1 min-w-0 truncate">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{language === 'bn' ? lawyer.locationBn : lawyer.location}</span>
            </p>
          </div>
        </div>

        {/* Practice Specialty Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3 max-w-full overflow-hidden">
          {lawyer.practiceAreas.slice(0, 3).map((area, idx) => (
            <span
              key={idx}
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 max-w-full truncate"
            >
              {area}
            </span>
          ))}
          {lawyer.practiceAreas.length > 3 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 shrink-0">
              +{lawyer.practiceAreas.length - 3}
            </span>
          )}
        </div>

        {/* High Density Stats Box */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100 min-w-0">
            <span className="block text-[10px] text-slate-400 font-bold uppercase truncate">{t('কনসালটেশন ফি', 'Consultation')}</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">₹{lawyer.fees.inPerson}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100 min-w-0">
            <span className="block text-[10px] text-slate-400 font-bold uppercase truncate">{t('অভিজ্ঞতা', 'Exp.')}</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">{lawyer.experienceYears} {t('বছর', 'Years')}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 w-full min-w-0">
        <button
          onClick={handleBook}
          className="flex-1 py-2 sm:py-2.5 px-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 min-w-0 overflow-hidden"
        >
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t('বুকিং করুন', 'Book Appointment')}</span>
        </button>

        <button
          onClick={handleChat}
          className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg flex items-center justify-center hover:bg-indigo-100 transition-colors"
          title={t('লাইভ চ্যাট', 'Live Chat')}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
        </button>

        <button
          onClick={handleBookmark}
          className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-slate-100 border border-slate-200 text-slate-500 hover:text-indigo-600 rounded-lg flex items-center justify-center transition-colors"
          title={isBookmarked ? 'Saved' : 'Save Lawyer'}
        >
          <Heart className={`w-4 h-4 shrink-0 ${isBookmarked ? 'fill-indigo-600 text-indigo-600' : ''}`} />
        </button>
      </div>
    </div>
  );
};
