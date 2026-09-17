'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { useLangStore } from '@/store/useLangStore';

export interface GuideItem {
  id: number;
  shortBio?: string | null;
  languages?: string | null;
  yearsOfExperience?: number;
  specialization?: string | null;
  whatsappNumber?: string | null;
  kycVerified?: boolean;
  user: {
    name: string;
    avatar: string | null;
  };
  pricing?: {
    dailyRate: number | null;
    halfDayRate?: number | null;
  } | null;
}

interface GuidesSectionProps {
  guides?: GuideItem[];
}

export const GuidesSection: React.FC<GuidesSectionProps> = ({ guides = [] }) => {
  const { t } = useLangStore();

  const defaultGuides: GuideItem[] = [
    {
      id: 1,
      user: {
        name: 'রাফি আহমেদ',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      languages: '["বাংলা", "ইংরেজি", "সাজেক"]',
      pricing: { dailyRate: 1500 },
    },
    {
      id: 2,
      user: {
        name: 'সাবরিনা খান',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      languages: '["বাংলা", "কক্সবাজার"]',
      pricing: { dailyRate: 2000 },
    },
    {
      id: 3,
      user: {
        name: 'ইমরান হোসেন',
        avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
      },
      languages: '["বাংলা", "সিলেট"]',
      pricing: { dailyRate: 1800 },
    },
    {
      id: 4,
      user: {
        name: 'তানিয়া আহমেদ',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
      },
      languages: '["বাংলা", "হিন্দি", "সুন্দরবন"]',
      pricing: { dailyRate: 2500 },
    },
  ];

  const displayGuides = guides && guides.length > 0 ? guides : defaultGuides;

  return (
    <section id="guides" className="py-16 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('জনপ্রিয় ট্যুর গাইড', 'Popular Tour Guides')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('আপনার ভ্রমণের জন্য সেরা গাইড খুঁজে নিন', 'Find the best guides for your trip')}
            </p>
          </div>
          <Link
            href="/#guides"
            className="hidden sm:flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors font-medium text-sm"
          >
            <span>{t('সব গাইড দেখুন', 'View All Guides')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayGuides.map((guide) => {
            let langs: string[] = [];
            try {
              langs = guide.languages ? JSON.parse(guide.languages) : ['বাংলা', 'ইংরেজি'];
            } catch {
              langs = ['বাংলা', 'ইংরেজি'];
            }

            const dailyRate = guide.pricing?.dailyRate || 1500;

            return (
              <div
                key={guide.id}
                className="info-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 p-5 group flex flex-col justify-between"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-teal-500/20 group-hover:border-teal-500/50 transition-all duration-300">
                      <img
                        src={
                          guide.user.avatar ||
                          'https://randomuser.me/api/portraits/men/32.jpg'
                        }
                        alt={guide.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {guide.user.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">4.9</span>
                    <span className="text-gray-500 text-xs">(১২০ {t('রিভিউ', 'reviews')})</span>
                  </div>

                  <div className="w-full flex flex-wrap justify-center gap-2 mb-4">
                    {langs.map((l, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 text-xs rounded-lg ${
                          idx === 2
                            ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600'
                            : 'bg-teal-50 dark:bg-teal-900/30 text-teal-600'
                        }`}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs text-gray-500 block">
                      {t('চার্জ/দিন', 'Charge/Day')}
                    </span>
                    <span className="text-lg font-bold text-teal-600">
                      ৳{dailyRate.toLocaleString()}
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/8801711000000?text=Hello%20${encodeURIComponent(guide.user.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 btn-primary text-white text-sm font-semibold rounded-xl"
                  >
                    <span>{t('বুক করুন', 'Book Now')}</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
