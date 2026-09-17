import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { MapPin, Plus, Eye, Star, Search, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function AdminSpotsPage() {
  const spots = await prisma.spot.findMany({
    include: {
      district: {
        include: {
          division: true,
        },
      },
    },
    orderBy: { id: 'desc' },
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-teal-600" />
            <span>পর্যটন স্পট ব্যবস্থাপনা ({spots.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            বাংলাদেশের সকল পর্যটন স্পটের তালিকা, সম্পাদন ও নতুন স্পট অন্তর্ভুক্তি।
          </p>
        </div>

        <Link
          href="/admin/spots/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন স্পট যুক্ত করুন</span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">স্পট ও ছবি</th>
                <th className="px-6 py-4">জেলা ও বিভাগ</th>
                <th className="px-6 py-4">ভ্রমণের সেরা সময়</th>
                <th className="px-6 py-4">প্রবেশ ফি</th>
                <th className="px-6 py-4">ফিচার্ড স্ট্যাটাস</th>
                <th className="px-6 py-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {spots.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    কোনো স্পট পাওয়া যায়নি। নতুন স্পট যোগ করুন।
                  </td>
                </tr>
              ) : (
                spots.map((spot) => (
                  <tr key={spot.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={spot.thumbnail || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=200&auto=format&fit=crop'}
                          alt={spot.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block text-sm">
                            {spot.name}
                          </span>
                          <span className="text-gray-400 text-xs">/{spot.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                        {spot.district.name}
                      </span>
                      <span className="text-[11px] text-teal-600 dark:text-teal-400">
                        {spot.district.division.name} বিভাগ
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {spot.bestTimeToVisit || 'সারাবছর'}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-teal-600 dark:text-teal-400">
                        {spot.entryFeeLocal > 0 ? `৳ ${spot.entryFeeLocal}` : 'ফ্রি'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {spot.isFeatured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 text-xs font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          ফিচার্ড
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">স্ট্যান্ডার্ড</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/spots/${spot.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-teal-600 hover:text-white text-gray-700 dark:text-gray-200 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>লাইভ দেখুন</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
