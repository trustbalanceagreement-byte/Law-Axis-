import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LawyerDegreePhoto } from '../types';
import {
  X,
  Star,
  CheckCircle2,
  MapPin,
  Calendar,
  MessageSquare,
  Award,
  Clock,
  BookOpen,
  Briefcase,
  PlusCircle,
  ShieldCheck,
  Grid,
  Image as ImageIcon,
  Eye,
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

  const [activeTab, setActiveTab] = useState<'grid' | 'practice' | 'fees' | 'reviews'>('grid');
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<LawyerDegreePhoto | null>(null);

  if (!selectedLawyer) return null;

  const lawyerReviews = reviews.filter((r) => r.lawyerId === selectedLawyer.id);
  const degreePhotos = selectedLawyer.degreePhotos || [];
  const highlightPhotos = degreePhotos.filter(
    (p) => p.section === 'highlight' || (!p.section && (p.category === 'degree' || p.category === 'bar_license'))
  );
  const galleryPhotos = degreePhotos.filter(
    (p) => p.section === 'gallery' || (!p.section && p.category !== 'degree' && p.category !== 'bar_license')
  );

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

  const instagramHandle = `@${(selectedLawyer.name || 'advocate')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800"
        >
          {/* Top Instagram Header */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900 tracking-tight">{instagramHandle}</span>
              <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500" />
            </div>

            <button
              type="button"
              onClick={() => setSelectedLawyer(null)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Profile Body */}
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {/* Header Row: Avatar + Stats */}
            <div className="flex items-center justify-between gap-4 sm:gap-8">
              {/* Avatar Container with Gradient Story Ring */}
              <div className="relative shrink-0">
                <div className="bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-[3px] rounded-full shadow-md">
                  <div className="bg-white p-[2px] rounded-full">
                    <img
                      src={selectedLawyer.avatar}
                      alt={selectedLawyer.name}
                      className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover"
                    />
                  </div>
                </div>
                {selectedLawyer.availability.isOnlineNow && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
                )}
              </div>

              {/* Right Stats */}
              <div className="flex-1 flex items-center justify-around text-center py-1">
                <div>
                  <span className="block text-lg font-black text-slate-900">
                    {degreePhotos.length}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase">{t('ডিগ্রী পোস্ট', 'Posts')}</span>
                </div>

                <div className="border-x border-slate-100 px-3">
                  <span className="block text-lg font-black text-slate-900">
                    {selectedLawyer.casesHandled}+
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase">{t('মামলা সমাধান', 'Cases')}</span>
                </div>

                <div>
                  <span className="block text-lg font-black text-slate-900 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {selectedLawyer.rating}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase">{selectedLawyer.totalReviews} {t('রিভিউ', 'Reviews')}</span>
                </div>
              </div>
            </div>

            {/* Bio Info */}
            <div className="space-y-1.5 text-xs">
              <h2 className="font-extrabold text-lg text-slate-900 flex items-center gap-1.5">
                <span>{language === 'bn' ? selectedLawyer.nameBn : selectedLawyer.name}</span>
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              </h2>

              <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 font-bold px-2.5 py-0.5 rounded-full border border-blue-100 text-[10px]">
                <Briefcase className="w-3 h-3 text-blue-600" />
                <span>{language === 'bn' ? selectedLawyer.titleBn : selectedLawyer.title}</span>
              </div>

              <p className="text-slate-600 leading-relaxed font-normal pt-1">
                {language === 'bn' ? selectedLawyer.bioBn : selectedLawyer.bio}
              </p>

              <div className="space-y-1 text-slate-500 font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{language === 'bn' ? selectedLawyer.locationBn : selectedLawyer.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{selectedLawyer.barAssociation}</span>
                </div>
              </div>
            </div>

            {/* Story Highlights (Uploaded Degrees & Work Photo Highlights) */}
            {highlightPhotos.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                  {t('প্রফেশনাল ডিগ্রী ও কাজের ফটো হাইলাইটস', 'Professional Degree & Work Highlights')}
                </span>

                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {highlightPhotos.map((photo, idx) => (
                    <button
                      key={`modal-story-${photo.id || idx}-${idx}`}
                      type="button"
                      onClick={() => setSelectedPhotoModal(photo)}
                      className="flex flex-col items-center gap-1 shrink-0 group"
                    >
                      <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 shadow-xs group-hover:scale-105 transition-transform">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full rounded-full object-cover border border-white"
                        />
                      </div>
                      <span className="text-[10px] font-medium text-slate-800 max-w-[56px] truncate">
                        {photo.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Instagram Tabs Navigation */}
            <div className="border-t border-slate-200 pt-1 flex items-center justify-around">
              <button
                type="button"
                onClick={() => setActiveTab('grid')}
                className={`py-2 px-3 font-bold text-xs flex items-center gap-1 border-t-2 transition-all ${
                  activeTab === 'grid'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>{t('ফটো গ্যালারি', 'Photo Gallery')} ({galleryPhotos.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('practice')}
                className={`py-2 px-3 font-bold text-xs flex items-center gap-1 border-t-2 transition-all ${
                  activeTab === 'practice'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('বিশেষজ্ঞতা', 'Practice Areas')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('fees')}
                className={`py-2 px-3 font-bold text-xs flex items-center gap-1 border-t-2 transition-all ${
                  activeTab === 'fees'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{t('ফি ও মোড', 'Fees')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-3 font-bold text-xs flex items-center gap-1 border-t-2 transition-all ${
                  activeTab === 'reviews'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Star className="w-4 h-4 text-amber-500" />
                <span>{t('রিভিউ', 'Reviews')} ({lawyerReviews.length})</span>
              </button>
            </div>

            {/* TAB 1: DEGREE & WORK PHOTO GRID */}
            {activeTab === 'grid' && (
              <div className="space-y-3 pt-1">
                {galleryPhotos.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                    {t('এখনো কোনো গ্যালারি ফটো আপলোড করা হয়নি।', 'No gallery photos uploaded yet.')}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {galleryPhotos.map((photo, idx) => (
                      <div
                        key={`modal-grid-${photo.id || idx}-${idx}`}
                        onClick={() => setSelectedPhotoModal(photo)}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-slate-900 cursor-pointer shadow-xs border border-slate-200"
                      >
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-white">
                          <span className="text-[11px] font-bold line-clamp-2">{photo.title}</span>
                          <span className="text-[9px] text-blue-300 font-medium mt-0.5 flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{t('জুম করুন', 'Click to view')}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PRACTICE AREAS & COURTS */}
            {activeTab === 'practice' && (
              <div className="space-y-4 text-xs pt-1">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>{t('বিশেষজ্ঞতার ক্ষেত্রসমূহ', 'Practice Areas')}</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLawyer.practiceAreas.map((area, idx) => (
                      <span
                        key={`modal-area-${area}-${idx}`}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-800"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>{t('আদালত ও এক্তিয়ার', 'Courts & Jurisdiction')}</span>
                  </h3>
                  <div className="space-y-1 text-slate-600">
                    {(language === 'bn' ? selectedLawyer.courtsBn : selectedLawyer.courts).map((court, idx) => (
                      <div key={`modal-court-${court}-${idx}`} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <span>{court}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: FEES */}
            {activeTab === 'fees' && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{t('সরাসরি চেম্বারে', 'In-Person')}</span>
                    <span className="text-sm font-black text-slate-900">₹{selectedLawyer.fees.inPerson}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{t('ভিডিও কল', 'Video Call')}</span>
                    <span className="text-sm font-black text-slate-900">₹{selectedLawyer.fees.videoCall}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{t('চ্যাট পরামর্শ', 'Direct Chat')}</span>
                    <span className="text-sm font-black text-slate-900">₹{selectedLawyer.fees.chat}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-900">
                    {t('ক্লায়েন্ট রিভিউ', 'Client Reviews')} ({lawyerReviews.length})
                  </span>
                  <button
                    onClick={handleOpenReview}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{t('রিভিউ দিন', 'Add Review')}</span>
                  </button>
                </div>

                {lawyerReviews.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    {t('এখনো কোনো রিভিউ জমা পড়েনি।', 'No reviews yet.')}
                  </p>
                ) : (
                  lawyerReviews.map((rev, idx) => (
                    <div key={`modal-rev-${rev.id || idx}-${idx}`} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{rev.userName}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-slate-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={handleChat}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-blue-200 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('সরাসরি চ্যাট করুন', 'Live Chat')}</span>
            </button>

            <button
              onClick={handleBook}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('অ্যাপয়েন্টমেন্ট বুকিং', 'Book Appointment')}</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* LIGHTBOX FOR DEGREE PHOTO PREVIEW */}
      <AnimatePresence>
        {selectedPhotoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 text-white rounded-2xl overflow-hidden max-w-2xl w-full border border-slate-800 shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <button
                type="button"
                onClick={() => setSelectedPhotoModal(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 overflow-hidden bg-black flex items-center justify-center min-h-[300px]">
                <img
                  src={selectedPhotoModal.imageUrl}
                  alt={selectedPhotoModal.title}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="p-4 bg-slate-900 border-t border-slate-800">
                <h4 className="font-bold text-base text-white">{selectedPhotoModal.title}</h4>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};
