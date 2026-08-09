import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConsultationMode } from '../types';
import { X, Calendar, Clock, User, Phone, Mail, FileText, CheckCircle2, Video, MessageSquare, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BookingModal: React.FC = () => {
  const { bookingLawyer, setBookingLawyer, addAppointment, setUserTab, language, t } = useApp();

  const [mode, setMode] = useState<ConsultationMode>('in_person');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-14');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [caseType, setCaseType] = useState<string>('Land & Property Dispute');
  const [caseDescription, setCaseDescription] = useState<string>('');
  const [userName, setUserName] = useState<string>('Karan Sharma');
  const [userPhone, setUserPhone] = useState<string>('+91 98300-11223');
  const [userEmail, setUserEmail] = useState<string>('karan@gmail.com');

  const [confirmedAppId, setConfirmedAppId] = useState<string | null>(null);

  if (!bookingLawyer) return null;

  // Set default slot if available
  const availableSlots = bookingLawyer.availability.timeSlots || ['10:00 AM', '04:00 PM', '06:00 PM'];

  const getFee = () => {
    if (mode === 'in_person') return bookingLawyer.fees.inPerson;
    if (mode === 'video_call') return bookingLawyer.fees.videoCall;
    return bookingLawyer.fees.chat;
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot && availableSlots.length > 0) {
      setSelectedSlot(availableSlots[0]);
    }

    const app = addAppointment({
      lawyer: bookingLawyer,
      date: selectedDate,
      timeSlot: selectedSlot || availableSlots[0],
      consultationMode: mode,
      caseType,
      caseDescription,
      userName,
      userPhone,
      userEmail,
    });

    setConfirmedAppId(app.id);
  };

  const handleFinish = () => {
    setBookingLawyer(null);
    setConfirmedAppId(null);
    setUserTab('profile'); // Navigate to profile to view appointments
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-auto p-6 text-slate-800"
        >
          <button
            onClick={() => setBookingLawyer(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {!confirmedAppId ? (
            <form onSubmit={handleConfirmBooking} className="space-y-5">
              {/* Header Lawyer Info */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <img
                  src={bookingLawyer.avatar}
                  alt={bookingLawyer.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'bn' ? bookingLawyer.nameBn : bookingLawyer.name}
                  </h3>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wide">
                    {language === 'bn' ? bookingLawyer.titleBn : bookingLawyer.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {language === 'bn' ? bookingLawyer.locationBn : bookingLawyer.location}
                  </p>
                </div>
              </div>

              <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>{t('অ্যাপয়েন্টমেন্ট তথ্য পূরণ করুন', 'Book Consultation Slot')}</span>
              </h2>

              {/* Consultation Mode Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  {t('পরামর্শের মাধ্যম বেছে নিন', 'Select Consultation Mode')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('in_person')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      mode === 'in_person'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{t('চেম্বারে সরাসরি', 'In-Person')}</span>
                    <span className="text-[10px] text-indigo-600 font-bold">₹{bookingLawyer.fees.inPerson}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('video_call')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      mode === 'video_call'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>{t('ভিডিও কল', 'Video Call')}</span>
                    <span className="text-[10px] text-indigo-600 font-bold">₹{bookingLawyer.fees.videoCall}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('chat')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      mode === 'chat'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t('লাইভ চ্যাট', 'Live Chat')}</span>
                    <span className="text-[10px] text-indigo-600 font-bold">₹{bookingLawyer.fees.chat}</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    {t('তারিখ নির্বাচন', 'Select Date')}
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min="2026-08-09"
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    {t('সময়সূচি স্লট', 'Time Slot')}
                  </label>
                  <select
                    value={selectedSlot || availableSlots[0]}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {availableSlots.map((slot, idx) => (
                      <option key={idx} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Case Type & Description */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  {t('মামলার ধরন বা বিষয়বস্তু', 'Case Subject')}
                </label>
                <input
                  type="text"
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  placeholder="e.g. Land Dispute, Corporate Contract"
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                  required
                />

                <textarea
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  placeholder={t('সংক্ষেপে আপনার সমস্যা বা প্রশ্ন লিখুন...', 'Brief case notes...')}
                  rows={2}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Client Info */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider">{t('আপনার যোগাযোগের তথ্য', 'Your Contact Details')}</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Full Name"
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Total Fee & Submit */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('মোট কনসালটেশন ফি', 'Total Fee')}</span>
                  <span className="text-lg font-black text-slate-900">₹{getFee()}</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
                >
                  {t('বুকিং নিশ্চিত করুন', 'Confirm Appointment')}
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation Success Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                {t('অ্যাপয়েন্টমেন্ট বুকিং সম্পন্ন হয়েছে!', 'Appointment Confirmed!')}
              </h3>

              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {t(
                  `অ্যাডভোকেট ${bookingLawyer.name}-এর সাথে আপনার অ্যাপয়েন্টমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে।`,
                  `Your appointment request with ${bookingLawyer.name} has been submitted.`
                )}
              </p>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('বুকিং আইডি:', 'Booking ID:')}</span>
                  <span className="font-mono font-bold text-indigo-600">{confirmedAppId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('তারিখ ও সময়:', 'Date & Time:')}</span>
                  <span className="font-semibold text-slate-900">{selectedDate} ({selectedSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('পরামর্শ মোড:', 'Mode:')}</span>
                  <span className="capitalize font-semibold text-slate-900">{mode.replace('_', ' ')}</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all mt-4"
              >
                {t('আমার অ্যাপয়েন্টমেন্টস দেখুন', 'View My Appointments')}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
