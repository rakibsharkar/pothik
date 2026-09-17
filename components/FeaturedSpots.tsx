'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Eye, Info, ArrowRight } from 'lucide-react';
import { useLangStore } from '@/store/useLangStore';

export interface SpotItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  divisionId?: number | null;
  districtId: number;
  district?: { name: string };
  difficultyLevel?: string | null;
  entryFeeLocal?: number;
  bestTimeToVisit?: string | null;
  isFeatured?: boolean;
}

interface FeaturedSpotsProps {
  spots: SpotItem[];
}

export const FeaturedSpots: React.FC<FeaturedSpotsProps> = ({ spots }) => {
  const { t } = useLangStore();

  return (
    <section id="spots" className="py-16 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('জনপ্রিয় টুরিস্ট স্পট', 'Popular Tourist Spots')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('বিস্তারিত তথ্য ও রিভিউ দেখুন', 'View detailed information and reviews')}
            </p>
          </div>
          <Link
            href="/#spots"
            className="hidden sm:flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors font-medium text-sm"
          >
            <span>{t('সব স্পট দেখুন', 'View All Spots')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Spots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.map((spot) => {
            const districtName = spot.district?.name || 'বাংলাদেশ';
            const categoryBadge = spot.name.includes('সাজেক')
              ? 'পাহাড়'
              : spot.name.includes('কক্সবাজার') || spot.name.includes('সেন্টমার্টিন')
              ? 'সমুদ্র'
              : spot.name.includes('সুন্দরবন')
              ? 'বন'
              : 'হেরিটেজ';

            return (
              <div
                key={spot.id}
                className="info-card bg-white dark:bg-gray-800/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between border border-gray-100 dark:border-gray-700/60 transition-all duration-300"
              >
                <div>
                  {/* Top Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        spot.thumbnail ||
                        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
                      }
                      alt={spot.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

                    {/* Badge top-left */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 bg-teal-600/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-xs">
                        {categoryBadge}
                      </span>
                      {spot.isFeatured && (
                        <span className="px-2.5 py-1 bg-orange-500/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-xs">
                          ফিচার্ড
                        </span>
                      )}
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white">{spot.name}</h3>
                      <p className="text-white/80 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{districtName}</span>
                      </p>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {spot.description ||
                        'প্রকৃতির অপরূপ সৌন্দর্যে ঘেরা এই পর্যটন স্পটটিতে ঘুরে আসুন আপনার পরিবার অথবা বন্ধুদের সাথে।'}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">4.8</span>
                        <span className="text-gray-500 text-sm">
                          (১২৫ <span>{t('রিভিউ', 'reviews')}</span>)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" /> ২.৫কে
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <div className="px-4 pb-4">
                  <Link
                    href={`/spots/${spot.slug}`}
                    className="w-full py-2.5 btn-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                  >
                    <Info className="w-4 h-4" />
                    <span>{t('বিস্তারিত দেখুন', 'View Details')}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
