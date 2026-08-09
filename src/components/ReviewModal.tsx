import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ReviewModal: React.FC = () => {
  const { reviewLawyer, setReviewLawyer, addReview, language, t } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [userName, setUserName] = useState<string>('Karan Sharma');
  const [consultationType, setConsultationType] = useState<string>('In-Person Consultation');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!reviewLawyer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview({
      lawyerId: reviewLawyer.id,
      userName,
      rating,
      comment,
      consultationType,
    });

    setSubmitted(true);
    setTimeout(() => {
      setReviewLawyer(null);
      setSubmitted(false);
      setComment('');
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6 text-slate-800"
        >
          <button
            onClick={() => setReviewLawyer(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <img
                  src={reviewLawyer.avatar}
                  alt={reviewLawyer.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'bn' ? reviewLawyer.nameBn : reviewLawyer.name}
                  </h3>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
                    {t('আইনজীবীকে রিভিউ দিন', 'Add Lawyer Review')}
                  </p>
                </div>
              </div>

              {/* Star Rating Picker */}
              <div className="text-center py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  {t('আপনার অভিজ্ঞতা অনুযায়ী রেটিং বেছে নিন', 'Rate your consultation experience')}
                </span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-slate-300 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-indigo-600 mt-1 block">
                  {rating === 5 && t('চমৎকার সার্ভিস! (5.0)', 'Outstanding Service! (5.0)')}
                  {rating === 4 && t('খুবই ভালো পরামর্শ (4.0)', 'Very Good Advice (4.0)')}
                  {rating === 3 && t('মোটামুটি সন্তোষজনক (3.0)', 'Average Experience (3.0)')}
                  {rating <= 2 && t('উন্নতির সুযোগ আছে (2.0)', 'Needs Improvement (2.0)')}
                </span>
              </div>

              {/* Reviewer Name & Consultation Type */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">{t('আপনার নাম', 'Your Name')}</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">{t('পরামর্শের ধরন', 'Consultation')}</label>
                  <select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="In-Person Consultation">{t('চেম্বারে সরাসরি', 'In-Person')}</option>
                    <option value="Video Call">{t('ভিডিও কল', 'Video Call')}</option>
                    <option value="Chat Consultation">{t('লাইভ চ্যাট', 'Chat')}</option>
                  </select>
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  {t('আপনার বিস্তারিত মতামত বা অভিজ্ঞতার বিবরণ', 'Your Review Feedback')}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t(
                    'আইনজীবীর আচরণ, পরামর্শের মান ও সেবা কেমন লেগেছে তা লিখুন...',
                    'Describe the advocate friendliness, legal guidance quality...'
                  )}
                  rows={3}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all mt-2 shadow-xs"
              >
                {t('রিভিউ জমা দিন', 'Submit Review')}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-black text-slate-900">{t('রিভিউটি সফলভাবে জমা হয়েছে!', 'Review Submitted!')}</h3>
              <p className="text-xs text-slate-600">{t('আপনার মতামতের জন্য ধন্যবাদ।', 'Thank you for your feedback.')}</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
