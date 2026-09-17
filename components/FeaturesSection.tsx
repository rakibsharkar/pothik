'use client';

import React from 'react';
import { ShieldCheck, CreditCard, Headphones, Users } from 'lucide-react';
import { useLangStore } from '@/store/useLangStore';

export const FeaturesSection = () => {
  const { t } = useLangStore();

  return (
    <section className="py-16 bg-gray-100/50 dark:bg-gray-800/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-teal-500/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {t('নিরাপদ বুকিং', 'Safe Booking')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('১০০% সিকিউর', '100% Secure')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-teal-500/30">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {t('সহজ পেমেন্ট', 'Easy Payment')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('বিকাশ, নগদ, কার্ড', 'bKash, Nagad, Card')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-teal-500/30">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {t('২৪/৭ সাপোর্ট', '24/7 Support')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('সবসময় সেবায়', 'Always Available')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-teal-500/30">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {t('বিশ্বস্ত সম্প্রদায়', 'Trusted Community')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('১০,০০০+ গ্রাহক', '10,000+ Travelers')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
