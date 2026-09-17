import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Utensils, Plus, Star, Clock, MapPin } from 'lucide-react';

export const revalidate = 0;

export default async function AdminRestaurantsPage() {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      district: { select: { name: true } },
      division: { select: { name: true } },
    },
    orderBy: { id: 'desc' },
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Utensils className="w-6 h-6 text-rose-600" />
            <span>রেস্টুরেন্ট ও খাবার ব্যবস্থাপনা ({restaurants.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            পর্যটন এলাকার ঐতিহ্যবাহী খাবার, সিগনেচার ডিশ ও রেস্টুরেন্ট তালিকা।
          </p>
        </div>

        <Link
          href="/admin/restaurants/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন রেস্টুরেন্ট যুক্ত করুন</span>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">রেস্টুরেন্ট</th>
                <th className="px-6 py-4">ক্যাটাগরি</th>
                <th className="px-6 py-4">অবস্থান (জেলা)</th>
                <th className="px-6 py-4">সময়সূচী</th>
                <th className="px-6 py-4">মূল্য পরিসীমা</th>
                <th className="px-6 py-4">রেটিং</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {restaurants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    কোনো রেস্টুরেন্ট পাওয়া যায়নি। নতুন রেস্টুরেন্ট যোগ করুন।
                  </td>
                </tr>
              ) : (
                restaurants.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={res.featuredImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=200&auto=format&fit=crop'}
                          alt={res.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block text-sm">
                            {res.name}
                          </span>
                          <span className="text-gray-400 text-xs">/{res.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-semibold text-xs">
                        {res.category || 'Dining'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                      {res.district.name}, {res.division.name}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {res.openingTime || '09:00 AM'} - {res.closingTime || '10:00 PM'}
                    </td>

                    <td className="px-6 py-4 font-bold text-amber-500">
                      {res.priceRange || '$$'}
                    </td>

                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {res.avgRating > 0 ? res.avgRating.toFixed(1) : '4.8'}
                        </span>
                      </div>
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
