'use client';

import React from 'react';
import { Quote, Star } from 'lucide-react';
import { useLangStore } from '@/store/useLangStore';

export const TestimonialsSection = () => {
  const { t } = useLangStore();

  const testimonials = [
    {
      id: 1,
      quote: 'সাজেক ভ্যালি ট্যুর ছিল অসাধারণ! সব ব্যবস্থাপনা নিখুঁত ছিল। ধন্যবাদ বাংলা ট্যুর গাইড।',
      name: 'রাফি আহমেদ',
      city: 'ঢাকা',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 2,
      quote: 'কক্সবাজার ট্যুর আমার জীবনের সেরা অভিজ্ঞতা। হোটেল বুকিং থেকে গাইড সবই পারফেক্ট।',
      name: 'সাবরিনা খান',
      city: 'চট্টগ্রাম',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 3,
      quote: 'সুন্দরবন ট্যুরের পরিকল্পনা ছিল দারুণ। গাইড সাহেব খুবই অভিজ্ঞ এবং সাহায্যকারী।',
      name: 'ইমরান হোসেন',
      city: 'সিলেট',
      avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-teal-500 to-teal-600 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {t('সন্তুষ্ট ভ্রমণকারীদের মতামত', 'What Our Travelers Say')}
          </h2>
          <p className="text-white/80 mt-2">
            {t('হাজারো সন্তুষ্ট গ্রাহকের বিশ্বস্ততা', 'Trusted by thousands of happy travelers')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <Quote className="w-10 h-10 text-white/30 mb-4" />
              <p className="text-white/90 mb-6 leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-white">{item.name}</div>
                  <div className="text-sm text-white/60">{item.city}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
