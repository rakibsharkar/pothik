'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, PhoneCall, ShieldCheck, Mail, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { useLangStore } from '@/store/useLangStore';

export const Footer = () => {
  const { t } = useLangStore();

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800 text-sm">
      {/* Top Banner: Emergency Helpline */}
      <div className="bg-gradient-to-r from-teal-900/80 via-teal-800/80 to-slate-900 border-b border-teal-500/20 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <PhoneCall className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm sm:text-base">
                {t('জরুরি ট্যুরিস্ট হেল্পলাইন ও সহায়তা', 'Emergency Tourist Helpline')}
              </h4>
              <p className="text-teal-200/80 text-xs">
                {t('ভ্রমণে যেকোনো সমস্যায় বাংলাদেশ ট্যুরিস্ট পুলিশ সর্বদা আপনার পাশে।', 'Tourist Police Bangladesh is 24/7 dedicated to traveler safety.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:999"
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              {t('জরুরি কল: ৯৯৯', 'Emergency: 999')}
            </a>
            <a
              href="tel:01320163599"
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('ট্যুরিস্ট পুলিশ: ০১৩২০-১৬৩৫৯৯', 'Tourist Police Hotline')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-500/25">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                {t('পথিক', 'Pothik')}
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              {t(
                'বাংলাদেশের ৬৪ জেলার প্রতিটি পর্যটন আকর্ষণ, ইকো রিসোর্ট বুকিং এবং ভেরিফাইড ট্যুর গাইড সুবিধার আধুনিক ডিজিটাল প্ল্যাটফর্ম।',
                'Next-generation smart tourism ecosystem connecting travelers with authentic destinations, vetted eco-stays, and local experts.'
              )}
            </p>
            <div className="flex items-center gap-3 text-xs text-teal-400 font-semibold">
              <span className="px-2.5 py-1 rounded-lg bg-teal-950 border border-teal-800">
                ৬৪ জেলা কভারেজ
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-teal-950 border border-teal-800">
                ১০০% ভেরিফাইড
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              {t('গন্তব্যসমূহ', 'Destinations')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="#spots" className="hover:text-teal-400 transition-colors">
                  {t('সাজেক ভ্যালি', 'Sajek Valley')}
                </Link>
              </li>
              <li>
                <Link href="#spots" className="hover:text-teal-400 transition-colors">
                  {t('কক্সবাজার সমুদ্র সৈকত', "Cox's Bazar Beach")}
                </Link>
              </li>
              <li>
                <Link href="#spots" className="hover:text-teal-400 transition-colors">
                  {t('সুন্দরবন ম্যানগ্রোভ', 'Sundarbans Mangrove')}
                </Link>
              </li>
              <li>
                <Link href="#spots" className="hover:text-teal-400 transition-colors">
                  {t('সেন্টমার্টিন দ্বীপ', "Saint Martin's Island")}
                </Link>
              </li>
              <li>
                <Link href="#spots" className="hover:text-teal-400 transition-colors">
                  {t('শ্রীমঙ্গল চা বাগান', 'Sreemangal Tea Estates')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              {t('সার্ভিস সমূহ', 'Services')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="#hotels" className="hover:text-teal-400 transition-colors">
                  {t('হোটেল ও রিসোর্ট বুকিং', 'Resort & Hotel Booking')}
                </Link>
              </li>
              <li>
                <Link href="#guides" className="hover:text-teal-400 transition-colors">
                  {t('লাইসেন্সপ্রাপ্ত ট্যুর গাইড', 'Certified Tour Guides')}
                </Link>
              </li>
              <li>
                <Link href="#restaurants" className="hover:text-teal-400 transition-colors">
                  {t('ঐতিহ্যবাহী রেস্টুরেন্ট', 'Local Authentic Foods')}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  <span>{t('এডমিন ড্যাশবোর্ড', 'Admin Control')}</span>
                  <ArrowUpRight className="w-3 h-3 text-teal-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              {t('যোগাযোগ', 'Contact')}
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-500" />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-500" />
                <span>support@tourbd.com</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-teal-500" />
                <span>+880 1711-000000</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} পথিক (Pothik) - সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-1">
            <span>নির্মিত হয়েছে ভালোবাসা দিয়ে</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline mx-0.5" />
            <span>বাংলাদেশে</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
