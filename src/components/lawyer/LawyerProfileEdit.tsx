import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { LawyerDegreePhoto } from '../../types';
import {
  Plus,
  Camera,
  Upload,
  Grid,
  Award,
  BookOpen,
  Briefcase,
  MapPin,
  Star,
  CheckCircle2,
  Share2,
  Settings,
  X,
  ShieldCheck,
  DollarSign,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Eye,
  Save,
  MessageSquare,
  Calendar,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LawyerProfileEdit: React.FC = () => {
  const {
    currentLawyerId,
    lawyers,
    updateLawyerProfile,
    addDegreePhotoToLawyer,
    deleteDegreePhotoFromLawyer,
    setRole,
    reviews,
    language,
    t,
  } = useApp();

  const lawyer = lawyers.find((l) => l.id === currentLawyerId) || lawyers[0];

  // Active Tab in Instagram Feed
  const [activeTab, setActiveTab] = useState<'grid' | 'practice' | 'fees' | 'reviews' | 'edit'>(
    'grid'
  );

  // Form State for editing basic info
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
  const [shareCopied, setShareCopied] = useState(false);

  // Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<LawyerDegreePhoto | null>(null);
  const [uploadTargetSection, setUploadTargetSection] = useState<'highlight' | 'gallery'>('highlight');

  // New Degree Upload Form State
  const [newDegreeTitle, setNewDegreeTitle] = useState('');
  const [newDegreeCategory, setNewDegreeCategory] = useState<
    'degree' | 'bar_license' | 'chamber' | 'court_photo' | 'other'
  >('degree');
  const [newDegreeImage, setNewDegreeImage] = useState<string>('');

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const degreeInputRef = useRef<HTMLInputElement | null>(null);

  // Handle Avatar Change
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
          updateLawyerProfile({ avatar: reader.result });
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Degree / Work Photo File Pick
  const handleDegreeFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(t('ফাইলের সাইজ ৫MB-এর বেশি হতে পারবে না', 'File size should not exceed 5MB'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewDegreeImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit New Degree / Work Photo
  const handleSaveDegreePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDegreeImage) {
      alert(t('অনুগ্রহ করে একটি ছবি আপলোড করুন', 'Please select an image file'));
      return;
    }
    const finalTitle = newDegreeTitle.trim() || t('প্রফেশনাল ডিগ্রী সনদ', 'Professional Degree Document');

    addDegreePhotoToLawyer(lawyer.id, {
      title: finalTitle,
      imageUrl: newDegreeImage,
      category: newDegreeCategory,
      section: uploadTargetSection,
    });

    // Reset Form & Close
    setNewDegreeTitle('');
    setNewDegreeImage('');
    setShowUploadModal(false);
    if (uploadTargetSection === 'gallery') {
      setActiveTab('grid');
    }
  };

  // Save Basic Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
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
      fees: { inPerson: feeInPerson, videoCall: feeVideoCall, chat: feeChat },
      phone,
      email,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const lawyerReviews = reviews.filter((r) => r.lawyerId === lawyer.id);
  const degreePhotos = lawyer.degreePhotos || [];

  const highlightPhotos = degreePhotos.filter(
    (p) => p.section === 'highlight' || (!p.section && (p.category === 'degree' || p.category === 'bar_license'))
  );
  const galleryPhotos = degreePhotos.filter(
    (p) => p.section === 'gallery' || (!p.section && p.category !== 'degree' && p.category !== 'bar_license')
  );

  const instagramHandle = `@${(lawyer.name || 'advocate')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')}`;

  return (
    <div className="max-w-3xl mx-auto pb-24 text-slate-800 font-sans">
      {/* Hidden Inputs */}
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
          {/* Left Avatar Container with Gradient Ring & Dual Badges */}
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
              title={t('প্রোফাইল ফটো পরির্বতন', 'Change Profile Photo')}
            >
              <Camera className="w-3.5 h-3.5" />
            </button>


          </div>

          {/* Right Instagram Stats Columns */}
          <div className="flex-1 flex items-center justify-around text-center py-2">
            <div>
              <span className="block text-lg sm:text-xl font-extrabold text-slate-900">
                {degreePhotos.length}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">{t('ডিগ্রী ও পোস্ট', 'Posts')}</span>
            </div>

            <div className="border-x border-slate-100 px-3 sm:px-6">
              <span className="block text-lg sm:text-xl font-extrabold text-slate-900">
                {lawyer.casesHandled}+
              </span>
              <span className="text-[11px] text-slate-500 font-medium">{t('মামলা সমাধান', 'Cases')}</span>
            </div>

            <div>
              <span className="block text-lg sm:text-xl font-extrabold text-slate-900 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                {lawyer.rating}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {lawyer.totalReviews} {t('রিভিউ', 'Reviews')}
              </span>
            </div>
          </div>
        </div>

        {/* Bio & Details Section */}
        <div className="space-y-2 text-xs text-slate-700">
          <h1 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
            <span>{name}</span>
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          </h1>

          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full border border-blue-100 text-[11px]">
            <Briefcase className="w-3 h-3 text-blue-600" />
            <span>{title}</span>
          </div>

          <p className="text-slate-600 leading-relaxed font-normal pt-1">{bio}</p>

          <div className="space-y-1 text-slate-500 pt-1 font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{barAssociation}</span>
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

          {/* Dedicated PLUS Button to Upload Gallery Photos */}
          <button
            type="button"
            onClick={() => {
              setUploadTargetSection('gallery');
              setShowUploadModal(true);
            }}
            className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t('গ্যালারিতে ফটো আপলোড', 'Upload to Gallery')}</span>
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

        {/* Story Highlights (Professional Degrees & Work Photo Highlights) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              {t('প্রফেশনাল ডিগ্রী ও হাইলাইটস', 'Professional Degrees & Highlights')}
            </span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {/* Story Circle 1: Add New (+) Button for Highlights */}
            <button
              type="button"
              onClick={() => {
                setUploadTargetSection('highlight');
                setShowUploadModal(true);
              }}
              className="flex flex-col items-center gap-1 shrink-0 group"
            >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-400 bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-bold text-slate-700">{t('ডিগ্রী যোগ', 'Add Degree')}</span>
            </button>

            {/* Render Degree Highlights ONLY */}
            {highlightPhotos.map((photo, i) => (
              <button
                key={`lawyer-story-${photo.id || i}-${i}`}
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

        {/* Instagram Tabbed Feed Icons Header */}
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
            <span className="hidden sm:inline">{t('ফটো গ্যালারি', 'Photo Gallery')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('practice')}
            className={`py-3 px-4 font-bold text-xs flex items-center gap-1.5 border-t-2 transition-all ${
              activeTab === 'practice'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">{t('বিশেষজ্ঞতা', 'Practice Areas')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fees')}
            className={`py-3 px-4 font-bold text-xs flex items-center gap-1.5 border-t-2 transition-all ${
              activeTab === 'fees'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">{t('ফি ও চেম্বার', 'Fees & Chamber')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 font-bold text-xs flex items-center gap-1.5 border-t-2 transition-all ${
              activeTab === 'reviews'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">{t('রিভিউ', 'Reviews')}</span>
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
            <span className="hidden sm:inline">{t('তথ্য সম্পাদনা', 'Edit Details')}</span>
          </button>
        </div>

        {/* TAB 1: INSTAGRAM POSTS / DEGREES PHOTO GRID */}
        {activeTab === 'grid' && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>{t('কাজের ও চ্যাটের ফটো গ্যালারি', 'Work Photos Gallery')}</span>
              </h3>
            </div>

            {galleryPhotos.length === 0 ? (
              <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
                <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  {t(
                    'গ্যালারিতে এখনো কোনো ফটো আপলোড করা হয়নি।',
                    'No gallery photos added yet.'
                  )}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {galleryPhotos.map((photo, i) => (
                  <div
                    key={`lawyer-grid-${photo.id || i}-${i}`}
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

        {/* TAB 2: PRACTICE AREAS & COURTS */}
        {activeTab === 'practice' && (
          <div className="space-y-4 text-xs pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>{t('আইনি আইনি ক্ষেত্রসমূহ', 'Practice Areas')}</span>
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {lawyer.practiceAreas.map((area, i) => (
                  <span
                    key={`l-pa-${area}-${i}`}
                    className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-bold"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>{t('আদালত ও প্র্যাকটিস এক্তিয়ার', 'Courts & Jurisdiction')}</span>
              </h3>
              <div className="space-y-1.5 text-slate-700">
                {lawyer.courts.map((court, i) => (
                  <div key={`l-court-${court}-${i}`} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="font-medium">{court}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>{t('শিক্ষাগত যোগ্যতা', 'Educational Qualifications')}</span>
              </h3>
              <div className="space-y-1.5 text-slate-700">
                {lawyer.education.map((edu, i) => (
                  <div key={`l-edu-${edu}-${i}`} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium">{edu}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FEES & CHAMBER */}
        {activeTab === 'fees' && (
          <div className="space-y-4 text-xs pt-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('সরাসরি চেম্বারে', 'In-Person')}</span>
                <span className="text-lg font-black text-slate-900 block mt-1">₹{lawyer.fees.inPerson}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('ভিডিও কল', 'Video Call')}</span>
                <span className="text-lg font-black text-slate-900 block mt-1">₹{lawyer.fees.videoCall}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('চ্যাট পরামর্শ', 'Direct Chat')}</span>
                <span className="text-lg font-black text-slate-900 block mt-1">₹{lawyer.fees.chat}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                {t('চেম্বারের ঠিকানা', 'Chamber Location')}
              </h3>
              <p className="text-slate-700 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{lawyer.location}</span>
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-3 pt-2">
            {lawyerReviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                {t('এখনো কোনো রিভিউ জমা পড়েনি।', 'No client reviews submitted yet.')}
              </p>
            ) : (
              lawyerReviews.map((rev, idx) => (
                <div key={`lawyer-rev-${rev.id || idx}-${idx}`} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rev.userName}</span>
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {rev.rating}.0
                    </span>
                  </div>
                  <p className="text-slate-600">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: EDIT ACCOUNT DETAILS FORM */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase text-blue-600 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>{t('আইনজীবী তথ্য আপডেট ফর্ম', 'Advocate Details Update Form')}</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('নাম', 'Full Name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('পদবী', 'Title')}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('বার অ্যাসোসিয়েশন রেজিস্টার নম্বর', 'Bar Association Member Reg.')}</label>
                <input
                  type="text"
                  value={barAssociation}
                  onChange={(e) => setBarAssociation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('চেম্বারের ঠিকানা', 'Chamber Location')}</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">{t('বায়ো / পরিচিতি', 'Advocate Bio')}</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{t('তথ্য সংরক্ষণ করুন', 'Save Profile Changes')}</span>
              </button>

              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('সংরক্ষিত হয়েছে!', 'Saved successfully!')}</span>
                </span>
              )}
            </div>
          </form>
        )}
      </div>

      {/* MODAL 1: WORK PROFESSION PHOTO / DEGREE CERTIFICATE UPLOAD MODAL */}
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
                    {t('প্রফেশনাল ডিগ্রী ও কাজের ফটো আপলোড', 'Upload Professional Degree & Work Photo')}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {t('ডিগ্রী সনদ, বার লাইসেন্স বা চেম্বারের ফটো যুক্ত করুন', 'Add degree certificates, bar licenses, or court photos')}
                  </p>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={degreeInputRef}
                onChange={handleDegreeFilePick}
                accept="image/*"
                className="hidden"
              />

              <form onSubmit={handleSaveDegreePhoto} className="space-y-4 text-xs">
                {/* Photo Selection Box */}
                <div>
                  <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">
                    {t('ফটো নির্বাচন করুন', 'Select Image File')}
                  </label>

                  {newDegreeImage ? (
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-900">
                      <img
                        src={newDegreeImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => degreeInputRef.current?.click()}
                        className="absolute inset-0 bg-slate-950/50 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{t('অন্য ছবি পছন্দ করুন', 'Change Image')}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => degreeInputRef.current?.click()}
                      className="w-full py-8 border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 rounded-xl flex flex-col items-center justify-center text-blue-700 font-bold gap-2 transition-colors"
                    >
                      <Upload className="w-6 h-6 stroke-[2]" />
                      <span>{t('গ্যালারি বা ফাইল থেকে ছবি পছন্দ করুন (+)', 'Choose Photo from Device Gallery (+)')}</span>
                    </button>
                  )}
                </div>

                {/* Title Input */}
                <div>
                  <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">
                    {t('সনদ বা ছবির শিরোনাম', 'Document / Photo Title')}
                  </label>
                  <input
                    type="text"
                    value={newDegreeTitle}
                    onChange={(e) => setNewDegreeTitle(e.target.value)}
                    placeholder="e.g. LL.B Degree Certificate / Bar Enrolment Card"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Section Destination Selection */}
                <div>
                  <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">
                    {t('আপলোড স্থান নির্বাচন করুন', 'Select Destination Section')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUploadTargetSection('highlight')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                        uploadTargetSection === 'highlight'
                          ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-500'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>🌟 {t('শুধুমাত্র হাইলাইটস', 'Highlights Only')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadTargetSection('gallery')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                        uploadTargetSection === 'gallery'
                          ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-500'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>🖼️ {t('শুধুমাত্র গ্যালারি', 'Gallery Only')}</span>
                    </button>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="text-slate-600 font-bold uppercase text-[10px] block mb-1">
                    {t('ক্যাটাগরি', 'Category')}
                  </label>
                  <select
                    value={newDegreeCategory}
                    onChange={(e) =>
                      setNewDegreeCategory(
                        e.target.value as
                          | 'degree'
                          | 'bar_license'
                          | 'chamber'
                          | 'court_photo'
                          | 'other'
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="degree">📜 {t('শিক্ষাগত ডিগ্রী সনদ (LL.B / LL.M)', 'Degree Certificate')}</option>
                    <option value="bar_license">🆔 {t('বার কাউন্সিল প্র্যাকটিস লাইসেন্স', 'Bar Council License')}</option>
                    <option value="chamber">🏢 {t('চেম্বার অফিস ফটো', 'Chamber Office Photo')}</option>
                    <option value="court_photo">🏛️ {t('আদালতের কার্যক্রম / বিজয়ী ফটো', 'Court Work Photo')}</option>
                    <option value="other">📁 {t('অন্যান্য ডকুমেন্ট', 'Other Document')}</option>
                  </select>
                </div>

                {/* Buttons */}
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
                    {t('প্রোফাইলে পাবলিক করুন', 'Publish to Profile')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: LIGHTBOX PHOTO VIEWER */}
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

              <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-white">{selectedPhotoModal.title}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      deleteDegreePhotoFromLawyer(lawyer.id, selectedPhotoModal.id || selectedPhotoModal.imageUrl);
                      setSelectedPhotoModal(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('ডিলিট', 'Delete')}</span>
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="capitalize text-blue-400 font-medium">
                    {selectedPhotoModal.category || 'Professional Degree Photo'}
                  </span>
                  <span>{selectedPhotoModal.uploadedAt}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
