import React from 'react';
import prisma from '@/lib/prisma';
import { Users, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

export const revalidate = 0;

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { id: 'desc' },
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-600" />
            <span>ইউজার ও কেওয়াইসি (KYC) ব্যবস্থাপনা ({users.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            প্ল্যাটফর্মের নিবন্ধিত ইউজার, পার্টনার এবং জাতীয় পরিচয়পত্র ভেরিফিকেশন স্ট্যাটাস।
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">ইউজার ও প্রোফাইল</th>
                <th className="px-6 py-4">ইমেইল ও মোবাইল</th>
                <th className="px-6 py-4">রোল (Role)</th>
                <th className="px-6 py-4">কেওয়াইসি স্ট্যাটাস</th>
                <th className="px-6 py-4">নিবন্ধন তারিখ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-600/10 text-teal-600 flex items-center justify-center font-bold text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">
                          {u.name}
                        </span>
                        <span className="text-gray-400 text-xs">ID: #{u.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{u.email}</span>
                    </div>
                    {u.phone && (
                      <div className="flex items-center gap-1.5 mt-0.5 text-teal-600">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{u.phone}</span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold uppercase text-[11px]">
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        u.kycStatus === 'verified'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {u.kycStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
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
