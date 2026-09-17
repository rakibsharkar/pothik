'use client';

import React from 'react';
import { Mountain, Waves, Trees, Palmtree, Building, Droplets, ChevronRight } from 'lucide-react';
import { useLangStore } from '@/store/useLangStore';

interface CategoriesProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoriesSection: React.FC<CategoriesProps> = ({ activeCategory, onSelectCategory }) => {
  const { t } = useLangStore();

  const categories = [
    {
      id: 'mountains',
      nameBn: 'পাহাড়',
      nameEn: 'Mountains',
      count: '45+',
      icon: Mountain,
    },
    {
      id: 'beaches',
      nameBn: 'সমুদ্র',
      nameEn: 'Beaches',
      count: '32+',
      icon: Waves,
    },
    {
      id: 'forests',
      nameBn: 'বন',
      nameEn: 'Forests',
      count: '18+',
      icon: Trees,
    },
    {
      id: 'islands',
      nameBn: 'দ্বীপ',
      nameEn: 'Islands',
      count: '12+',
      icon: Palmtree,
    },
    {
      id: 'heritage',
      nameBn: 'হেরিটেজ',
      nameEn: 'Heritage',
      count: '28+',
      icon: Building,
    },
    {
      id: 'waterfalls',
      nameBn: 'ঝর্ণা',
      nameEn: 'Waterfalls',
      count: '22+',
      icon: Droplets,
    },
  ];

  return (
    <section className="py-16 bg-gray-100/50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('ক্যাটাগরি অনুযায়ী খুঁজুন', 'Browse by Category')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('আপনার পছন্দের ধরন বেছে নিন', 'Choose your preferred type')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectCategory('')}
            className="hidden sm:flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors font-medium text-sm cursor-pointer"
          >
            <span>{t('সব দেখুন', 'View All')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isActive ? '' : cat.id)}
                className={`category-pill flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer ${
                  isActive
                    ? 'active'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-teal-50 dark:bg-teal-900/30 text-teal-600'
                  }`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span
                  className={`font-semibold text-sm sm:text-base ${
                    isActive ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {t(cat.nameBn, cat.nameEn)}
                </span>
                <span
                  className={`text-xs ${
                    isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {cat.count} <span>{t('স্থান', 'spots')}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
