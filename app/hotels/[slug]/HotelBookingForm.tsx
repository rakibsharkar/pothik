'use client';

import React, { useState } from 'react';
import { Calendar, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLangStore } from '@/store/useLangStore';

interface Room {
  id: number;
  title: string;
  price: number;
  discountPrice?: number | null;
  maxGuests: number;
}

interface HotelBookingFormProps {
  hotelId: number;
  hotelName: string;
  rooms: Room[];
}

export const HotelBookingForm: React.FC<HotelBookingFormProps> = ({ hotelId, hotelName, rooms }) => {
  const { t } = useLangStore();
  const [selectedRoomId, setSelectedRoomId] = useState<number>(rooms[0]?.id || 0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // Calculate nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();
  const roomPrice = selectedRoom ? (selectedRoom.discountPrice || selectedRoom.price) : 3500;
  const totalPrice = roomPrice * nights;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!selectedRoomId) {
      setErrorMessage(t('অনুগ্রহ করে একটি রুম নির্বাচন করুন', 'Please select a room.'));
      return;
    }
    if (!checkIn || !checkOut) {
      setErrorMessage(t('চেক-ইন এবং চেক-আউট তারিখ নির্বাচন করুন', 'Please select check-in and check-out dates.'));
      return;
    }
    if (!guestName || !guestPhone) {
      setErrorMessage(t('আপনার নাম ও মোবাইল নম্বর পূরণ করুন', 'Please enter your name and phone number.'));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoomId,
          checkIn,
          checkOut,
          guestName,
          guestPhone,
          totalPrice,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'বুকিং সম্পন্ন করা সম্ভব হয়নি।');
      }

      setSuccessMessage(
        t(
          `অভিনন্দন! আপনার বুকিং সফল হয়েছে। বুকিং আইডি: #${data.booking?.id || '101'}. আমাদের প্রতিনিধি দ্রুত যোগাযোগ করবেন।`,
          `Success! Your booking has been placed. ID: #${data.booking?.id || '101'}. Our concierge will call you shortly.`
        )
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-500" />
          <span>{t('অনলাইন রুম বুকিং', 'Instant Room Booking')}</span>
        </h3>
        <span className="px-2.5 py-1 rounded-full bg-orange-50 dark:bg-gray-800 text-orange-600 text-xs font-bold">
          {nights} {t('রাত', 'Night(s)')}
        </span>
      </div>

      {successMessage ? (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span>{t('বুকিং সফল!', 'Booking Confirmed!')}</span>
          </div>
          <p className="text-xs leading-relaxed">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage(null)}
            className="mt-2 text-xs font-bold text-emerald-700 underline"
          >
            {t('আরেকটি বুকিং করুন', 'Book another')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Select Room */}
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t('রুম নির্বাচন করুন', 'Select Room')}
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold outline-none focus:border-orange-500"
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.title} - ৳ {(room.discountPrice || room.price).toLocaleString()}/রাত
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t('চেক-ইন', 'Check In')}
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium outline-none focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t('চেক-আউট', 'Check Out')}
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          {/* Guest Contact */}
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t('আপনার পূর্ণ নাম', 'Full Name')}
            </label>
            <input
              type="text"
              placeholder="e.g. Asif Mahmud"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t('মোবাইল নম্বর', 'Mobile Number')}
            </label>
            <input
              type="tel"
              placeholder="01711-XXXXXX"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none focus:border-orange-500"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              {t('পেমেন্ট মাধ্যম', 'Payment Method')}
            </label>
            <div className="grid grid-cols-3 gap-2 text-center">
              {['bkash', 'nagad', 'card'].map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-1 rounded-xl font-bold uppercase transition-all ${
                    paymentMethod === method
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              {t('সর্বমোট পরিশোধযোগ্য:', 'Total Payable:')}
            </span>
            <span className="text-xl font-black text-orange-600 dark:text-orange-400">
              ৳ {totalPrice.toLocaleString()}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? t('প্রসেসিং হচ্ছে...', 'Processing...') : t('বুকিং কনফার্ম করুন', 'Confirm Booking')}</span>
          </button>
        </form>
      )}
    </div>
  );
};
