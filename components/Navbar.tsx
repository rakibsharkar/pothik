'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plane, Moon, Sun, Menu, X } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useLangStore } from '@/store/useLangStore';

export const Navbar = () => {
  const { isDark, toggleTheme, setTheme } = useThemeStore();
  const { lang, toggleLang, t } = useLangStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('pothik-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme(true);
    }
  }, [setTheme]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black gradient-text tracking-tight" id="logo-text">
              {t('পথিক', 'Pothik')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-semibold"
            >
              {t('হোম', 'Home')}
            </Link>
            <Link
              href="/#spots"
              className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
            >
              {t('টুরিস্ট স্পট', 'Spots')}
            </Link>
            <Link
              href="/#hotels"
              className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
            >
              {t('হোটেল', 'Hotels')}
            </Link>
            <Link
              href="/#restaurants"
              className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
            >
              {t('রেস্টুরেন্ট', 'Restaurants')}
            </Link>
            <Link
              href="/#guides"
              className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
            >
              {t('গাইড', 'Guides')}
            </Link>
            <Link
              href="/#contact"
              className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
            >
              {t('যোগাযোগ', 'Contact')}
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              id="lang-toggle"
              onClick={toggleLang}
              className="hidden sm:flex px-3 py-2 text-sm font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-transparent dark:border-gray-700/60 transition-colors"
            >
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="dark-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
              title="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Admin / Dashboard Button */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl btn-shine shadow-sm transition-all"
            >
              <span>{t('ড্যাশবোর্ড', 'Dashboard')}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in-up">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-900 dark:text-white"
              >
                {t('হোম', 'Home')}
              </Link>
              <Link
                href="/#spots"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
              >
                {t('টুরিস্ট স্পট', 'Spots')}
              </Link>
              <Link
                href="/#hotels"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
              >
                {t('হোটেল', 'Hotels')}
              </Link>
              <Link
                href="/#restaurants"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
              >
                {t('রেস্টুরেন্ট', 'Restaurants')}
              </Link>
              <Link
                href="/#guides"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
              >
                {t('গাইড', 'Guides')}
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-4 mt-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl text-center"
              >
                {t('ড্যাশবোর্ড', 'Dashboard')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
