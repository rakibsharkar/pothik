'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Info, ArrowRight } from 'lucide-react';
import { useLangStore } from '@/store/useLangStore';

export interface RestaurantItem {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string | null;
  category?: string | null;
  cuisineTypes?: string | null;
  address?: string | null;
  priceRange?: string | null;
  avgRating?: number;
  featuredImage?: string | null;
  openingTime?: string | null;
  closingTime?: string | null;
  district?: { name: string } | null;
}

interface RestaurantsSectionProps {
  restaurants?: RestaurantItem[];
}

export const RestaurantsSection: React.FC<RestaurantsSectionProps> = ({ restaurants = [] }) => {
  const { t } = useLangStore();

  const defaultRestaurants: RestaurantItem[] = [
    {
      id: 1,
      name: 'পাহাড়ি ক্যাফে',
      slug: 'hillside-cafe',
      address: 'সাজেক ভ্যালি',
      avgRating: 4.6,
      featuredImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
      cuisineTypes: '["বাংলা", "মুঘলাই"]',
      openingTime: 'সকাল ৭টা',
      closingTime: 'রাত ১০টা',
    },
    {
      id: 2,
      name: 'সামুদ্রিক রেস্টুরেন্ট',
      slug: 'seafood-restaurant',
      address: 'কক্সবাজার সমুদ্র সৈকত',
      avgRating: 4.8,
      featuredImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
      cuisineTypes: '["সীফুড", "বাংলা"]',
      openingTime: 'সকাল ৮টা',
      closingTime: 'রাত ১১টা',
    },
    {
      id: 3,
      name: 'গ্রিন গার্ডেন',
      slug: 'green-garden',
      address: 'সিলেট',
      avgRating: 4.4,
      featuredImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80',
      cuisineTypes: '["বাংলা", "চাইনিজ"]',
      openingTime: 'সকাল ৯টা',
      closingTime: 'রাত ১০টা',
    },
    {
      id: 4,
      name: 'দ্বীপ ডাইনিং',
      slug: 'island-dining',
      address: 'সেন্ট মার্টিন',
      avgRating: 4.5,
      featuredImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80',
      cuisineTypes: '["সীফুড", "বাংলা"]',
      openingTime: 'সকাল ৭টা',
      closingTime: 'রাত ৯টা',
    },
  ];

  const displayList = restaurants && restaurants.length > 0 ? restaurants : defaultRestaurants;

  return (
    <section id="restaurants" className="py-16 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('জনপ্রিয় রেস্টুরেন্ট', 'Popular Restaurants')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t(
                'ব্রেকফাস্ট, লাঞ্চ, ডিনার - সেরা খাবারের জায়গা খুঁজুন',
                'Find the best places for breakfast, lunch, and dinner'
              )}
            </p>
          </div>
          <Link
            href="/#restaurants"
            className="hidden sm:flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors font-medium text-sm"
          >
            <span>{t('সব রেস্টুরেন্ট দেখুন', 'View All Restaurants')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayList.map((res) => {
            let cuisines: string[] = [];
            try {
              cuisines = res.cuisineTypes ? JSON.parse(res.cuisineTypes) : ['বাংলা', 'মুঘলাই'];
            } catch {
              cuisines = ['বাংলা'];
            }

            return (
              <div
                key={res.id}
                className="info-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={
                        res.featuredImage ||
                        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'
                      }
                      alt={res.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">{res.name}</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                        Open
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      <span className="line-clamp-1">{res.address || 'বাংলাদেশ'}</span>
                    </p>

                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {res.avgRating ? res.avgRating.toFixed(1) : '4.6'}
                      </span>
                      <span className="text-gray-500 text-xs">(৬৫ {t('রিভিউ', 'reviews')})</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {cuisines.map((c, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs text-gray-500 mb-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {t('সময়:', 'Time:')}
                      </span>{' '}
                      <span>
                        {res.openingTime || 'সকাল ৭টা'} - {res.closingTime || 'রাত ১০টা'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => alert(`রেস্টুরেন্ট: ${res.name}\nঠিকানা: ${res.address || 'বাংলাদেশ'}`)}
                    className="w-full text-sm btn-primary text-white py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3 h-3" />
                    <span>{t('বিস্তারিত', 'Details')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
