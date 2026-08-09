import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  CheckCircle2,
  MapPin,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  Award,
  Clock,
  BookOpen,
  Briefcase,
  ThumbsUp,
  PlusCircle,
  Video,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LawyerProfileModal: React.FC = () => {
  const {
    selectedLawyer,
    setSelectedLawyer,
    setBookingLawyer,
    setReviewLawyer,
    startConversationWithLawyer,
    setUserTab,
    reviews,
    language,
    t,
  } = useApp();

  if (!selectedLawyer) return null;

  const lawyerReviews = reviews.filter((r) => r.lawyerId === selectedLawyer.id);

  const handleBook = () => {
    const lawyer = selectedLawyer;
    setSelectedLawyer(null);
    setBookingLawyer(lawyer);
  };

  const handleChat = () => {
    const lawyer = selectedLawyer;
    setSelectedLawyer(null);
    startConversationWithLawyer(lawyer);
    setUserTab('chat');
  };

  const handleOpenReview = () => {
    const lawyer = selectedLawyer;
    setSelectedLawyer(null);
    setReviewLawyer(lawyer);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-slate-800"
        >
          {/* Header Cover & Close Button */}
          <div className="relative bg-slate-900 p-6 border-b border-slate-800 text-white">
            <button
              onClick={() => setSelectedLawyer(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative shrink-0">
                <img
                  src={selectedLawyer.avatar}
                  alt={selectedLawyer.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border-2 border-slate-700 shadow-md"
                />
                {selectedLawyer.availability.isOnlineNow && (
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                )}
              </div>

              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {language === 'bn' ? selectedLawyer.nameBn : selectedLawyer.name}
                  </h2>
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                </div>

                <p className="text-indigo-400 font-bold text-xs sm:text-sm uppercase tracking-wider mt-1">
                  {language === 'bn' ? selectedLawyer.titleBn : selectedLawyer.title}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {selectedLawyer.barAssociation}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-300 mt-3">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{language === 'bn' ? selectedLawyer.locationBn : selectedLawyer.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-700">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('রেটিং স্কোর', 'Rating Score')}</span>
                <span className="text-base font-black text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  {selectedLawyer.rating}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('মোট রিভিউ', 'Client Reviews')}</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">{selectedLawyer.totalReviews}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('অভিজ্ঞতা', 'Experience')}</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">{selectedLawyer.experienceYears}+ Yrs</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('মামলা পরিচালনা', 'Cases Handled')}</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">{selectedLawyer.casesHandled}+</span>
              </div>
            </div>

            {/* About / Bio */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>{t('আইনজীবী পরিচিতি', 'Advocate Biography')}</span>
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {language === 'bn' ? selectedLawyer.bioBn : selectedLawyer.bio}
              </p>
            </div>

            {/* Practice Areas & Courts */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>{t('বিশেষজ্ঞতার ক্ষেত্রসমূহ', 'Practice Areas')}</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLawyer.practiceAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>{t('আদালত ও এক্তিয়ার', 'Courts & Jurisdiction')}</span>
                </h3>
                <div className="space-y-1 text-xs text-slate-600">
                  {(language === 'bn' ? selectedLawyer.courtsBn : selectedLawyer.courts).map((court, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      <span>{court}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>{t('পরামর্শ ফি ও মোড', 'Consultation Fees & Modes')}</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{t('সরাসরি চেম্বারে', 'In-Person')}</span>
                  <span className="text-sm font-black text-slate-900">₹{selectedLawyer.fees.inPerson}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{t('ভিডিও কল', 'Video Call')}</span>
                  <span className="text-sm font-black text-slate-900">₹{selectedLawyer.fees.videoCall}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{t('চ্যাট পরামর্শ', 'Direct Chat')}</span>
                  <span className="text-sm font-black text-slate-900">₹{selectedLawyer.fees.chat}</span>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{t('ইউজার রেটিং ও রিভিউ', 'Client Reviews & Ratings')} ({lawyerReviews.length})</span>
                </h3>

                <button
                  onClick={handleOpenReview}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{t('রিভিউ দিন', 'Add Review')}</span>
                </button>
              </div>

              {lawyerReviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  {t('এখনো কোনো রিভিউ জমা পড়েনি। প্রথম রিভিউটি আপনি দিন!', 'No reviews yet. Be the first to leave a review!')}
                </p>
              ) : (
                <div className="space-y-3">
                  {lawyerReviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{rev.userName}</span>
                          {rev.verifiedClient && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                              {t('যাচাইকৃত ক্লায়েন্ট', 'Verified Client')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500 font-bold">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-slate-600 mt-1">{rev.comment}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                        <span>{rev.consultationType}</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={handleChat}
              className="flex-1 py-2.5 px-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-indigo-100 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('সরাসরি চ্যাট করুন', 'Live Chat')}</span>
            </button>

            <button
              onClick={handleBook}
              className="flex-1 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('অ্যাপয়েন্টমেন্ট বুকিং', 'Book Appointment')}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
