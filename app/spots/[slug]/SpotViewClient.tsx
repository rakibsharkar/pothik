'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Star,
  Eye,
  Clock,
  Signal,
  Share2,
  Heart,
  Info,
  Tag,
  Route,
  ArrowRight,
  CloudSun,
  Snowflake,
  Flower2,
  Sun,
  CloudRain,
  Lightbulb,
  Tent,
  Sunrise,
  Cloud,
  Mountain,
  Building2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  CalendarDays,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Edit3,
  ThumbsUp,
  Map,
  Navigation,
  Landmark,
  Images,
  X,
  Hotel as HotelIcon,
  Utensils,
  Check,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface SpotViewProps {
  spot: any;
}

// Convert numbers to Bengali digits
const toBengaliNumber = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
};

// Translate English district/division names to Bengali if needed
const toBengaliPlace = (str: string): string => {
  if (!str) return '';
  const map: Record<string, string> = {
    'Chattogram': 'চট্টগ্রাম',
    'Chittagong': 'চট্টগ্রাম',
    'Rangamati': 'রাঙামাটি',
    'Khagrachhari': 'খাগড়াছড়ি',
    'Bandarban': 'বান্দরবান',
    "Cox's Bazar": 'কক্সবাজার',
    'Coxs Bazar': 'কক্সবাজার',
    'Dhaka': 'ঢাকা',
    'Sylhet': 'সিলেট',
    'Moulvibazar': 'মৌলভীবাজার',
    'Barishal': 'বরিশাল',
    'Rajshahi': 'রাজশাহী',
    'Khulna': 'খুলনা',
    'Rangpur': 'রংপুর',
    'Mymensingh': 'ময়মনসিংহ',
    'Bagaichhari': 'বাঘাইছড়ি',
    'Baghaichhari': 'বাঘাইছড়ি',
  };
  return map[str.trim()] || str;
};

