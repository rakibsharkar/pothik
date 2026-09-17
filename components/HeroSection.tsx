'use client';

import React, { useState } from 'react';
import { Layers, Map, MapPin, Search, ChevronDown, Mic } from 'lucide-react';
import { useLangStore } from '@/store/useLangStore';

interface HeroProps {
  divisions: Array<{ id: number; name: string; slug: string | null }>;
  districts: Array<{ id: number; name: string; divisionId: number; slug: string | null }>;
  onSearch?: (divisionId: string, districtId: string, category: string, keyword: string) => void;
}

export const HeroSection: React.FC<HeroProps> = ({ divisions, districts, onSearch }) => {
  const { t } = useLangStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [keyword, setKeyword] = useState('');

  const filteredDistricts = selectedDivision
    ? districts.filter((d) => d.divisionId === Number(selectedDivision))
    : districts;

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(selectedDivision, selectedDistrict, selectedCategory, keyword);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 img-placeholder">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Bangladesh Landscape"
          className="w-full h-full object-cover opacity-80"
        />
      </div>
      <div className="hero-overlay absolute inset-0"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-teal-500/20 rounded-full blur-xl animate-float"></div>
      <div
        className="absolute bottom-40 right-20 w-32 h-32 bg-orange-500/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: '1s' }}
      ></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up pt-20">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full mb-6">
          🌏 <span>{t('বাংলাদেশের সেরা ট্যুর প্ল্যাটফর্ম', 'Best Tour Platform in Bangladesh')}</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          <span>{t('আবিষ্কার করুন', 'Discover')}</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-orange-300">
            {t('সুন্দর বাংলাদেশ', 'Beautiful Bangladesh')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          {t(
            'পাহাড় থেকে সমুদ্র, বন থেকে দ্বীপ - বাংলাদেশের প্রতিটি কোণে রয়েছে অবিশ্বাস্য সৌন্দর্য।',
            'From mountains to sea, forests to islands - discover incredible beauty in every corner of Bangladesh.'
          )}
        </p>

        {/* Search Box */}
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-3">
              
              {/* Category Filter */}
              <div className="relative lg:w-40">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                <select
                  id="search-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-11 pr-8 h-14 bg-white dark:bg-gray-800 border-0 rounded-xl appearance-none focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer text-gray-700 dark:text-gray-200"
                >
                  <option value="all">{t('সবকিছু', 'Everything')}</option>
                  <option value="spots">{t('টুরিস্ট স্পট', 'Spots')}</option>
                  <option value="hotels">{t('হোটেল', 'Hotels')}</option>
                  <option value="restaurants">{t('রেস্টুরেন্ট', 'Restaurants')}</option>
                  <option value="guides">{t('গাইড', 'Guides')}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Division Select */}
              <div className="relative lg:w-40">
                <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                <select
                  id="search-division"
                  value={selectedDivision}
                  onChange={(e) => {
                    setSelectedDivision(e.target.value);
                    setSelectedDistrict('');
                  }}
                  className="w-full pl-11 pr-8 h-14 bg-white dark:bg-gray-800 border-0 rounded-xl appearance-none focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer text-gray-700 dark:text-gray-200"
                >
                  <option value="">{t('বিভাগ', 'Division')}</option>
                  {divisions.map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* District Select */}
              <div className="relative lg:w-40">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                <select
                  id="search-district"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full pl-11 pr-8 h-14 bg-white dark:bg-gray-800 border-0 rounded-xl appearance-none focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer text-gray-700 dark:text-gray-200"
                >
                  <option value="">{t('জেলা', 'District')}</option>
                  {filteredDistricts.map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {dist.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={t('কোথায় যেতে চান?', 'Where do you want to go?')}
                  className="w-full pl-12 pr-14 h-14 bg-white dark:bg-gray-800 border-0 rounded-xl text-lg focus:ring-2 focus:ring-teal-500 outline-none text-gray-800 dark:text-white"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 hover:bg-teal-100 transition-colors flex items-center justify-center"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>

              {/* Search Button */}
              <button
                type="button"
                onClick={handleSearchClick}
                className="h-14 px-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl btn-shine flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Search className="w-5 h-5" />
                <span>{t('খুঁজুন', 'Search')}</span>
              </button>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
