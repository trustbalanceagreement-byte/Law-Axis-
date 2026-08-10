import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { LawyerDegreePhoto } from '../../types';
import {
  Plus,
  Camera,
  Upload,
  Grid,
  MapPin,
  CheckCircle2,
  Share2,
  Settings,
  X,
  ArrowLeft,
  Image as ImageIcon,
  Eye,
  Save,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  User,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const UserProfile: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    addDegreePhotoToUser,
    deleteDegreePhotoFromUser,
    setRole,
    appointments,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'grid' | 'appointments' | 'edit'>('grid');

  // Form State
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [email, setEmail] = useState(userProfile.email);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [address, setAddress] = useState(userProfile.address);
  const [occupation, setOccupation] = useState(userProfile.occupation || '');
  const [bio, setBio] = useState(userProfile.bio || '');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<LawyerDegreePhoto | null>(null);

  // Upload Photo State
  const [newTitle, setNewTitle] = useState('');
  const [newImage, setNewImage] = useState('');

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);

  // Photo Upload Handler for Avatar
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Pick Document / Work Photo
  const handleDocFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(t('ফাইলের সাইজ ৫MB-এর বেশি হতে পারবে না', 'File size should not exceed 5MB'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Work Photo
  const handleSaveDocPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) {
      alert(t('অনুগ্রহ করে একটি ছবি আপলোড করুন', 'Please select an image file'));
      return;
    }
    const finalTitle = newTitle.trim() || t('ওয়ার্ক ডকুমেন্ট / ছবি', 'Work Profession Photo');

    addDegreePhotoToUser({
      title: finalTitle,
      imageUrl: newImage,
      category: 'other',
    });

    setNewTitle('');
    setNewImage('');
    setShowUploadModal(false);
    setActiveTab('grid');
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

  const userPhotos = userProfile.degreePhotos || [];
  const userAppointments = appointments.filter((a) => a.userId === userProfile.id);

  const instagramHandle = `@${(userProfile.name || 'user')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')}`;

  return (
    <div className="max-w-3xl mx-auto pb-24 text-slate-800 font-sans">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        className="hidden"
      />



      {/* Main Instagram Profile Card Container */}
      <div className="bg-white border-x border-b border-slate-200 p-4 sm:p-6 space-y-6">
        {/* Profile Header Row: Avatar + Stats */}
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          {/* Avatar Container with Instagram Gradient Ring & Dual Badges */}
          <div className="relative shrink-0">
            <div className="bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-[3px] rounded-full shadow-md">
              <div className="bg-white p-[2px] rounded-full">
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                />
              </div>
            </div>

            {/* Camera Badge (Bottom Right) for updating Profile Picture */}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-slate-900 text-white p-1.5 rounded-full shadow-md hover:bg-blue-600 transition-colors border-2 border-white"
              title={t('প্রোফাইল ফটো পরিবর্তন', 'Change Profile Photo')}
            >
              <Camera className="w-3.5 h-3.5" />
            </button>


          </div>

          {/* Right Instagram Stats Columns */}
          <div className="flex-1 flex items-center justify-around text-center py-2">
            <div>
              <span className="block text-lg sm:text-xl font-extrabold text-slate-900">
                {userPhotos.length}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">{t('ফটো ও পোস্ট', 'Posts')}</span>
            </div>

            <div className="border-x border-slate-100 px-3 sm:px-6">
              <span className="block text-lg sm:text-xl font-extrabold text-slate-900">
                {userAppointments.length}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">{t('অ্যাপয়েন্টমেন্ট', 'Bookings')}</span>
            </div>

            <div>
              <span className="block text-lg sm:text-xl font-extrabold text-slate-900 text-blue-600">
                2026
              </span>
              <span className="text-[11px] text-slate-500 font-medium">{t('সদস্যবর্ষ', 'Member')}</span>
            </div>
          </div>
        </div>

        {/* Bio & Information */}
        <div className="space-y-2 text-xs text-slate-700">
          <h1 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
            <span>{name}</span>
            <User className="w-4 h-4 text-blue-600 shrink-0" />
          </h1>

          {occupation && (
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full border border-blue-100 text-[11px]">
              <Briefcase className="w-3 h-3 text-blue-600" />
              <span>{occupation}</span>
            </div>
          )}

          <p className="text-slate-600 leading-relaxed font-normal pt-1">{bio || 'User account profile'}</p>

          <div className="space-y-1 text-slate-500 pt-1 font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 pt-0.5">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {phone}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                {email}
              </span>
            </div>
          </div>
        </div>

        {/* Instagram Action Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t('প্রোফাইল এডিট', 'Edit Profile')}</span>
          </button>

          {/* Dedicated PLUS Button to Upload Photo */}
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t('ফটো আপলোড', 'Add Photo (+)')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              setShareCopied(true);
              setTimeout(() => setShareCopied(false), 2500);
            }}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{shareCopied ? t('কপি হয়েছে!', 'Copied!') : t('শেয়ার', 'Share')}</span>
          </button>

          <button
            type="button"
            onClick={() => setRole(null)}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('মেইন পেজ', 'Main Page')}</span>
          </button>
        </div>

        {/* Story Highlights (Work Photos & Documents) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              {t('ওয়ার্ক প্রফেশন ও ডকুমেন্ট হাইলাইটস', 'Work Profession & Photo Highlights')}
            </span>

          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {/* Add Circle */}
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="flex flex-col items-center gap-1 shrink-0 group"
            >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-400 bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-bold text-slate-700">{t('ফটো যোগ', 'Add Photo')}</span>
            </button>

            {userPhotos.map((photo, i) => (
              <button
                key={`user-story-${photo.id || i}-${i}`}
                type="button"
                onClick={() => setSelectedPhotoModal(photo)}
                className="flex flex-col items-center gap-1 shrink-0 group"
              >
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 shadow-xs group-hover:scale-105 transition-transform">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full rounded-full object-cover border border-white"
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-800 max-w-[64px] truncate">
                  {photo.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Instagram Grid Navigation Tabs */}
        <div className="border-t border-slate-200 pt-1 flex items-center justify-around">
          <button
            type="button"
            onClick={() => setActiveTab('grid')}
            className={`py-3 px-4 font-bold text-xs flex items-center gap-1.5 border-t-2 transition-all ${
              activeTab === 'grid'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">{t('ফটো ও পোস্ট', 'Photos & Posts')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className={`py-3 px-4 font-bold text-xs flex items-center gap-1.5 border-t-2 transition-all ${
              activeTab === 'appointments'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">{t('অ্যাপয়েন্টমেন্টস', 'Appointments')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`py-3 px-4 font-bold text-xs flex items-center gap-1.5 border-t-2 transition-all ${
              activeTab === 'edit'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">{t('প্রোফাইল এডিট', 'Edit Info')}</span>
          </button>
        </div>

        {/* TAB 1: POSTS GRID */}
        {activeTab === 'grid' && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>{t('ওয়ার্ক ও প্রফেশনাল ফটো গ্যালারি', 'Work Profession & Photo Gallery')}</span>
              </h3>

            </div>

            {userPhotos.length === 0 ? (
              <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
                <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  {t(
                    'আপনার কোনো কাজের ফটো বা প্রফেশনাল ডিগ্রী আপলোড করা নেই। প্লাস (+) আইকনে চাপ দিয়ে গ্যালারি থেকে ফটো যুক্ত করুন।',
                    'No photos or work documents uploaded yet. Click + icon to add photos from device.'
                  )}
                </p>

              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {userPhotos.map((photo, i) => (
                  <div
                    key={`user-grid-${photo.id || i}-${i}`}
                    onClick={() => setSelectedPhotoModal(photo)}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-slate-900 cursor-pointer shadow-xs border border-slate-200"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                      <span className="text-xs font-bold line-clamp-2">{photo.title}</span>
                      <span className="text-[10px] text-blue-300 font-medium mt-1 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{t('জুম করে দেখুন', 'Click to view')}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-3 pt-2">
            {userAppointments.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                {t('আপনার কোনো সক্রিয় অ্যাপয়েন্টমেন্ট নেই।', 'No active bookings found.')}
              </p>
            ) : (
              userAppointments.map((app, idx) => (
                <div key={`user-app-${app.id || idx}-${idx}`} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{app.lawyerName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase text-[10px]">
                      {app.status}
                    </span>
                  </div>
                  <p className="text-slate-600">{app.caseDescription}</p>
                  <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>📅 {app.date} at {app.timeSlot}</span>
                    <span className="font-bold text-slate-900">₹{app.fee}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: EDIT PROFILE FORM */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 text-xs">
            <h3 className="font-bold text-blue-600 uppercase flex items-center gap-2 text-xs">
              <User className="w-4 h-4" />
              <span>{t('ব্যক্তিগত তথ্য সম্পাদনা', 'Edit Personal Details')}</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('আপনার নাম', 'Full Name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('ফোন নম্বর', 'Phone Number')}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('ইমেইল ঠিকানা', 'Email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('পেশা', 'Occupation')}</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('ঠিকানা', 'Address')}</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{t('তথ্য সংরক্ষণ করুন', 'Save Changes')}</span>
              </button>

              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('সংরক্ষিত হয়েছে!', 'Saved!')}</span>
                </span>
              )}
            </div>
          </form>
        )}
      </div>

      {/* UPLOAD MODAL */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-800 relative"
            >
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {t('ওয়ার্ক ও প্রফেশনাল ফটো আপলোড', 'Upload Work Photo & Document')}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {t('গ্যালারি থেকে ফটো নির্বাচন করুন', 'Select photo from your gallery')}
                  </p>
                </div>
              </div>

              <input
                type="file"
                ref={docInputRef}
                onChange={handleDocFilePick}
                accept="image/*"
                className="hidden"
              />

              <form onSubmit={handleSaveDocPhoto} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">
                    {t('ছবি নির্বাচন করুন', 'Select Image File')}
                  </label>

                  {newImage ? (
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-900">
                      <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => docInputRef.current?.click()}
                        className="absolute inset-0 bg-slate-950/50 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{t('অন্য ছবি পছন্দ করুন', 'Change Image')}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => docInputRef.current?.click()}
                      className="w-full py-8 border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 rounded-xl flex flex-col items-center justify-center text-blue-700 font-bold gap-2 transition-colors"
                    >
                      <Upload className="w-6 h-6 stroke-[2]" />
                      <span>{t('গ্যালারি বা ফাইল থেকে ছবি পছন্দ করুন (+)', 'Choose Photo from Device Gallery (+)')}</span>
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">
                    {t('ফটোর শিরোনাম', 'Photo Title')}
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Work Profession Photo / Document"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                  >
                    {t('বাতিল', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-xs"
                  >
                    {t('পাবলিক করুন', 'Publish Photo')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX */}
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
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
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

              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                <h4 className="font-bold text-base text-white">{selectedPhotoModal.title}</h4>
                <button
                  type="button"
                  onClick={() => {
                    deleteDegreePhotoFromUser(selectedPhotoModal.id || selectedPhotoModal.imageUrl);
                    setSelectedPhotoModal(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('ডিলিট', 'Delete')}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
