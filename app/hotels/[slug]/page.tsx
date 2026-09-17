import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Hotel as HotelIcon,
  Star,
  MapPin,
  Phone,
  Wifi,
  Coffee,
  Sparkles,
  Users,
  Bed,
  Check,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { HotelBookingForm } from './HotelBookingForm';

interface HotelPageProps {
  params: Promise<{ slug: string }>;
}

export default async function HotelDetailsPage({ params }: HotelPageProps) {
  const { slug } = await params;

  const hotel = await prisma.hotel.findUnique({
    where: { slug },
    include: {
      spot: {
        include: {
          district: true,
        },
      },
      rooms: true,
      reviews: {
        include: {
          user: {
            select: { name: true, avatar: true },
          },
        },
      },
    },
  });

  if (!hotel) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Breadcrumb */}
        <div className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-100 dark:border-gray-800 py-3.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-orange-600 dark:hover:text-orange-400">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/#hotels" className="hover:text-orange-600 dark:hover:text-orange-400">
              হোটেল ও রিসোর্ট
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-white font-medium truncate">
              {hotel.name}
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative h-[320px] sm:h-[440px] w-full overflow-hidden bg-gray-900">
          <img
            src={
              hotel.featuredImage ||
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop'
            }
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />

          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-bold shadow">
                  <MapPin className="w-3.5 h-3.5" />
                  {hotel.spot ? hotel.spot.name : 'বাংলাদেশ'}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  ভেরিফাইড রিসোর্ট
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {hotel.rating > 0 ? hotel.rating.toFixed(1) : '৪.৮'} ({hotel.totalReviews || 45} রিভিউ)
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {hotel.name}
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl">
                {hotel.address || 'শান্ত-স্নিগ্ধ মনোরম প্রাকৃতিক পরিবেশে অবস্থিত আধুনিক সুবিধাসম্পন্ন রিসোর্ট'}
              </p>
            </div>
          </div>
        </div>

        {/* Rooms and Booking Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Rooms List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HotelIcon className="w-6 h-6 text-orange-500" />
                <span>উপলব্ধ রুম ও সুইটসমূহ</span>
              </h2>

              {hotel.rooms.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <p className="text-gray-500">বর্তমানে কোনো রুম বুকিংয়ের জন্য খালি নেই।</p>
                </div>
              ) : (
                hotel.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-orange-500/30 transition-all flex flex-col sm:flex-row justify-between gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between sm:justify-start gap-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {room.title}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                          খালি আছে
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {room.description ||
                          'প্রাকৃতিক ভিউ সহ ব্যালকনি, আধুনিক বাথরুম, ২৪ ঘণ্টা গরম পানি এবং রুম সার্ভিস সুবিধা।'}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-teal-600" />
                          সর্বোচ্চ {room.maxGuests} জন অতিথি
                        </span>
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-orange-500" />
                          {room.bedType}
                        </span>
                        <span className="flex items-center gap-1">
                          <Wifi className="w-3.5 h-3.5 text-teal-600" />
                          ফ্রি হাই-স্পিড ওয়াইফাই
                        </span>
                      </div>
                    </div>

                    <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                      <div>
                        <span className="text-[11px] uppercase font-bold text-gray-400 block">
                          প্রতি রাত
                        </span>
                        <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
                          ৳ {room.price.toLocaleString()}
                        </span>
                      </div>

                      <a
                        href="#booking-box"
                        className="mt-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all"
                      >
                        বুকিং করুন
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sidebar Booking Form */}
            <div id="booking-box" className="space-y-6">
              <HotelBookingForm hotelId={hotel.id} hotelName={hotel.name} rooms={hotel.rooms} />

              <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">হোটেল পলিসি</h4>
                <p>• চেক-ইন: দুপুর ১২:০০ টা | চেক-আউট: সকাল ১১:০০ টা</p>
                <p>• বুকিং নিশ্চিত করতে ৫০% অগ্রিম পেমেন্ট বাধ্যতামূলক।</p>
                <p>• চেক-ইন এর ২৪ ঘণ্টা আগে বাতিল করলে সম্পূর্ণ রিফান্ড।</p>
              </div>

              <Link
                href="/#hotels"
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>অন্যান্য রিসোর্ট দেখুন</span>
              </Link>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
