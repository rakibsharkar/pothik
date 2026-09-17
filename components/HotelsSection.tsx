'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Info, ArrowRight } from 'lucide-react';
import { useLangStore } from '@/store/useLangStore';

export interface HotelItem {
  id: number;
  name: string;
  slug: string;
  address: string | null;
  rating: number;
  featuredImage: string | null;
  spot?: { name: string; slug: string } | null;
  rooms?: Array<{ price: number; discountPrice?: number | null; title: string }>;
}

interface HotelsSectionProps {
  hotels: HotelItem[];
}

export const HotelsSection: React.FC<HotelsSectionProps> = ({ hotels }) => {
  const { t } = useLangStore();

  return (
    <section id="hotels" className="py-16 bg-gray-100/50 dark:bg-gray-800/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('জনপ্রিয় হোটেল', 'Popular Hotels')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('স্পটের কাছে ভালো হোটেল খুঁজুন', 'Find good hotels near the spot')}
            </p>
          </div>
          <Link
            href="/#hotels"
            className="hidden sm:flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors font-medium text-sm"
          >
            <span>{t('সব হোটেল দেখুন', 'View All Hotels')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => {
            const lowestPrice =
              hotel.rooms && hotel.rooms.length > 0
                ? Math.min(...hotel.rooms.map((r) => r.discountPrice || r.price))
                : 2500;

            const spotName = hotel.spot ? hotel.spot.name : hotel.address || 'বাংলাদেশ';

            return (
              <div
                key={hotel.id}
                className="info-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={
                        hotel.featuredImage ||
                        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'
                      }
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      Available
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{hotel.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      <span className="line-clamp-1">{spotName}</span>
                    </p>

                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {hotel.rating > 0 ? hotel.rating.toFixed(1) : '4.5'}
                      </span>
                      <span className="text-gray-500 text-xs">(৪৫ {t('রিভিউ', 'reviews')})</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                        WiFi
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                        AC
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                        {t('খাবার', 'Food')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between">
                  <span className="text-teal-600 font-bold text-sm">
                    ৳{lowestPrice.toLocaleString()}
                    <span className="text-xs text-gray-500 font-normal">/{t('রাত', 'night')}</span>
                  </span>
                  <Link
                    href={`/hotels/${hotel.slug}`}
                    className="text-sm btn-primary text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    <span>{t('বিস্তারিত', 'Details')}</span>
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
