import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { UserCheck, ShieldCheck, Award, MessageCircle, Plus } from 'lucide-react';

export const revalidate = 0;

export default async function AdminGuidesPage() {
  const guides = await prisma.guide.findMany({
    include: {
      user: true,
      pricing: true,
    },
    orderBy: { id: 'desc' },
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600" />
            <span>ট্যুর গাইড ব্যবস্থাপনা ({guides.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            স্থানীয় অনুমোদিত গাইডদের তালিকা, জাতীয় পরিচয়পত্র (KYC) যাচাই ও দৈনিক ফি বিবরণ।
          </p>
        </div>

        <Link
          href="/admin/guides/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন গাইড যুক্ত করুন</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">গাইডের নাম ও প্রোফাইল</th>
                <th className="px-6 py-4">অভিজ্ঞতা</th>
                <th className="px-6 py-4">স্পেশালাইজেশন</th>
                <th className="px-6 py-4">দৈনিক ফি</th>
                <th className="px-6 py-4">KYC স্ট্যাটাস</th>
                <th className="px-6 py-4 text-right">যোগাযোগ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {guides.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={g.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'}
                        alt={g.user.name}
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">
                          {g.user.name}
                        </span>
                        <span className="text-gray-400 text-xs">{g.user.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {g.yearsOfExperience} বছর
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {g.specialization || 'ট্রেকিং ও ট্যুর গাইড'}
                  </td>

                  <td className="px-6 py-4 font-bold text-emerald-600">
                    ৳ {g.pricing?.dailyRate?.toLocaleString() || '১,৫০০'}/দিন
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-xs font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      {g.kycVerified ? 'ভেরিফাইড' : 'পেন্ডিং'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <a
                      href={`https://wa.me/88${g.whatsappNumber || '01711000000'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>হোয়াটসঅ্যাপ</span>
                    </a>
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
