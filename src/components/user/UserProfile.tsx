import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Camera, User, Save, CheckCircle2, Upload, MapPin, Phone, Mail, Briefcase } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    setRole,
    t,
  } = useApp();

  // Form State
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [email, setEmail] = useState(userProfile.email);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [address, setAddress] = useState(userProfile.address);
  const [occupation, setOccupation] = useState(userProfile.occupation || '');
  const [bio, setBio] = useState(userProfile.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Image Upload Handler
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
          updateUserProfile({ avatar: reader.result });
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      email,
      avatar,
      address,
      occupation,
      bio,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 text-slate-800 max-w-4xl mx-auto">
      {/* Hidden File Input for Gallery Photo Selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full sm:w-auto">
          {/* Avatar with Camera Upload Overlay */}
          <div className="relative group shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border-2 border-indigo-600 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-xs">
                {name ? name.slice(0, 2).toUpperCase() : 'KS'}
              </div>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-2 rounded-xl shadow-md hover:bg-indigo-600 transition-colors flex items-center justify-center border-2 border-white"
              title={t('গ্যালারি থেকে ছবি আপলোড করুন', 'Upload photo from gallery')}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">{userProfile.name}</h1>
            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span>{userProfile.phone}</span>
              <span>•</span>
              <span>{userProfile.email}</span>
            </p>
            {userProfile.address && (
              <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{userProfile.address}</span>
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t('সদস্যপদ: ২০২৬ থেকে নিবন্ধিত', 'Member since ' + userProfile.memberSince)}
            </p>
          </div>
        </div>

        <button
          onClick={() => setRole(null)}
          className="px-3.5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('মেইন পেজ', 'Main Page')}</span>
        </button>
      </div>

      {/* Edit Profile & Direct Gallery Upload Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Photo Upload Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <span>{t('প্রোফাইল ফটো (গ্যালারি থেকে সরাসরি আপলোড)', 'Profile Photo (Direct Gallery Upload)')}</span>
          </h3>

          <div className="flex items-center gap-4">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-600 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-xs shrink-0">
                {name ? name.slice(0, 2).toUpperCase() : 'KS'}
              </div>
            )}

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>{t('গ্যালারি থেকে ফটো নির্বাচন করুন', 'Choose Photo from Gallery')}</span>
              </button>
              <p className="text-[11px] text-slate-500">
                {t('আপনার ডিভাইসের গ্যালারি বা ফাইল থেকে JPG / PNG ছবি আপলোড করুন।', 'Select JPG/PNG photo directly from your device storage.')}
              </p>
            </div>
          </div>
        </div>

        {/* Information Fields */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{t('ব্যক্তিগত তথ্য সম্পাদনা', 'Personal Information')}</span>
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">
                {t('আপনার নাম', 'Full Name')}
              </label>
              <div className="relative flex items-center">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">
                {t('ফোন নম্বর', 'Phone Number')}
              </label>
              <div className="relative flex items-center">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 shrink-0" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">
                {t('ইমেইল ঠিকানা', 'Email Address')}
              </label>
              <div className="relative flex items-center">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">
                {t('পেশা', 'Occupation')}
              </label>
              <div className="relative flex items-center">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 shrink-0" />
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Business Owner"
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">
                {t('ঠিকানা / শহর', 'Address & City')}
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 shrink-0" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Park Street, Kolkata"
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">
                {t('বায়ো / আইনি পরামর্শের বিবরণ', 'About / Legal Need Notes')}
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell us a bit about your legal inquiries or requirements..."
                className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{t('তথ্য সংরক্ষণ করুন', 'Save Profile Information')}</span>
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
