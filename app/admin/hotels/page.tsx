import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Hotel as HotelIcon, Star, MapPin, Eye, Plus } from 'lucide-react';

export const revalidate = 0;

export default async function AdminHotelsPage() {
  const hotels = await prisma.hotel.findMany({
    include: {
      spot: true,
      rooms: true,
    },
    orderBy: { id: 'desc' },
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <HotelIcon className="w-6 h-6 text-orange-600" />
            <span>হোটেল ও ইকো রিসোর্ট ব্যবস্থাপনা ({hotels.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            নিবন্ধিত আবাসিক হোটেল, রিসোর্ট ও রুম ইনভেন্টরি পর্যবেক্ষণ।
          </p>
        </div>

        <Link
          href="/admin/hotels/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন হোটেল যুক্ত করুন</span>
        </Link>
      </div>


      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">হোটেলের নাম</th>
                <th className="px-6 py-4">ট্যুরিস্ট স্পট</th>
                <th className="px-6 py-4">রুম সংখ্যা</th>
                <th className="px-6 py-4">রেটিং</th>
                <th className="px-6 py-4">ভেরিফিকেশন</th>
                <th className="px-6 py-4 text-right">ভিউ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {hotels.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={h.featuredImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=200&auto=format&fit=crop'}
                        alt={h.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block text-sm">
                          {h.name}
                        </span>
                        <span className="text-gray-400 text-xs">{h.address || 'বাংলাদেশ'}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {h.spot ? h.spot.name : 'সার্বজনীন'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold text-xs">
                      {h.rooms.length} টি রুম
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{h.rating > 0 ? h.rating.toFixed(1) : '৪.৮'}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-xs font-bold">
                      {h.isVerified ? 'ভেরিফাইড' : 'একটিভ'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/hotels/${h.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-orange-600 hover:text-white text-gray-700 dark:text-gray-200 text-xs font-semibold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>লাইভ দেখুন</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
