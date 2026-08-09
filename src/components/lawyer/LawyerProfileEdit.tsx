import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, CheckCircle2, Save, MapPin, Award, Clock, DollarSign, BookOpen, Camera, Upload, ArrowLeft } from 'lucide-react';

export const LawyerProfileEdit: React.FC = () => {
  const { currentLawyerId, lawyers, updateLawyerProfile, setRole, language, t } = useApp();

  const lawyer = lawyers.find((l) => l.id === currentLawyerId) || lawyers[0];

  const [avatar, setAvatar] = useState(lawyer.avatar);
  const [name, setName] = useState(lawyer.name || lawyer.nameBn);
  const [title, setTitle] = useState(lawyer.title || lawyer.titleBn);
  const [barAssociation, setBarAssociation] = useState(lawyer.barAssociation);
  const [location, setLocation] = useState(lawyer.location || lawyer.locationBn);
  const [bio, setBio] = useState(lawyer.bio || lawyer.bioBn);

  const [feeInPerson, setFeeInPerson] = useState(lawyer.fees.inPerson);
  const [feeVideoCall, setFeeVideoCall] = useState(lawyer.fees.videoCall);
  const [feeChat, setFeeChat] = useState(lawyer.fees.chat);

  const [phone, setPhone] = useState(lawyer.phone);
  const [email, setEmail] = useState(lawyer.email);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Photo Upload Handler from Device Gallery
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(t('ফাইলের সাইজ ৫MB-এর বেশি হতে পারবে না', 'File size should not exceed 5MB'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          updateLawyerProfile({ avatar: reader.result });
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateLawyerProfile({
      avatar,
      name,
      nameBn: name,
      title,
      titleBn: title,
      barAssociation,
      location,
      locationBn: location,
      bio,
      bioBn: bio,
      fees: {
        inPerson: feeInPerson,
        videoCall: feeVideoCall,
        chat: feeChat,
      },
      phone,
      email,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 text-slate-800 max-w-4xl mx-auto">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="relative group shrink-0">
            <img
              src={avatar}
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-600 shadow-xs"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-2 rounded-xl shadow-md hover:bg-indigo-600 transition-colors flex items-center justify-center border-2 border-white"
              title={t('গ্যালারি থেকে ফটো আপলোড করুন', 'Upload photo from gallery')}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h1 className="text-lg font-black text-slate-900 flex items-center justify-center sm:justify-start gap-2">
              <span>{t('আইনজীবী প্রোফাইল সম্পাদনা', 'Edit Advocate Profile')}</span>
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('পাবলিক ডিরেক্টরিতে আপনার ছবি, তথ্য, চেম্বার ও ফি আপডেট করুন', 'Update your public photo, chamber details, courts, and consultation fees')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRole(null)}
          className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('মেইন পেজ', 'Main Page')}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Names & Titles */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>{t('ব্যক্তিগত তথ্য ও পদবী', 'Personal Information & Titles')}</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('নাম', 'Full Name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('পদবী', 'Title')}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('বার অ্যাসোসিয়েশন রেজিস্টার নম্বর', 'Bar Association Member Reg.')}</label>
              <input
                type="text"
                value={barAssociation}
                onChange={(e) => setBarAssociation(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{t('চেম্বারের অবস্থান ও যোগাযোগ', 'Chamber Location & Contact')}</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('চেম্বারের ঠিকানা', 'Chamber Location')}</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('ফোন নম্বর', 'Phone Number')}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('ইমেইল', 'Email Address')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{t('আইনজীবী ডেসক্রিপশন / পরিচিতি', 'Advocate Bio')}</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('বায়ো / পরিচিতি', 'Advocate Bio')}</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>{t('কনসালটেশন ফি সেট করুন', 'Consultation Fees (INR ₹)')}</span>
          </h2>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('সরাসরি চেম্বারে', 'In-Person Fee')}</label>
              <input
                type="number"
                value={feeInPerson}
                onChange={(e) => setFeeInPerson(Number(e.target.value))}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('ভিডিও কল ফি', 'Video Call Fee')}</label>
              <input
                type="number"
                value={feeVideoCall}
                onChange={(e) => setFeeVideoCall(Number(e.target.value))}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('চ্যাট পরামর্শ ফি', 'Chat Fee')}</label>
              <input
                type="number"
                value={feeChat}
                onChange={(e) => setFeeChat(Number(e.target.value))}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{t('প্রোফাইল আপডেট করুন', 'Save Profile Changes')}</span>
          </button>

          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('প্রোফাইল আপডেট সম্পন্ন হয়েছে!', 'Profile saved successfully!')}</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
