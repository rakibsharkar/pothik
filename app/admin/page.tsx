import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  MapPin,
  Hotel,
  Utensils,
  CalendarCheck,
  UserCheck,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
  DollarSign,
  Clock,
} from 'lucide-react';

export const revalidate = 0; // dynamic dashboard

export default async function AdminDashboardPage() {
  // Query live counts from Prisma
  const [
    spotsCount,
    hotelsCount,
    restaurantsCount,
    guidesCount,
    bookingsCount,
    usersCount,
    recentBookings,
    recentSpots,
  ] = await Promise.all([
    prisma.spot.count(),
    prisma.hotel.count(),
    prisma.restaurant.count(),
    prisma.guide.count(),
    prisma.booking.count(),
    prisma.user.count(),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, phone: true } },
        room: {
          include: {
            hotel: { select: { name: true } },
          },
        },
      },
    }),
    prisma.spot.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        district: { select: { name: true } },
      },
    }),
  ]);

  const stats = [
    { label: 'মোট পর্যটন স্পট', count: spotsCount, icon: MapPin, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/50', href: '/admin/spots' },
    { label: 'মোট হোটেল ও স্টে', count: hotelsCount, icon: Hotel, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/50', href: '/admin/hotels' },
    { label: 'রেস্টুরেন্ট ও ফুড', count: restaurantsCount, icon: Utensils, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/50', href: '/admin/restaurants' },
    { label: 'মোট বুকিং সংখ্যা', count: bookingsCount, icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/50', href: '/admin/bookings' },
    { label: 'ভেরিফাইড গাইড', count: guidesCount, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/50', href: '/admin/guides' },
    { label: 'নিবন্ধিত ইউজার', count: usersCount, icon: Users, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-950/50', href: '/admin/users' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next.js 15 App Router & Prisma SQLite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            অ্যাডমিন ড্যাশবোর্ড (Overview)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            পথিক ট্যুরিজম ইকোসিস্টেমের সার্বিক তথ্য ও ব্যবস্থাপনা নিয়ন্ত্রণ কেন্দ্র।
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/spots/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন স্পট যুক্ত করুন</span>
          </Link>

          <Link
            href="/admin/restaurants/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন রেস্টুরেন্ট</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              href={stat.href}
              className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {stat.count}
                </span>
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mt-0.5 truncate">
                  {stat.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two-Column Grid: Recent Spots & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Spots */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>সাম্প্রতিক পর্যটন স্পটসমূহ</span>
            </h3>
            <Link
              href="/admin/spots"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              সব দেখুন <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentSpots.map((spot) => (
              <div
                key={spot.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={spot.thumbnail || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=200&auto=format&fit=crop'}
                    alt={spot.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      {spot.name}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      জেলা: {spot.district.name} • {spot.difficultyLevel || 'সহজ'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 font-bold text-xs">
                    {spot.entryFeeLocal > 0 ? `৳ ${spot.entryFeeLocal}` : 'ফ্রি'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>সর্বশেষ রিসোর্ট বুকিং অর্ডার</span>
            </h3>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              সব দেখুন <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              এখনও কোনো বুকিং জমা পড়েনি।
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs"
                >
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">
                      #{b.id} - {b.room.hotel.name}
                    </span>
                    <span className="text-gray-500">
                      অতিথি: {b.user.name} ({b.user.phone})
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-teal-600 block">
                      ৳ {b.totalPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 text-[10px] font-bold">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
