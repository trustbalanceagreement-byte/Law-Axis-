import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LawyerCard } from '../LawyerCard';
import { PracticeArea } from '../../types';
import { Search, Filter, SlidersHorizontal, Star, MapPin, X, RotateCcw } from 'lucide-react';

const PRACTICE_AREAS: PracticeArea[] = [
  'Civil Law',
  'Criminal Law',
  'Family & Divorce',
  'Land & Property',
  'Corporate & Commercial',
  'Cyber & Digital Security',
  'Tax, VAT & Customs',
  'Writ & Constitutional',
  'Banking & Finance',
  'Labor & Employment',
];

const LOCATIONS = [
  'All Locations',
  'Supreme Court of India, New Delhi',
  'Calcutta High Court, Kolkata',
  'Delhi High Court, New Delhi',
  'Bombay High Court, Mumbai',
  'Karnataka High Court, Bengaluru',
  'City Civil Court Kolkata',
];

export const UserSearch: React.FC = () => {
  const { lawyers, language, t } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number>(3000);
  const [onlineOnly, setOnlineOnly] = useState<boolean>(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  const filteredLawyers = useMemo(() => {
    return lawyers.filter((lawyer) => {
      // Search term
      const term = searchTerm.toLowerCase();
      const matchesTerm =
        !term ||
        lawyer.name.toLowerCase().includes(term) ||
        lawyer.nameBn.includes(term) ||
        lawyer.title.toLowerCase().includes(term) ||
        lawyer.titleBn.includes(term) ||
        lawyer.bio.toLowerCase().includes(term) ||
        lawyer.bioBn.includes(term) ||
        lawyer.practiceAreas.some((pa) => pa.toLowerCase().includes(term));

      // Practice area
      const matchesArea =
        selectedArea === 'All' || lawyer.practiceAreas.includes(selectedArea as PracticeArea);

      // Location
      const matchesLocation =
        selectedLocation === 'All Locations' ||
        lawyer.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        lawyer.locationBn.includes(selectedLocation);

      // Rating
      const matchesRating = lawyer.rating >= minRating;

      // Fee
      const matchesFee = lawyer.fees.inPerson <= maxFee;

      // Online
      const matchesOnline = !onlineOnly || lawyer.availability.isOnlineNow;

      return matchesTerm && matchesArea && matchesLocation && matchesRating && matchesFee && matchesOnline;
    });
  }, [lawyers, searchTerm, selectedArea, selectedLocation, minRating, maxFee, onlineOnly]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedArea('All');
    setSelectedLocation('All Locations');
    setMinRating(0);
    setMaxFee(3000);
    setOnlineOnly(false);
  };

  return (
    <div className="space-y-6 pb-20 text-slate-800">
      {/* Search Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('আইনজীবী সার্চ করুন', 'Search Lawyers & Advocates')}
            </h1>
            <p className="text-xs text-slate-500">
              {t('প্র্যাকটিস কোর্ট, ফি ও অভিজ্ঞতা অনুযায়ী সঠিক আইনজীবী খুঁজুন', 'Filter by practice courts, consultation fees, and ratings')}
            </p>
          </div>

          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t('ফিল্টার', 'Filters')}</span>
          </button>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('আইনজীবীর নাম, বিষয়ের নাম (যেমন: জমি, ডিভোর্স) দিয়ে খুঁজুন...', 'Search by name or legal topic (e.g. Land, Bail, Cyber)...')}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Practice Area Quick Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedArea('All')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
              selectedArea === 'All'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('সকল ক্যাটাগরি', 'All Specializations')}
          </button>
          {PRACTICE_AREAS.map((area, idx) => (
            <button
              key={`search-area-${area}-${idx}`}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
                selectedArea === area
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid & Filters Sidebar */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Filters Sidebar (Desktop & Mobile drawer) */}
        <div
          className={`md:block space-y-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-fit ${
            showFiltersMobile ? 'block' : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span>{t('ফিল্টার অপশন', 'Refine Search')}</span>
            </span>
            <button
              onClick={resetFilters}
              className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('রিসেট', 'Reset')}</span>
            </button>
          </div>

          {/* Min Rating */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
              {t('সর্বনিম্ন রেটিং', 'Min Star Rating')}
            </label>
            <div className="flex items-center gap-2">
              {[0, 4, 4.5, 4.8].map((score) => (
                <button
                  key={score}
                  onClick={() => setMinRating(score)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    minRating === score
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {score === 0 ? t('সব', 'Any') : `${score}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Max Fee Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-slate-700 uppercase tracking-wider">{t('সর্বোচ্চ পরামর্শ ফি', 'Max Fee')}</span>
              <span className="font-bold text-indigo-600">₹{maxFee}</span>
            </div>
            <input
              type="range"
              min="800"
              max="3000"
              step="100"
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              className="w-full accent-indigo-600 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Online status toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={onlineOnly}
                onChange={(e) => setOnlineOnly(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded border-slate-300"
              />
              <span>{t('শুধু এখন অনলাইনে আছেন', 'Online Lawyers Only')}</span>
            </label>
          </div>
        </div>

        {/* Search Results List */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              {t('মোট আইনজীবী পাওয়া গেছে:', 'Total Lawyers Found:')}{' '}
              <strong className="text-slate-900 text-sm">{filteredLawyers.length}</strong>
            </span>
            <span className="text-indigo-600 font-bold">
              {t('যেকোনো কার্ডে ক্লিক করে সম্পূর্ণ প্রোফাইল দেখুন', 'Click any lawyer card to view full profile')}
            </span>
          </div>

          {filteredLawyers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <Search className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">
                {t('কোনো আইনজীবী খুঁজে পাওয়া যায়নি', 'No Lawyers Found')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('অনুগ্রহ করে ফিল্টার পরিবর্তন বা সার্চ কিওয়ার্ড পরিবর্তন করে আবার চেষ্টা করুন।', 'Try adjusting your search criteria or reset filters.')}
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
              >
                {t('ফিল্টার রিসেট করুন', 'Reset All Filters')}
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredLawyers.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
