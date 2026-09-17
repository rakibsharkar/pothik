import React from 'react';
import prisma from '@/lib/prisma';
import { CalendarCheck, Phone, CheckCircle2, Clock, XCircle, DollarSign } from 'lucide-react';

export const revalidate = 0;

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      user: {
        select: { name: true, phone: true, email: true },
      },
      room: {
        include: {
          hotel: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { id: 'desc' },
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-600" />
            <span>রিসোর্ট বুকিং অর্ডার ব্যবস্থাপনা ({bookings.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            ওয়েবসাইটে আগত পর্যটকদের হোটেল ও রুম বুকিং রিকোয়েস্ট এবং পেমেন্ট মনিটরিং।
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">বুকিং আইডি</th>
                <th className="px-6 py-4">অতিথির নাম ও মোবাইল</th>
                <th className="px-6 py-4">হোটেল ও রুমের বিবরণ</th>
                <th className="px-6 py-4">তারিখ (চেক-ইন / আউট)</th>
                <th className="px-6 py-4">মোট পরিশোধ</th>
                <th className="px-6 py-4">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    এখনও কোনো বুকিং জমা পড়েনি।
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      #{b.id}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 dark:text-white block">
                        {b.user.name}
                      </span>
                      <span className="text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {b.user.phone || 'ফোন নেই'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white block">
                        {b.room.hotel.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {b.room.title}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-300">
                      <div>ইন: {new Date(b.checkIn).toLocaleDateString()}</div>
                      <div>আউট: {new Date(b.checkOut).toLocaleDateString()}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block text-sm">
                        ৳ {b.totalPrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        {b.paymentMethod}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                            : b.status === 'cancelled'
                            ? 'bg-rose-50 dark:bg-rose-950 text-rose-600'
                            : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                        }`}
                      >
                        {b.status === 'confirmed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{b.status}</span>
                      </span>
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
