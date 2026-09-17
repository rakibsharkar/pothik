'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  LayoutDashboard,
  MapPin,
  Hotel,
  Utensils,
  UserCheck,
  CalendarCheck,
  Users,
  Shield,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useLangStore } from '@/store/useLangStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useThemeStore();
  const { lang, toggleLang, t } = useLangStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: '/admin', labelBn: 'ড্যাশবোর্ড', labelEn: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/spots', labelBn: 'পর্যটন স্পট', labelEn: 'Tourist Spots', icon: MapPin },
    { href: '/admin/hotels', labelBn: 'হোটেল ও রিসোর্ট', labelEn: 'Hotels & Stays', icon: Hotel },
    { href: '/admin/restaurants', labelBn: 'রেস্টুরেন্ট', labelEn: 'Restaurants', icon: Utensils },
    { href: '/admin/guides', labelBn: 'ট্যুর গাইড', labelEn: 'Tour Guides', icon: UserCheck },
    { href: '/admin/bookings', labelBn: 'বুকিং সমূহ', labelEn: 'Bookings', icon: CalendarCheck },
    { href: '/admin/users', labelBn: 'ইউজার ম্যানেজমেন্ট', labelEn: 'Users & KYC', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row text-gray-900 dark:text-gray-100 transition-colors">
      
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base tracking-tight gradient-text">Pothik Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between p-4 transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between px-3 py-3 mb-6">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-500/25">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight gradient-text">পথিক এডমিন</span>
                <span className="block text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400">
                  Control Center
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-gray-800 hover:text-teal-600 dark:hover:text-teal-400'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{t(item.labelBn, item.labelEn)}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
          {/* View Website */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              {t('মূল ওয়েবসাইট দেখুন', 'View Website')}
            </span>
          </Link>

          {/* Admin User Profile */}
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="leading-tight">
                <span className="font-bold text-xs block text-gray-900 dark:text-white">Admin</span>
                <span className="text-[10px] text-gray-400">admin@tourbd.com</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-gray-500 hover:text-amber-500"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={toggleLang}
                className="px-1.5 py-0.5 rounded text-[10px] font-bold text-teal-600 hover:bg-teal-50 dark:hover:bg-gray-700"
              >
                {lang === 'bn' ? 'EN' : 'বাং'}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