export const SpotViewClient: React.FC<SpotViewProps> = ({ spot }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Review like tracking
  const [likedReviews, setLikedReviews] = useState<Record<number | string, number>>({
    1: 25,
    2: 18,
  });
  const [hasLikedReview, setHasLikedReview] = useState<Record<number | string, boolean>>({});

  // 1. Image Gallery setup
  const defaultGallery = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1920&q=80',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80',
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1920&q=80',
  ];

  let parsedImages: string[] = [];
  try {
    if (spot.images) {
      const parsed = JSON.parse(spot.images);
      if (Array.isArray(parsed) && parsed.length > 0) parsedImages = parsed;
    }
  } catch {
    parsedImages = [];
  }

  if (spot.thumbnail && !parsedImages.includes(spot.thumbnail)) {
    parsedImages.unshift(spot.thumbnail);
  }

  // Ensure multiple gallery images for thumbnail strip & lightbox
  let gallery: string[] = [];
  if (parsedImages.length > 1) {
    gallery = parsedImages;
  } else if (parsedImages.length === 1) {
    gallery = [parsedImages[0], ...defaultGallery.slice(1)];
  } else {
    gallery = defaultGallery;
  }

  // 2. Feature Tags Setup
  const tagColorPalette = [
    'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  ];

  const tagDictionary: Record<string, { label: string; color: string }> = {
    hill: { label: '🏔️ পাহাড়', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' },
    hills: { label: '🏔️ পাহাড়', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' },
    beach: { label: '🏖️ সমুদ্র সৈকত', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    beaches: { label: '🏖️ সমুদ্র সৈকত', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    lake: { label: '🌊 হ্রদ / লেক', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' },
    lakes: { label: '🌊 হ্রদ / লেক', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' },
    river: { label: '🛶 নদী', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
    rivers: { label: '🛶 নদী', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
    waterfall: { label: '💧 ঝর্ণা', color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300' },
    waterfalls: { label: '💧 ঝর্ণা', color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300' },
    island: { label: '🏝️ দ্বীপ', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
    islands: { label: '🏝️ দ্বীপ', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
    forest: { label: '🌲 বন / জঙ্গল', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    forests: { label: '🌲 বন / জঙ্গল', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    tea_garden: { label: '🍃 চা বাগান', color: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300' },
    park: { label: '🌳 পার্ক', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
    botanical: { label: '🌿 বোটানিক্যাল গার্ডেন', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' },
    wildlife: { label: '🦌 বন্যপ্রাণী', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
    eco_tourism: { label: '🌱 ইকো ট্যুরিজম', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    nature: { label: '🌄 মনোরম প্রকৃতি', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' },
    adventure: { label: '🧗 অ্যাডভেঞ্চার', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
    family_friendly: { label: '👨‍👩‍👧 পারিবারিক', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
    religious: { label: '🕊️ ধর্মীয় স্থান', color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' },
    temple: { label: '🛕 মন্দির', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
    mosque: { label: '🕌 মসজিদ', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
    church: { label: '⛪ গির্জা', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    pagoda: { label: '⛩️ প্যাগোডা', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
    historical: { label: '🏛️ ঐতিহাসিক', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' },
    archaeological: { label: '🏺 প্রত্নতাত্ত্বিক', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
    monument: { label: '🗿 স্মৃতিস্তম্ভ', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
    museum: { label: '🏢 জাদুঘর', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    cultural: { label: '🎭 সাংস্কৃতিক', color: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300' },
    cave: { label: '🕳️ গুহা', color: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300' },
    resort: { label: '🏨 রিসোর্ট', color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300' },
    haor: { label: '⛵ হাওর', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' },
    swamp_forest: { label: '🌴 জলাবন', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' },
    village: { label: '🏡 গ্রাম্য পরিবেশ', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
    heritage: { label: '📜 ঐতিহ্যবাহী স্থান', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
    clouds: { label: '☁️ মেঘের রাজ্য', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    cloud_view: { label: '☁️ মেঘের রাজ্য', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    sunrise: { label: '🌅 সূর্যোদয়', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
    sunrise_view: { label: '🌅 সূর্যোদয়', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
    sunset: { label: '🌇 সূর্যাস্ত', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
    sunset_view: { label: '🌇 সূর্যাস্ত', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
    camping: { label: '🏕️ ক্যাম্পিং', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
    photography: { label: '📸 ফটোগ্রাফি', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
    hiking: { label: '🥾 ট্র্যাকিং', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
    boating: { label: '🚤 নৌকা ভ্রমণ', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' },
    swimming: { label: '🏊 সাঁতার', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    fishing: { label: '🎣 মাছ ধরা', color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300' },
    bonfire: { label: '🔥 ক্যাম্পফায়ার', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
    star_gazing: { label: '✨ তারা দর্শন', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
  };

  let rawFeatureTags: string[] = [];
  try {
    if (spot.featureTags) {
      const parsed = typeof spot.featureTags === 'string' ? JSON.parse(spot.featureTags) : spot.featureTags;
      if (Array.isArray(parsed) && parsed.length > 0) rawFeatureTags = parsed;
    }
  } catch {
    rawFeatureTags = [];
  }
  if (rawFeatureTags.length === 0) {
    rawFeatureTags = ['hill', 'clouds', 'sunrise', 'forest', 'camping', 'photography'];
  }

  const formattedFeatureTags = rawFeatureTags.map((tag, idx) => {
    const cleanKey = String(tag).trim().toLowerCase().replace(/[-\s]+/g, '_');
    if (tagDictionary[cleanKey]) {
      return tagDictionary[cleanKey];
    }
    return {
      label: tag.startsWith('🏔️') || tag.startsWith('☁️') || tag.startsWith('🌅') || tag.startsWith('🌲') ? tag : `✨ ${tag}`,
      color: tagColorPalette[idx % tagColorPalette.length],
    };
  });

  // Seasonal Weather Setup
  interface WeatherSeasonItem {
    season: string;
    period: string;
    temperature: string;
  }

  const seasonConfigs: Record<string, { nameBn: string; icon: string; bg: string; iconColor: string; defaultPeriod: string; defaultTemp: string }> = {
    Winter: {
      nameBn: 'শীতকাল',
      icon: 'snowflake',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500',
      defaultPeriod: 'ডিসেম্বর - ফেব্রুয়ারি',
      defaultTemp: '৮°C - ২০°C',
    },
    Spring: {
      nameBn: 'বসন্তকাল',
      icon: 'flower',
      bg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-500',
      defaultPeriod: 'মার্চ - এপ্রিল',
      defaultTemp: '১৫°C - ২৮°C',
    },
    Summer: {
      nameBn: 'গ্রীষ্মকাল',
      icon: 'sun',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-500',
      defaultPeriod: 'মে - জুন',
      defaultTemp: '২০°C - ৩২°C',
    },
    Monsoon: {
      nameBn: 'বর্ষাকাল',
      icon: 'rain',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      iconColor: 'text-cyan-500',
      defaultPeriod: 'জুলাই - সেপ্টেম্বর',
      defaultTemp: '১৮°C - ২৬°C',
    },
    Autumn: {
      nameBn: 'শরৎকাল',
      icon: 'sun-cloud',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-500',
      defaultPeriod: 'সেপ্টেম্বর - অক্টোবর',
      defaultTemp: '২২°C - ২৯°C',
    },
    'Late Autumn': {
      nameBn: 'হেমন্তকাল',
      icon: 'sun-cloud',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-500',
      defaultPeriod: 'নভেম্বর - ডিসেম্বর',
      defaultTemp: '১৪°C - ২৫°C',
    },
  };

  let parsedWeather: WeatherSeasonItem[] = [];
  try {
    if (spot.bestTimeDetails) {
      const parsed = typeof spot.bestTimeDetails === 'string' ? JSON.parse(spot.bestTimeDetails) : spot.bestTimeDetails;
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].season) {
        parsedWeather = parsed;
      }
    }
  } catch {
    parsedWeather = [];
  }

  const defaultWeather: WeatherSeasonItem[] = [
    { season: 'Winter', period: 'ডিসেম্বর - ফেব্রুয়ারি', temperature: '৮°C - ২০°C' },
    { season: 'Spring', period: 'মার্চ - এপ্রিল', temperature: '১৫°C - ২৮°C' },
    { season: 'Summer', period: 'মে - জুন', temperature: '২০°C - ৩২°C' },
    { season: 'Monsoon', period: 'জুলাই - সেপ্টেম্বর', temperature: '১৮°C - ২৬°C' },
  ];

  const seasonsToDisplay = parsedWeather.length > 0 ? parsedWeather : defaultWeather;

  const bestTimeCalloutText = (() => {
    if (spot.bestTimeToVisit) {
      if (
        spot.bestTimeDetails &&
        typeof spot.bestTimeDetails === 'string' &&
        !spot.bestTimeDetails.trim().startsWith('[') &&
        !spot.bestTimeDetails.trim().startsWith('{')
      ) {
        return `${spot.bestTimeToVisit} — ${spot.bestTimeDetails}`;
      }
      return `${spot.bestTimeToVisit} — আকাশ পরিষ্কার থাকে এবং আবহাওয়া ভ্রমণের জন্য সবচেয়ে চমৎকার থাকে`;
    }
    return 'অক্টোবর থেকে মার্চ — আকাশ পরিষ্কার থাকে এবং মেঘ ও প্রকৃতির মনোরম দৃশ্য উপভোগ করা যায়';
  })();


  // 3. Location Names & Place translation
  const rawDivision = spot.division?.name || spot.district?.division?.name || 'চট্টগ্রাম';
  const rawDistrict = spot.district?.name || 'রাঙামাটি';
  const rawUpazila = spot.upazila?.name || 'বাঘাইছড়ি';

  const divisionName = toBengaliPlace(rawDivision);
  const districtName = toBengaliPlace(rawDistrict);
  const upazilaName = toBengaliPlace(rawUpazila);
  const landmarkName = spot.nearbyLandmark || 'খাগড়াছড়ি থেকে ৬৭ কিমি';
  const locationSubtitle = `${districtName}, পার্বত্য ${divisionName}, বাংলাদেশ`;

  // Clean spot display name (remove trailing english in brackets if present for pure Bengali look)
  const spotDisplayName = spot.name ? spot.name.replace(/\s*\([^)]*\)/, '') : 'সাজেক ভ্যালি';

  // 4. Coordinates
  const latDisplay = spot.locationLat ? `${spot.locationLat.toFixed(4)}° N` : '23.3847° N';
  const lngDisplay = spot.locationLng ? `${spot.locationLng.toFixed(4)}° E` : '92.2986° E';
  const mapCoords = spot.locationLat && spot.locationLng ? `${spot.locationLat},${spot.locationLng}` : '23.3847,92.2986';

  // 5. Difficulty Display
  const difficultyDisplay =
    spot.difficultyLevel === 'hard' ? 'কঠিন' : spot.difficultyLevel === 'moderate' ? 'মাঝারি' : 'মাঝারি';

  // 6. Category badge
  const categoryBadge = spot.name.includes('সাজেক')
    ? 'পাহাড়'
    : spot.name.includes('কক্সবাজার') || spot.name.includes('সেন্টমার্টিন')
    ? 'সমুদ্র'
    : spot.name.includes('সুন্দরবন')
    ? 'ইউনেস্কো বন'
    : 'পাহাড়';

  // 7. Reviews setup
  const defaultReviews = [
    {
      id: 1,
      name: 'রাফি আহমেদ',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      time: 'সকাল ৭:০০',
      tag: 'সূর্যোদয়',
      comment:
        'অসাধারণ অভিজ্ঞতা! রাস্তার অবস্থা খারাপ হলেও গন্তব্যে পৌঁছার পর সব কষ্ট ভুলে যাবেন। কংলাক পয়েন্ট থেকে সূর্যোদয় দেখতে ভোরে উঠতে হবে, কিন্তু এর চেয়ে ভালো সূর্যোদয় আর কোথাও দেখিনি।',
      likes: 25,
    },
    {
      id: 2,
      name: 'সাবরিনা খান',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4,
      time: 'গতকাল',
      tag: 'হোটেল',
      comment:
        'শীতকালে গিয়েছিলাম, খুব ঠান্ডা ছিল। গরম কাপড় নিয়ে যেতে ভুলবেন না। হোটেলগুলো বেশি ভালো না, তবে মেঘের মধ্যে থাকার অভিজ্ঞতা অনন্য।',
      likes: 18,
    },
  ];

  const [reviewsList, setReviewsList] = useState<any[]>(() => {
    if (spot.reviews && spot.reviews.length > 0) {
      return spot.reviews.map((r: any) => ({
        id: r.id,
        name: r.user?.name || 'ভ্রমণকারী',
        avatar: r.user?.avatar || 'https://randomuser.me/api/portraits/men/45.jpg',
        rating: r.rating || 5,
        time: new Date(r.createdAt).toLocaleDateString('bn-BD'),
        tag: 'ভ্রমণ অভিজ্ঞতা',
        comment: r.comment || '',
        likes: 12,
      }));
    }
    return defaultReviews;
  });

  const totalReviewsCount = reviewsList.length > 0 ? (reviewsList.length === 2 ? 125 : reviewsList.length) : 125;

  // 8. Hotels
  const displayHotels =
    spot.hotels && spot.hotels.length > 0
      ? spot.hotels
      : [
          {
            id: 101,
            name: 'সাজেক রিসোর্ট',
            slug: 'sajek-resort',
            rating: 4.5,
            price: '৳২,৫০০/রাত',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80',
          },
          {
            id: 102,
            name: 'মেঘলা রিসোর্ট',
            slug: 'meghla-resort',
            rating: 4.2,
            price: '৳১,৮০০/রাত',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&q=80',
          },
        ];

  // 9. Restaurants
  const displayRestaurants =
    spot.restaurants && spot.restaurants.length > 0
      ? spot.restaurants
      : [
          {
            id: 201,
            name: 'পাহাড়ি ক্যাফে',
            slug: 'pahari-cafe',
            rating: 4.6,
            cuisine: 'বাংলা, মুঘলাই',
            color: 'orange',
          },
          {
            id: 202,
            name: 'মেঘ মালা রেস্টুরেন্ট',
            slug: 'megh-mala-restaurant',
            rating: 4.3,
            cuisine: 'বাংলা',
            color: 'green',
          },
        ];

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = useCallback(() => {
    setShowLightbox(false);
  }, []);

  const nextImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setLightboxIndex((prev) => (prev + 1) % gallery.length);
    },
    [gallery.length]
  );

  const prevImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    },
    [gallery.length]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showLightbox) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, closeLightbox, nextImage, prevImage]);

  // Share handler
  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  // Review like toggle
  const handleToggleLikeReview = (revId: number | string) => {
    setHasLikedReview((prev) => {
      const currentlyLiked = prev[revId];
      setLikedReviews((likeCounts) => ({
        ...likeCounts,
        [revId]: (likeCounts[revId] || 0) + (currentlyLiked ? -1 : 1),
      }));
      return { ...prev, [revId]: !currentlyLiked };
    });
  };

  // Review submit
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev = {
      id: Date.now(),
      name: reviewName.trim() || 'ভ্রমণকারী',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      rating: reviewRating,
      time: 'আজ',
      tag: 'নতুন রিভিউ',
      comment: reviewComment,
      likes: 1,
    };

    setReviewsList([newRev, ...reviewsList]);
    setLikedReviews((prev) => ({ ...prev, [newRev.id]: 1 }));
    setReviewComment('');
    setReviewName('');
    setShowReviewForm(false);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans">
      {/* Navigation */}
      <Navbar />

      {/* Copy Toast */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in-up text-sm font-medium">
          <Check className="w-5 h-5 text-white" />
          <span>লিংক কপি করা হয়েছে!</span>
        </div>
      )}

      {/* Header: Breadcrumbs, Title, Badges and Actions */}
      <div className="pt-20 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            বাংলাদেশ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="hover:text-teal-600 cursor-default">{divisionName}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="hover:text-teal-600 cursor-default">{districtName}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 dark:text-white font-semibold">{spotDisplayName}</span>
        </div>

        {/* Title & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> ফিচার্ড স্পট
              </span>
              <span className="px-2.5 py-0.5 bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold rounded-full">
                {categoryBadge}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {spotDisplayName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{locationSubtitle}</span>
            </p>
          </div>

          {/* Share and Like Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
              <span>শেয়ার</span>
            </button>
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                isLiked
                  ? 'border-rose-300 text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-900'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 text-gray-700 dark:text-gray-200'
              }`}
              title="পছন্দ করুন"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
              <span>{isLiked ? 'পছন্দ হয়েছে' : 'সংরক্ষণ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-16 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Media & Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Main Image Banner with Natural Aspect Ratio */}
            <div className="space-y-3">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-900 shadow-sm group">
                <img
                  id="main-image"
                  src={gallery[activeImageIndex]}
                  alt={spotDisplayName}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02]"
                />
                <div className="hero-gradient absolute inset-0 pointer-events-none opacity-30"></div>

                {/* Image Counter & Lightbox Launcher Button */}
                <button
                  type="button"
                  onClick={() => openLightbox(activeImageIndex)}
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-3.5 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-xl transition-all cursor-pointer text-xs font-semibold shadow-md z-10"
                >
                  <Images className="w-4 h-4" />
                  <span>{toBengaliNumber(gallery.length > 5 ? gallery.length : 12)}টি ছবি দেখুন</span>
                </button>
              </div>

              {/* Thumbnail Gallery Row */}
              <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
                {gallery.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${spotDisplayName} thumbnail ${idx + 1}`}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 object-cover rounded-xl cursor-pointer transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[3px] border-teal-500 opacity-100 scale-105 shadow-md'
                        : 'opacity-60 hover:opacity-90 border border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quick Stats Bar (Static / Non-sticky) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/60 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-gray-900 dark:text-white text-base">4.8</span>
                <span className="text-gray-500">({toBengaliNumber(totalReviewsCount)} রিভিউ)</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>২.৫কে ভিউ</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{spot.tripDuration || '২-৩ দিন'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <Signal className="w-4 h-4 text-emerald-500" />
                <span>{difficultyDisplay}</span>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-teal-500" />
                বিবরণ
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {spot.description ||
                  'সাজেক ভ্যালি বাংলাদেশের অন্যতম জনপ্রিয় পর্যটন কেন্দ্র। এটি রাঙামাটি জেলার বাঘাইছড়ি উপজেলায় অবস্থিত। সমুদ্রপৃষ্ঠ থেকে প্রায় ১,৮০০ ফুট উচ্চতায় অবস্থিত এই ভ্যালিটি মেঘের রাজ্য নামেও পরিচিত। এখান থেকে ভোরে সূর্যোদয় দেখা যায় যা অত্যন্ত মনোরম। শীতকালে এখানে ঘন কুয়াশা থাকে এবং মেঘ পাহাড়ের কোল ঘেঁষে চলাচল করে। প্রকৃতিপ্রেমীদের জন্য এটি এক স্বর্গীয় অভিজ্ঞতা।'}
              </p>
            </div>

            {/* Feature Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-teal-500" />
                বৈশিষ্ট্য
              </h2>
              <div className="flex flex-wrap gap-2">
                {formattedFeatureTags.map((tagItem, idx) => (
                  <span
                    key={idx}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-transform hover:scale-105 shadow-2xs ${tagItem.color}`}
                  >
                    {tagItem.label}
                  </span>
                ))}
              </div>
            </div>


            {/* How to Go / Routes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Route className="w-5 h-5 text-teal-500" />
                যাওয়ার পথ
              </h2>

              {spot.routes && spot.routes.length > 0 ? (
                <div className="space-y-6">
                  {spot.routes.map((r: any, idx: number) => (
                    <div key={r.id || idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-teal-500 text-white text-xs rounded font-medium">
                          রুট {toBengaliNumber(idx + 1)}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {r.transportMode ? r.transportMode.toUpperCase() : 'পরিবহন'} রুট
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p>{r.routeDetails || 'ঢাকা থেকে সরাসরি বাস বা জীপ যোগে গন্তব্যে পৌঁছানো যায়।'}</p>
                        {r.duration && <p><strong>সময়কাল:</strong> {r.duration}</p>}
                        {r.estimatedCost && (
                          <p><strong>আনুমানিক খরচ:</strong> ৳{toBengaliNumber(r.estimatedCost.toLocaleString())} টাকা</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Route 1 */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-teal-500 text-white text-xs rounded font-medium">রুট ১</span>
                      <span className="font-semibold text-gray-900 dark:text-white">ঢাকা থেকে সাজেক (খাগড়াছড়ি হয়ে)</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-white dark:bg-gray-600 rounded-lg shadow-2xs font-medium">ঢাকা</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="px-3 py-1 bg-white dark:bg-gray-600 rounded-lg shadow-2xs font-medium">
                        খাগড়াছড়ি (বাস: ৮ ঘণ্টা)
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="px-3 py-1 bg-white dark:bg-gray-600 rounded-lg shadow-2xs font-medium">
                        সাজেক (জীপ: ৩ ঘণ্টা)
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <p>
                        <strong>বাস ভাড়া:</strong> ঢাকা-খাগড়াছড়ি নন-এসি ৬০০-৮০০ টাকা, এসি ১,২০০-১,৫০০ টাকা
                      </p>
                      <p>
                        <strong>জীপ ভাড়া:</strong> খাগড়াছড়ি-সাজেক ২,০০০-৩,০০০ টাকা (চার্জার্ড)
                      </p>
                    </div>
                  </div>

                  {/* Route 2 */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-teal-500 text-white text-xs rounded font-medium">রুট ২</span>
                      <span className="font-semibold text-gray-900 dark:text-white">চট্টগ্রাম থেকে সাজেক</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-white dark:bg-gray-600 rounded-lg shadow-2xs font-medium">চট্টগ্রাম</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="px-3 py-1 bg-white dark:bg-gray-600 rounded-lg shadow-2xs font-medium">
                        খাগড়াছড়ি (বাস: ৫ ঘণ্টা)
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="px-3 py-1 bg-white dark:bg-gray-600 rounded-lg shadow-2xs font-medium">
                        সাজেক (জীপ: ৩ ঘণ্টা)
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      <p>
                        <strong>বাস ভাড়া:</strong> চট্টগ্রাম-খাগড়াছড়ি ৪০০-৬০০ টাকা
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Weather Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-teal-500" />
                আবহাওয়া তথ্য
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {seasonsToDisplay.map((w, idx) => {
                  const cfg = seasonConfigs[w.season] || {
                    nameBn: w.season || 'ঋতু',
                    icon: 'sun-cloud',
                    bg: 'bg-teal-50 dark:bg-teal-900/20',
                    iconColor: 'text-teal-500',
                    defaultPeriod: 'সারা বছর',
                    defaultTemp: '২০°C - ৩০°C',
                  };

                  return (
                    <div key={idx} className={`text-center p-4 ${cfg.bg} rounded-xl`}>
                      {cfg.icon === 'snowflake' && <Snowflake className={`w-8 h-8 mx-auto mb-2 ${cfg.iconColor}`} />}
                      {cfg.icon === 'flower' && <Flower2 className={`w-8 h-8 mx-auto mb-2 ${cfg.iconColor}`} />}
                      {cfg.icon === 'sun' && <Sun className={`w-8 h-8 mx-auto mb-2 ${cfg.iconColor}`} />}
                      {cfg.icon === 'rain' && <CloudRain className={`w-8 h-8 mx-auto mb-2 ${cfg.iconColor}`} />}
                      {cfg.icon === 'sun-cloud' && <CloudSun className={`w-8 h-8 mx-auto mb-2 ${cfg.iconColor}`} />}
                      <h4 className="font-semibold text-gray-900 dark:text-white">{cfg.nameBn}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{w.period || cfg.defaultPeriod}</p>
                      <p className="text-xs text-gray-500 mt-1 font-medium">{w.temperature || cfg.defaultTemp}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-800 dark:text-orange-200 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 shrink-0 text-orange-600 dark:text-orange-400" />
                  <span>
                    <strong>সেরা সময়:</strong> {bestTimeCalloutText}
                  </span>
                </p>
              </div>
            </div>


            {/* Activities */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Tent className="w-5 h-5 text-teal-500" />
                করণীয়
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                    <Sunrise className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">সূর্যোদয় দেখা</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">ভোর ৫:৩০-৬:৩০ টায় কংলাক পয়েন্ট থেকে</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                    <Cloud className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">মেঘ দেখা</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">বিকেলে মেঘের ওপর দিয়ে হাঁটুন</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                    <Tent className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">ক্যাম্পিং</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">রাতে তাঁবুতে থাকুন ও তারা দেখুন</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                    <Mountain className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">ট্রেকিং</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">কংলাক পর্বতে হাইকিং</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-500" />
                সুবিধাসমূহ
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>রেস্টুরেন্ট</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>বাথরুম</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>পার্কিং</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>মসজিদ</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>ফাস্ট এইড</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>গাইড সার্ভিস</span>
                </div>
                <div className="flex items-center gap-2 text-red-500">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>এটিএম নেই</span>
                </div>
                <div className="flex items-center gap-2 text-red-500">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>WiFi সীমিত</span>
                </div>
              </div>
            </div>

            {/* Safety Warnings */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
              <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                সতর্কতা
              </h2>
              <ul className="space-y-2.5 text-red-700 dark:text-red-300 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
                  <span>রাস্তা খুব খারাপ, গাড়িতে অসুস্থ হতে পারেন - ওষুধ সাথে রাখুন</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
                  <span>শীতকালে খুব ঠান্ডা পড়ে - গরম কাপড় আনুন</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
                  <span>এটিএম নেই - পর্যাপ্ত টাকা সাথে নিন</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
                  <span>নেটওয়ার্ক সমস্যা হতে পারে - পরিবারকে জানিয়ে যান</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
                  <span>সূর্যাস্তের আগেই হোটেলে ফিরুন - রাতে অন্ধকার বেশি</span>
                </li>
              </ul>
            </div>

            {/* Travel Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-teal-500" />
                ভ্রমণ টিপস
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-sm flex items-center justify-center shrink-0 font-bold">
                    ১
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    খাগড়াছড়ি থেকে সকালে রওনা দিন, তাহলে দুপুরের আগেই পৌঁছাবেন এবং বিকেলটা উপভোগ করতে পারবেন।
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-sm flex items-center justify-center shrink-0 font-bold">
                    ২
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    কংলাক পয়েন্টে সূর্যোদয় দেখতে ভোর ৫টার মধ্যে রওনা দিন। জীপ ভাড়া করতে হবে (৫০০-৮০০ টাকা)।
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-sm flex items-center justify-center shrink-0 font-bold">
                    ৩
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    সপ্তাহান্তে ভিড় বেশি, আগেই হোটেল বুক করুন। বুধ-শুক্রবার কম ভিড় থাকে।
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-sm flex items-center justify-center shrink-0 font-bold">
                    ৪
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    স্থানীয় খাবার খেয়ে দেখুন - বাঁশের শ্যুট, পাহাড়ি চা, এবং তাজা মাছ।
                  </p>
                </div>
              </div>
            </div>

            {/* Suggested Itinerary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-teal-500" />
                প্রস্তাবিত ভ্রমণ সূচি (২ দিন)
              </h2>

              {/* Day 1 */}
              <div className="mb-8">
                <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2 text-base">
                  <span className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    ১
                  </span>
                  প্রথম দিন
                </h3>
                <div className="space-y-4 ml-4 pl-6 border-l-2 border-teal-200 dark:border-teal-700 relative">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-gray-800"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong className="text-gray-900 dark:text-white">রাত ১০:০০</strong> - ঢাকা থেকে খাগড়াছড়িগামী বাসে রওনা
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-gray-800"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong className="text-gray-900 dark:text-white">সকাল ৬:০০</strong> - খাগড়াছড়ি পৌঁছান ও জীপ ভাড়া করুন
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-gray-800"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong className="text-gray-900 dark:text-white">সকাল ৯:০০</strong> - সাজেক ভ্যালি পৌঁছান ও হোটেলে চেক-ইন
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-gray-800"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong className="text-gray-900 dark:text-white">দুপুর ১:০০</strong> - লাঞ্চ ও বিশ্রাম
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-gray-800"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong className="text-gray-900 dark:text-white">বিকেল ৩:০০</strong> - হেলিপ্যাড ও রুই লুই পয়েন্ট ঘুরুন
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-gray-800"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong className="text-gray-900 dark:text-white">সন্ধ্যা ৬:০০</strong> - সূর্যাস্ত দেখুন ও ডিনার
                    </p>
                  </div>
                </div>
              </div>

              {/* Day 2 */}
              <div>
                <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2 text-base">
                  <span className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    ২
                  </span>
                  দ্বিতীয় দিন
                </h3>
                <div className="space-y-4 ml-4 pl-6 border-l-2 border-teal-200 dark:border-teal-700 relative">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-gray-800"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong className="text-gray-900 dark:text-white">ভোর ৫:০০</strong> - কংলাক পয়েন্টে সূর্যোদয় দেখুন
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-gray-800"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong className="text-gray-900 dark:text-white">সকাল ৮:০০</strong> - ব্রেকফাস্ট ও হোটেল থেকে চেক-আউট
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-gray-800"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong className="text-gray-900 dark:text-white">সকাল ৯:০০</strong> - খাগড়াছড়ির পথে রওনা
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-gray-800"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong className="text-gray-900 dark:text-white">দুপুর ১২:০০</strong> - খাগড়াছড়ি পৌঁছান ও লাঞ্চ
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-gray-800"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong className="text-gray-900 dark:text-white">দুপুর ২:০০</strong> - ঢাকার উদ্দেশ্যে রওনা
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-teal-500" />
                  রিভিউ ({toBengaliNumber(totalReviewsCount)})
                </h2>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" />
                  রিভিউ লিখুন
                </button>
              </div>

              {/* Rating Summary */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="text-center sm:border-r sm:border-gray-200 dark:sm:border-gray-600 sm:pr-6">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">4.8</div>
                  <div className="flex gap-1 justify-center my-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="text-sm text-gray-500">{toBengaliNumber(totalReviewsCount)} রিভিউ</div>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-8 text-gray-700 dark:text-gray-300 font-medium">৫★</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <span className="text-sm text-gray-500 font-mono w-6 text-right">৮৮</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-8 text-gray-700 dark:text-gray-300 font-medium">৪★</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <span className="text-sm text-gray-500 font-mono w-6 text-right">২৫</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-8 text-gray-700 dark:text-gray-300 font-medium">৩★</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: '8%' }}></div>
                    </div>
                    <span className="text-sm text-gray-500 font-mono w-6 text-right">১০</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-8 text-gray-700 dark:text-gray-300 font-medium">২★</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <span className="text-sm text-gray-500 font-mono w-6 text-right">২</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-8 text-gray-700 dark:text-gray-300 font-medium">১★</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <span className="text-sm text-gray-500 font-mono w-6 text-right">০</span>
                  </div>
                </div>
              </div>

              {/* Review Success Alert */}
              {reviewSuccess && (
                <div className="p-3 mb-4 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>আপনার রিভিউ সফলভাবে প্রকাশিত হয়েছে! ধন্যবাদ।</span>
                </div>
              )}

              {/* Inline Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-4 border border-gray-200 dark:border-gray-600"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">আপনার ভ্রমণ অভিজ্ঞতা শেয়ার করুন</h4>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      আপনার নাম
                    </label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="যেমন: তানভীর আহমেদ"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      রেটিং নির্বাচন করুন
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="cursor-pointer p-0.5 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= reviewRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      মন্তব্য
                    </label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="এই জায়গাটি কেমন লেগেছে? পথঘাট ও হোটেল কেমন ছিল?..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-sm bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium cursor-pointer transition-colors"
                    >
                      সাবমিট করুন
                    </button>
                  </div>
                </form>
              )}

              {/* Individual Reviews */}
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={rev.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                        alt={rev.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          {rev.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span>• {rev.time || 'সকাল ৭:০০'}</span>
                          {rev.tag && <span>• {rev.tag}</span>}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{rev.comment}</p>
                    <div className="flex gap-4 mt-3 text-sm">
                      <button
                        type="button"
                        onClick={() => handleToggleLikeReview(rev.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer text-xs sm:text-sm ${
                          hasLikedReview[rev.id]
                            ? 'text-teal-600 font-semibold'
                            : 'text-gray-500 hover:text-teal-600'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${hasLikedReview[rev.id] ? 'fill-current' : ''}`} />
                        <span>{toBengaliNumber(likedReviews[rev.id] ?? rev.likes ?? 10)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowReviewForm(true);
                        }}
                        className="text-gray-500 hover:text-teal-600 transition-colors cursor-pointer text-xs sm:text-sm"
                      >
                        উত্তর দিন
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Reviews Button */}
              <button
                type="button"
                className="w-full mt-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors cursor-pointer text-sm"
              >
                সব রিভিউ দেখুন
              </button>
            </div>

          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm sticky top-20 border border-gray-100 dark:border-gray-700/60">
              
              {/* Entry Fee */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">এন্ট্রি ফি</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">স্থানীয়</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      {spot.entryFeeLocal && spot.entryFeeLocal > 0 ? `৳${toBengaliNumber(spot.entryFeeLocal)}/জন` : '৳৫০/জন'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">বিদেশি</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      {spot.entryFeeForeign && spot.entryFeeForeign > 0 ? `৳${toBengaliNumber(spot.entryFeeForeign)}/জন` : '৳৫০০/জন'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Duration & Difficulty */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-teal-600 dark:text-teal-400" />
                  <p className="text-xs text-gray-500">ট্রিপ সময়কাল</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm mt-0.5">
                    {spot.tripDuration || '২-৩ দিন'}
                  </p>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <Signal className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                  <p className="text-xs text-gray-500">কঠিনতা</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm mt-0.5">
                    {difficultyDisplay}
                  </p>
                </div>
              </div>

              {/* Location Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">অবস্থান</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Map className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>
                      <strong>বিভাগ:</strong> {divisionName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>
                      <strong>জেলা:</strong> {districtName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Navigation className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>
                      <strong>থানা:</strong> {upazilaName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Landmark className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>
                      <strong>ল্যান্ডমার্ক:</strong> {landmarkName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">কোঅর্ডিনেট</h3>
                <div className="flex gap-2 text-sm">
                  <div className="flex-1 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Lat</p>
                    <p className="font-mono text-gray-900 dark:text-white text-xs sm:text-sm font-semibold">
                      {latDisplay}
                    </p>
                  </div>
                  <div className="flex-1 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Long</p>
                    <p className="font-mono text-gray-900 dark:text-white text-xs sm:text-sm font-semibold">
                      {lngDisplay}
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Map Link Button */}
              <div className="mb-6">
                <a
                  href={spot.googleMapLink || `https://maps.google.com/?q=${mapCoords}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl text-center font-medium shadow-md hover:shadow-lg transition-all text-sm"
                >
                  <Map className="w-5 h-5 inline mr-2" />
                  Google Map এ দেখুন
                </a>
              </div>

              {/* Nearby Hotels */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">কাছাকাছি হোটেল</h3>
                <div className="space-y-3">
                  {displayHotels.slice(0, 3).map((hotel: any) => (
                    <Link
                      key={hotel.id}
                      href={`/hotels/${hotel.slug || ''}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={hotel.image || hotel.featuredImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&q=80'}
                        alt={hotel.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                          {hotel.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />
                          <span>{hotel.rating || 4.5}</span>
                          <span>• {hotel.price || '৳২,৫০০/রাত'}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                    </Link>
                  ))}
                </div>
                <Link
                  href="/#hotels"
                  className="block text-center text-teal-600 dark:text-teal-400 text-sm mt-3 hover:underline font-medium"
                >
                  সব হোটেল দেখুন →
                </Link>
              </div>

              {/* Nearby Restaurants */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">কাছাকাছি রেস্টুরেন্ট</h3>
                <div className="space-y-3">
                  {displayRestaurants.slice(0, 3).map((rest: any) => (
                    <Link
                      key={rest.id}
                      href={`/#restaurants`}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div
                        className={`w-12 h-12 rounded-lg ${
                          rest.color === 'green'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-orange-100 dark:bg-orange-900/30'
                        } flex items-center justify-center shrink-0`}
                      >
                        <Utensils
                          className={`w-6 h-6 ${
                            rest.color === 'green' ? 'text-green-500' : 'text-orange-500'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                          {rest.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />
                          <span>{rest.rating || 4.5}</span>
                          <span>• {rest.cuisine || 'বাংলা, মুঘলাই'}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                    </Link>
                  ))}
                </div>
                <Link
                  href="/#restaurants"
                  className="block text-center text-teal-600 dark:text-teal-400 text-sm mt-3 hover:underline font-medium"
                >
                  সব রেস্টুরেন্ট দেখুন →
                </Link>
              </div>

              {/* Guide CTA Card */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="p-4 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white">
                  <h4 className="font-bold text-sm mb-1">স্থানীয় অভিজ্ঞ গাইড প্রয়োজন?</h4>
                  <p className="text-xs text-teal-100 mb-3 leading-relaxed">
                    নিরাপদ ও রোমাঞ্চকর ভ্রমণের জন্য আমাদের ভেরিফাইড গাইড ভাড়া করুন।
                  </p>
                  <a
                    href="https://wa.me/8801711000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2 bg-white text-teal-700 font-bold text-xs text-center rounded-lg shadow-sm hover:bg-teal-50 transition-colors"
                  >
                    হায়ার করুন (WhatsApp)
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Image Gallery Lightbox Modal */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-xs select-none"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer z-20"
            title="বন্ধ করুন (Esc)"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Prev Button */}
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 p-3 rounded-full bg-white/10 hover:bg-white/25 transition-colors cursor-pointer z-20"
            title="আগের ছবি"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 p-3 rounded-full bg-white/10 hover:bg-white/25 transition-colors cursor-pointer z-20"
            title="পরের ছবি"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image Counter Header */}
          <div className="absolute top-4 left-4 text-white/80 text-sm font-medium bg-black/40 px-3 py-1.5 rounded-lg">
            {toBengaliNumber(lightboxIndex + 1)} / {toBengaliNumber(gallery.length)} ছবি
          </div>

          {/* Active Image */}
          <div className="relative max-w-5xl max-h-[85vh] flex items-center justify-center">
            <img
              src={gallery[lightboxIndex]}
              alt={`${spotDisplayName} preview ${lightboxIndex + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[85vh] rounded-lg object-contain shadow-2xl animate-fade-in-up"
            />
          </div>
        </div>
      )}
    </div>
  );
};
