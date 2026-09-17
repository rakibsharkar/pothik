'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Info,
  Map,
  Sparkles,
  ClipboardCheck,
  Globe,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  ImageIcon,
  Navigation,
  CloudSun,
  Calendar,
  Compass,
} from 'lucide-react';

import ImageUpload from '@/components/ui/ImageUpload';
import MultiImageUpload from '@/components/ui/MultiImageUpload';

interface Division {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
  divisionId: number;
}

interface Upazila {
  id: number;
  name: string;
  districtId: number;
}

interface SpotCreateFormProps {
  divisions: Division[];
  districts: District[];
  upazilas: Upazila[];
}

export const SpotCreateForm: React.FC<SpotCreateFormProps> = ({ divisions, districts, upazilas }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'location' | 'details' | 'safety' | 'seo'>('overview');

  // Tab 1: Overview
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  ]);
  const [isFeatured, setIsFeatured] = useState(false);

  // Tab 2: Location
  const [divisionId, setDivisionId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [upazilaId, setUpazilaId] = useState('');
  const [googleMapLink, setGoogleMapLink] = useState('');
  const [nearbyLandmark, setNearbyLandmark] = useState('');
  const [locationLat, setLocationLat] = useState('23.3820');
  const [locationLng, setLocationLng] = useState('92.2938');
  const [routes, setRoutes] = useState<Array<{ transport_mode: string; estimated_cost: string; duration: string; route_details: string }>>([
    {
      transport_mode: 'bus',
      estimated_cost: '1200',
      duration: '7-8 hours',
      route_details: 'ঢাকা সায়েদাবাদ বা আরামবাগ থেকে খাগড়াছড়ি বা দীঘিনালাগামী এসি/নন-এসি সরাসরি বাস সার্ভিস।',
    },
    {
      transport_mode: 'car',
      estimated_cost: '4500 - 6000',
      duration: '3 hours',
      route_details: 'খাগড়াছড়ি বা দীঘিনালা জোন থেকে সাজেকের উদ্দেশ্যে স্থানীয় চাঁদের গাড়ি (জিপ) বা সিএনজি ভাড়া।',
    },
  ]);

  // Tab 3: Details & Activities
  const [bestTimeToVisit, setBestTimeToVisit] = useState('Winter & Monsoon (সেপ্টেম্বর - মার্চ)');
  const [bestTimeDetails, setBestTimeDetails] = useState<Array<{ season: string; period: string; temperature: string }>>([
    { season: 'Winter', period: 'অক্টোবর - মার্চ', temperature: '১২°C - ২৪°C' },
    { season: 'Monsoon', period: 'জুন - সেপ্টেম্বর', temperature: '২৪°C - ৩০°C' },
    { season: 'Summer', period: 'এপ্রিল - মে', temperature: '২৮°C - ৩৫°C' },
    { season: 'Spring', period: 'ফেব্রুয়ারি - এপ্রিল', temperature: '১৮°C - ২৮°C' },
  ]);
  const [tripDuration, setTripDuration] = useState('২ দিন ১ রাত (2 Days 1 Night)');
  const [entryFeeForeign, setEntryFeeForeign] = useState('500');
  const [entryFeeLocal, setEntryFeeLocal] = useState('50');
  const [difficultyLevel, setDifficultyLevel] = useState('easy');

  // 32 Feature Tags from Filament
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['hill', 'nature', 'adventure', 'cloud_view', 'eco_tourism']);

  // 50 Activity Tags from Filament
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    'sightseeing',
    'hiking',
    'photography',
    'camping',
    'sunset_view',
    'sunrise_view',
    'cloud_view',
    'bonfire',
    'star_gazing',
  ]);

  // Tab 4: Planning & Safety
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    'mobile_network',
    'internet',
    'parking',
    'toilet',
    'security',
    'food',
    'guide',
    'cottage',
    'resort',
    'viewpoint',
    'helipad',
  ]);
  const [safetyWarnings, setSafetyWarnings] = useState<string[]>([
    'সেনাবাহিনী এস্কর্ট মেনে নির্দিষ্ট সময়ে দীঘিনালা ঘাট পার হবেন। সকাল ১০:৩০ এবং দুপুর ২:৩০-এ এস্কর্ট শুরু হয়।',
    'পাহাড়ের সরু ও খাড়া বাঁকে সতর্ক থাকুন এবং জিপ চালকের নির্দেশনা মেনে চলুন।',
    'জাতীয় পরিচয়পত্র (NID) বা জন্মনিবন্ধনের মূল কপি সঙ্গে রাখবেন।',
  ]);
  const [travelTips, setTravelTips] = useState<string[]>([
    'সাজেকে কোনো ব্যাংকের এটিএম বুথ নেই, তাই খাগড়াছড়ি থেকেই পর্যাপ্ত নগদ টাকা সঙ্গে তুলে নিন।',
    'সাজেকে রবি এবং টেলিটক নেটওয়ার্ক সবচেয়ে ভালো পাওয়া যায়।',
    'ছুটির দিনে গেলে অন্তত ১-২ সপ্তাহ আগেই কটেজ বা রিসোর্ট বুকিং করে রাখা নিরাপদ।',
  ]);
  const [itinerary, setItinerary] = useState<Array<{ day_title: string; activities: string }>>([
    {
      day_title: 'Day 1: খাগড়াছড়ি পৌঁছানো ও মেঘের দেশে সাজেক যাত্রা',
      activities: '০৬:৩০ AM - খাগড়াছড়ি শহরে পৌঁছে সকালের নাস্তা সম্পন্ন\n০৯:৩০ AM - দীঘিনালা এস্কর্ট পয়েন্টে রিপোর্ট ও চাঁদের গাড়িতে যাত্রা\n১২:৩০ PM - সাজেক ভ্যালিতে পৌঁছানো এবং রিসোর্টে চেক-ইন\n০১:৩০ PM - পাহাড়ি ব্যাম্বো চিকেন দিয়ে দুপুরের খাবার\n০৪:৩০ PM - হেলিপ্যাড অথবা কংলাক পাহাড়ে সূর্যাস্ত ও মেঘ উপভোগ\n০৮:০০ PM - ক্যাম্পফায়ার ও বারবিকিউ আড্ডা',
    },
    {
      day_title: 'Day 2: কংলাক পাহাড়ে সূর্যোদয় ও প্রত্যাবর্তন',
      activities: '০৫:৩০ AM - কংলাক পাহাড়ে সূর্যোদয় ও মেঘের ভেলা দর্শন\n০৮:০০ AM - রিসোর্টে সকালের নাস্তা সম্পন্ন ও লাগেজ গোছানো\n১০:০০ AM - ফিরতি এস্কর্টে খাগড়াছড়ির উদ্দেশ্যে রওয়ানা\n০১:০০ PM - খাগড়াছড়ি পৌঁছে আলুটিলা গুহা ও তারেং পরিভ্রমণ\n০৮:০০ PM - রাতের বাসে ঢাকার উদ্দেশ্যে যাত্রা',
    },
  ]);

  // Tab 5: SEO
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activitySearch, setActivitySearch] = useState('');

  // 32 Feature Categories
  const featureOptions = [
    { id: 'hill', label: '⛰️ Hill (পাহাড়)' },
    { id: 'beach', label: '🏖️ Beach (সমুদ্র সৈকত)' },
    { id: 'lake', label: '🌊 Lake (হ্রদ/লেক)' },
    { id: 'river', label: '🛶 River (নদী)' },
    { id: 'waterfall', label: '💧 Waterfall (ঝর্ণা)' },
    { id: 'island', label: '🏝️ Island (দ্বীপ)' },
    { id: 'forest', label: '🌲 Forest (বন/জঙ্গল)' },
    { id: 'tea_garden', label: '🍃 Tea Garden (চা বাগান)' },
    { id: 'park', label: '🌳 Park (পার্ক)' },
    { id: 'botanical', label: '🌿 Botanical Garden' },
    { id: 'wildlife', label: '🦌 Wildlife (বন্যপ্রাণী)' },
    { id: 'eco_tourism', label: '🌱 Eco Tourism (ইকো ট্যুরিজম)' },
    { id: 'nature', label: '🌄 Nature (প্রকৃতি)' },
    { id: 'adventure', label: '🧗 Adventure (অ্যাডভেঞ্চার)' },
    { id: 'family_friendly', label: '👨‍👩‍👧 Family Friendly (পারিবারিক)' },
    { id: 'religious', label: '🕊️ Religious (ধর্মীয়)' },
    { id: 'temple', label: '🛕 Temple (মন্দির)' },
    { id: 'mosque', label: '🕌 Mosque (মসজিদ)' },
    { id: 'church', label: '⛪ Church (গির্জা)' },
    { id: 'pagoda', label: '⛩️ Pagoda (প্যাগোডা)' },
    { id: 'historical', label: '🏛️ Historical (ঐতিহাসিক)' },
    { id: 'archaeological', label: '🏺 Archaeological (প্রত্নতাত্ত্বিক)' },
    { id: 'monument', label: '🗿 Monument (স্মৃতিস্তম্ভ)' },
    { id: 'museum', label: '🏢 Museum (জাদুঘর)' },
    { id: 'cultural', label: '🎭 Cultural (সাংস্কৃতিক)' },
    { id: 'cave', label: '🕳️ Cave (গুহা)' },
    { id: 'resort', label: '🏨 Resort (রিসোর্ট)' },
    { id: 'haor', label: '⛵ Haor (হাওর)' },
    { id: 'swamp_forest', label: '🌴 Swamp Forest (জলাবন)' },
    { id: 'village', label: '🏡 Village (গ্রাম্য পরিবেশ)' },
    { id: 'heritage', label: '📜 Heritage (ঐতিহ্যবাহী)' },
  ];

  // 50 Activities
  const activityOptions = [
    { id: 'sightseeing', label: '👁️ Sightseeing' },
    { id: 'boating', label: '🚤 Boating' },
    { id: 'hiking', label: '🥾 Hiking / Trekking' },
    { id: 'camping', label: '⛺ Camping' },
    { id: 'swimming', label: '🏊 Swimming' },
    { id: 'photography', label: '📷 Photography' },
    { id: 'fishing', label: '🎣 Fishing' },
    { id: 'kayaking', label: '🛶 Kayaking' },
    { id: 'snorkeling', label: '🤿 Snorkeling' },
    { id: 'diving', label: '🤿 Scuba Diving' },
    { id: 'surfing', label: '🏄 Surfing' },
    { id: 'bird_watching', label: '🦜 Bird Watching' },
    { id: 'star_gazing', label: '✨ Star Gazing' },
    { id: 'bbq', label: '🍖 BBQ' },
    { id: 'picnic', label: '🧺 Picnic' },
    { id: 'cycling', label: '🚴 Cycling' },
    { id: 'cave_exploring', label: '🔦 Cave Exploring' },
    { id: 'historical_walk', label: '🚶 Historical Walk' },
    { id: 'cultural_experience', label: '🎭 Cultural Experience' },
    { id: 'shopping', label: '🛍️ Shopping' },
    { id: 'food_tour', label: '🍲 Food Tour' },
    { id: 'sunrise_view', label: '🌅 Sunrise View' },
    { id: 'sunset_view', label: '🌇 Sunset View' },
    { id: 'cloud_view', label: '☁️ Cloud View' },
    { id: 'waterfall_view', label: '🌊 Waterfall View' },
    { id: 'bonfire', label: '🔥 Bonfire' },
    { id: 'meditation', label: '🧘 Meditation / Yoga' },
    { id: 'adventure', label: '🧗 Adventure Sports' },
    { id: 'nature_walk', label: '🌳 Nature Walk' },
    { id: 'beach_walk', label: '🏖️ Beach Walk' },
    { id: 'spiritual_tour', label: '🕊️ Spiritual Tour' },
    { id: 'religious_tour', label: '🕌 Religious Tour' },
    { id: 'cultural_tour', label: '🎪 Cultural Tour' },
    { id: 'leisure', label: '☕ Leisure & Relaxation' },
    { id: 'road_trip', label: '🚗 Road Trip' },
    { id: 'golf', label: '⛳ Golf' },
    { id: 'cinema', label: '🎬 Cinema' },
    { id: 'spa', label: '💆 Spa & Wellness' },
    { id: 'street_food', label: '🍢 Street Food' },
    { id: 'wildlife_watching', label: '🦁 Wildlife Watching' },
    { id: 'museum_visit', label: '🏛️ Museum Visit' },
    { id: 'water_sports', label: '🏄 Water Sports' },
    { id: 'educational', label: '📚 Educational Tour' },
    { id: 'art_tour', label: '🎨 Art Tour' },
    { id: 'archeology', label: '🏺 Archeology' },
    { id: 'industrial_tour', label: '🏭 Industrial Tour' },
    { id: 'night_tour', label: '🌙 Night Tour' },
    { id: 'eye_shopping', label: '👀 Eye Shopping' },
    { id: 'driving', label: '🏎️ Scenic Driving' },
    { id: 'music', label: '🎵 Live Music / Folk' },
  ];

  // 30 Facilities
  const facilityOptions = [
    { id: 'mobile_network', label: '📶 Mobile Network' },
    { id: 'internet', label: '🌐 WiFi Internet' },
    { id: 'parking', label: '🅿️ Parking' },
    { id: 'toilet', label: '🚻 Clean Restroom' },
    { id: 'mosque', label: '🕌 Mosque / Prayer Space' },
    { id: 'first_aid', label: '🩹 First Aid' },
    { id: 'security', label: '🛡️ 24/7 Security' },
    { id: 'water', label: '💧 Pure Drinking Water' },
    { id: 'electricity', label: '⚡ Electricity / Generator' },
    { id: 'cottage', label: '🏡 Eco Cottages' },
    { id: 'atm', label: '🏧 ATM Nearby' },
    { id: 'food', label: '🍲 Food & Restaurant' },
    { id: 'guide', label: '🧭 Local Tour Guide' },
    { id: 'air_condition', label: '❄️ Air Conditioning' },
    { id: 'water_transport', label: '🚤 Water Transport' },
    { id: 'hotel', label: '🏨 Hotel Nearby' },
    { id: 'market', label: '🛍️ Market Nearby' },
    { id: 'resort', label: '🏕️ Resort' },
    { id: 'boating', label: '⛵ Boating Facility' },
    { id: 'swimming_pool', label: '🏊 Swimming Pool' },
    { id: 'spa', label: '💆 Spa' },
    { id: 'gym', label: '🏋️ Fitness Gym' },
    { id: 'cinema', label: '🎬 Cinema Hall' },
    { id: 'helipad', label: '🚁 Helipad' },
    { id: 'private_beach', label: '🏖️ Private Beach' },
    { id: 'water_park', label: '🌊 Water Park' },
    { id: 'viewpoint', label: '🔭 View Point' },
    { id: 'cycling_track', label: '🚴 Cycling Track' },
    { id: 'museum', label: '🏛️ Museum' },
    { id: 'park', label: '🌳 Family Park' },
  ];

  const generateSlug = (text: string) => {
    return (
      text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'spot-' + Math.floor(Math.random() * 10000)
    );
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(val));
    }
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleActivity = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFacility = (id: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredDistricts = divisionId
    ? districts.filter((d) => d.divisionId === Number(divisionId))
    : districts;

  const filteredUpazilas = districtId
    ? upazilas.filter((u) => u.districtId === Number(districtId))
    : [];

  const filteredActivities = activityOptions.filter(
    (act) =>
      act.label.toLowerCase().includes(activitySearch.toLowerCase()) ||
      act.id.toLowerCase().includes(activitySearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setActiveTab('overview');
      setError('Spot Name is required.');
      return;
    }
    if (!districtId) {
      setActiveTab('location');
      setError('District selection is required.');
      return;
    }

    setIsLoading(true);

    try {
      const validGalleryImages = galleryImages.filter((img) => img.trim() !== '');

      const res = await fetch('/api/v1/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slug || generateSlug(name),
          districtId: Number(districtId),
          divisionId: divisionId ? Number(divisionId) : undefined,
          upazilaId: upazilaId ? Number(upazilaId) : undefined,
          description,
          thumbnail:
            thumbnail ||
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
          images: validGalleryImages,
          locationLat: locationLat ? parseFloat(locationLat) : null,
          locationLng: locationLng ? parseFloat(locationLng) : null,
          googleMapLink: googleMapLink || null,
          nearbyLandmark: nearbyLandmark || null,
          bestTimeToVisit,
          bestTimeDetails,
          tripDuration,
          difficultyLevel,
          entryFeeLocal: parseFloat(entryFeeLocal) || 0,
          entryFeeForeign: parseFloat(entryFeeForeign) || 0,
          featureTags: selectedFeatures,
          activityTags: selectedActivities,
          facilities: selectedFacilities,
          safetyInfo: safetyWarnings.filter((w) => w.trim() !== ''),
          travelTips: travelTips.filter((t) => t.trim() !== ''),
          itinerary: itinerary.filter((item) => item.day_title.trim() !== ''),
          routes: routes.filter((r) => r.route_details.trim() !== '' || r.transport_mode),
          metaTitle: metaTitle || name,
          metaDescription,
          metaKeywords,
          isFeatured,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save spot.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/spots');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/spots"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Spots / List</span>
        </Link>
        <span className="text-xs text-teal-600 font-semibold bg-teal-50 dark:bg-teal-950/40 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
          Filament v3 Specification Standard
        </span>
      </div>

      <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Create Spot (নতুন স্পট তৈরি করুন)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add comprehensive tourist destination data matching Laravel Filament schema & spot details UI.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center gap-2 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Spot saved successfully! Redirecting to list...</span>
        </div>
      )}

      {/* 5 Filament-Style Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 text-xs sm:text-sm font-semibold space-x-1 sm:space-x-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('location')}
          className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'location'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>Location & Routes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'details'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Details & Activities</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('safety')}
          className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'safety'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Planning & Safety</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'seo'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>SEO</span>
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
        
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Spot Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. সাজেক ভ্যালি / Sajek Valley"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  placeholder="sajek-valley"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Description (বিবরণ) *
              </label>
              <textarea
                rows={5}
                placeholder="Write comprehensive spot overview, scenic attractions, history, and key highlights..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-teal-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div>
                <ImageUpload
                  label="Thumbnail Image (প্রধান থাম্বনেইল ছবি)"
                  helperText="লোকাল ডিভাইস থেকে ছবি সিলেক্ট বা ড্রপ করুন (স্মার্ট WebP কম্প্রেশনে সাইজ ৯০%+ কমে যাবে)"
                  value={thumbnail}
                  onChange={setThumbnail}
                  folder="spots"
                  aspectRatio="video"
                  required
                />
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
                />
                <div>
                  <label htmlFor="featured-check" className="text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer block">
                    Featured Spot (ফিচার্ড স্পট)
                  </label>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    টিক দিলে হোমপেজের প্রধান 'জনপ্রিয় পর্যটন স্থান' সেকশনে এটি সবার আগে প্রদর্শিত হবে।
                  </span>
                </div>
              </div>
            </div>

            {/* Gallery Images Repeater */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-gray-50/50 dark:bg-gray-800/40">
              <MultiImageUpload
                label="Gallery Images (গ্যালারির ছবিসমূহ - লাইটবক্স ও স্লাইডার)"
                helperText="একসাথে একাধিক ছবি সিলেক্ট বা ড্রপ করুন। ব্যাকগ্রাউন্ডে সাইজ অপটিমাইজ ও কম্প্রেস হয়ে সেভ হবে।"
                values={galleryImages}
                onChange={setGalleryImages}
                folder="spots"
                maxImages={12}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: LOCATION & ROUTES */}
        {/* ========================================================================= */}
        {activeTab === 'location' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Division (বিভাগ) *
                </label>
                <select
                  value={divisionId}
                  onChange={(e) => {
                    setDivisionId(e.target.value);
                    setDistrictId('');
                    setUpazilaId('');
                  }}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold outline-none focus:border-teal-500"
                >
                  <option value="">Select Division</option>
                  {divisions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} বিভাগ
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  District (জেলা) *
                </label>
                <select
                  value={districtId}
                  onChange={(e) => {
                    setDistrictId(e.target.value);
                    setUpazilaId('');
                  }}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold outline-none focus:border-teal-500"
                  required
                >
                  <option value="">Select District</option>
                  {filteredDistricts.map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Upazila (উপজেলা)
                </label>
                <select
                  value={upazilaId}
                  onChange={(e) => setUpazilaId(e.target.value)}
                  disabled={!districtId || filteredUpazilas.length === 0}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold outline-none focus:border-teal-500 disabled:opacity-50"
                >
                  <option value="">{filteredUpazilas.length === 0 ? 'No Upazila Available' : 'Select Upazila'}</option>
                  {filteredUpazilas.map((upz) => (
                    <option key={upz.id} value={upz.id}>
                      {upz.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Google Maps Link
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={googleMapLink}
                  onChange={(e) => setGoogleMapLink(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Nearby Landmark (কাছের ল্যান্ডমার্ক)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Ruilui Para Helipad"
                  value={nearbyLandmark}
                  onChange={(e) => setNearbyLandmark(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Latitude (অক্ষাংশ)
                </label>
                <input
                  type="text"
                  value={locationLat}
                  onChange={(e) => setLocationLat(e.target.value)}
                  placeholder="23.3820"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Longitude (দ্রাঘিমাংশ)
                </label>
                <input
                  type="text"
                  value={locationLng}
                  onChange={(e) => setLocationLng(e.target.value)}
                  placeholder="92.2938"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Routes Repeater */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-teal-600" />
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Routes & Transport (কীভাবে যাবেন ও যাতায়াত মাধ্যম)
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setRoutes([
                      ...routes,
                      { transport_mode: 'bus', estimated_cost: '', duration: '', route_details: '' },
                    ])
                  }
                  className="text-xs text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 cursor-pointer bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Route
                </button>
              </div>

              <div className="space-y-3">
                {routes.map((route, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-600">Route #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => setRoutes(routes.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Delete Route"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                          Transport Mode
                        </label>
                        <select
                          value={route.transport_mode}
                          onChange={(e) => {
                            const copy = [...routes];
                            copy[idx].transport_mode = e.target.value;
                            setRoutes(copy);
                          }}
                          className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs bg-gray-50 dark:bg-gray-800"
                        >
                          <option value="bus">🚌 Bus (বাস)</option>
                          <option value="train">🚂 Train (ট্রেন)</option>
                          <option value="flight">✈️ Flight (বিমান)</option>
                          <option value="boat">🚤 Boat (লঞ্চ/ট্রলার)</option>
                          <option value="car">🚗 Car / Jeep (চাঁদের গাড়ি/কার)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                          Estimated Cost (BDT ৳)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 1200 বা 4000-5000"
                          value={route.estimated_cost}
                          onChange={(e) => {
                            const copy = [...routes];
                            copy[idx].estimated_cost = e.target.value;
                            setRoutes(copy);
                          }}
                          className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs bg-gray-50 dark:bg-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                          Duration (সময়কাল)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 7-8 hours / ৩ ঘণ্টা"
                          value={route.duration}
                          onChange={(e) => {
                            const copy = [...routes];
                            copy[idx].duration = e.target.value;
                            setRoutes(copy);
                          }}
                          className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs bg-gray-50 dark:bg-gray-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                        Route Details (পথ নির্দেশনা)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="বিস্তারিত যাতায়াত বিবরণ লিখুন..."
                        value={route.route_details}
                        onChange={(e) => {
                          const copy = [...routes];
                          copy[idx].route_details = e.target.value;
                          setRoutes(copy);
                        }}
                        className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs bg-gray-50 dark:bg-gray-800"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DETAILS & ACTIVITIES */}
        {/* ========================================================================= */}
        {activeTab === 'details' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Seasonal Weather Info Grid (best_time_details) */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudSun className="w-4 h-4 text-teal-600" />
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Seasonal Weather Info Matrix (ঋতুভিত্তিক আবহাওয়া ও তাপমাত্রা)
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setBestTimeDetails([
                      ...bestTimeDetails,
                      { season: 'Winter', period: '', temperature: '' },
                    ])
                  }
                  className="text-xs text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 cursor-pointer bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Season
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bestTimeDetails.map((seasonItem, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <select
                        value={seasonItem.season}
                        onChange={(e) => {
                          const copy = [...bestTimeDetails];
                          copy[idx].season = e.target.value;
                          setBestTimeDetails(copy);
                        }}
                        className="p-1.5 font-bold text-xs rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      >
                        <option value="Winter">Winter (শীতকাল)</option>
                        <option value="Monsoon">Monsoon (বর্ষাকাল)</option>
                        <option value="Summer">Summer (গ্রীষ্মকাল)</option>
                        <option value="Spring">Spring (বসন্তকাল)</option>
                        <option value="Autumn">Autumn (শরৎকাল)</option>
                        <option value="Late Autumn">Late Autumn (হেমন্তকাল)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setBestTimeDetails(bestTimeDetails.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Remove Season"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="block text-[10px] text-gray-400">Time Period</span>
                        <input
                          type="text"
                          placeholder="e.g. অক্টোবর - মার্চ"
                          value={seasonItem.period}
                          onChange={(e) => {
                            const copy = [...bestTimeDetails];
                            copy[idx].period = e.target.value;
                            setBestTimeDetails(copy);
                          }}
                          className="w-full p-1.5 rounded border border-gray-200 dark:border-gray-700 text-xs bg-gray-50 dark:bg-gray-800"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400">Temperature</span>
                        <input
                          type="text"
                          placeholder="e.g. ১২°C - ২৪°C"
                          value={seasonItem.temperature}
                          onChange={(e) => {
                            const copy = [...bestTimeDetails];
                            copy[idx].temperature = e.target.value;
                            setBestTimeDetails(copy);
                          }}
                          className="w-full p-1.5 rounded border border-gray-200 dark:border-gray-700 text-xs bg-gray-50 dark:bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Best Time To Visit Summary (ভ্রমণের সেরা সময়)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Winter & Monsoon (সেপ্টেম্বর - মার্চ)"
                  value={bestTimeToVisit}
                  onChange={(e) => setBestTimeToVisit(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Suggested Trip Duration (প্রস্তাবিত ভ্রমণ সময়কাল)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ২ দিন ১ রাত (2 Days 1 Night)"
                  value={tripDuration}
                  onChange={(e) => setTripDuration(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Entry Fee (Local BDT ৳)
                </label>
                <input
                  type="number"
                  placeholder="50"
                  value={entryFeeLocal}
                  onChange={(e) => setEntryFeeLocal(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Entry Fee (Foreign BDT ৳)
                </label>
                <input
                  type="number"
                  placeholder="500"
                  value={entryFeeForeign}
                  onChange={(e) => setEntryFeeForeign(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Difficulty Level (কষ্টসাধ্যতা)
                </label>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold outline-none focus:border-teal-500"
                >
                  <option value="easy">Easy (সহজ ভ্রমণ)</option>
                  <option value="moderate">Moderate (মাঝারি)</option>
                  <option value="hard">Hard (কঠিন ট্র্যাকিং)</option>
                </select>
              </div>
            </div>

            {/* Categories / Feature Tags (32 Categories) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Categories & Feature Tags ({selectedFeatures.length} selected of {featureOptions.length})
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                {featureOptions.map((f) => (
                  <label
                    key={f.id}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      selectedFeatures.includes(f.id)
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 font-bold shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(f.id)}
                      onChange={() => toggleFeature(f.id)}
                      className="accent-teal-600 w-4 h-4 rounded"
                    />
                    <span className="truncate">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Activities (50 Options with search filter) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Activities & Experiences ({selectedActivities.length} selected of {activityOptions.length})
                </label>
                <input
                  type="text"
                  placeholder="Filter activities..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 w-40"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs max-h-72 overflow-y-auto pr-1">
                {filteredActivities.map((act) => (
                  <label
                    key={act.id}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      selectedActivities.includes(act.id)
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 font-bold shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedActivities.includes(act.id)}
                      onChange={() => toggleActivity(act.id)}
                      className="accent-teal-600 w-4 h-4 rounded"
                    />
                    <span className="truncate">{act.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PLANNING & SAFETY */}
        {/* ========================================================================= */}
        {activeTab === 'safety' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Facilities (30 Options) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                Facilities & Amenities (সুবিধাসমূহ - {selectedFacilities.length} selected of {facilityOptions.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                {facilityOptions.map((fac) => (
                  <label
                    key={fac.id}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      selectedFacilities.includes(fac.id)
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 font-bold shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFacilities.includes(fac.id)}
                      onChange={() => toggleFacility(fac.id)}
                      className="accent-teal-600 w-4 h-4 rounded"
                    />
                    <span className="truncate">{fac.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Suggested Itinerary Repeater (Day-by-Day) */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Suggested Day-by-Day Itinerary (পরিকল্পিত ভ্রমণসূচি)
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setItinerary([
                      ...itinerary,
                      { day_title: `Day ${itinerary.length + 1}: নতুন দিন`, activities: '' },
                    ])
                  }
                  className="text-xs text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 cursor-pointer bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Day
                </button>
              </div>

              <div className="space-y-3">
                {itinerary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        placeholder="Day Title (e.g. Day 1: Arrival & Sunset)"
                        value={item.day_title}
                        onChange={(e) => {
                          const copy = [...itinerary];
                          copy[idx].day_title = e.target.value;
                          setItinerary(copy);
                        }}
                        className="flex-1 p-2 font-bold text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      />
                      <button
                        type="button"
                        onClick={() => setItinerary(itinerary.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 p-1.5 cursor-pointer"
                        title="Remove Day"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <span className="block text-[11px] text-gray-400 mb-1">
                        Timeline & Activities (প্রতি লাইনে সময় ও কাজ লিখুন)
                      </span>
                      <textarea
                        rows={4}
                        placeholder="10:00 AM - Reach destination and check-in&#10;01:00 PM - Lunch break&#10;04:30 PM - Sunset viewpoint"
                        value={item.activities}
                        onChange={(e) => {
                          const copy = [...itinerary];
                          copy[idx].activities = e.target.value;
                          setItinerary(copy);
                        }}
                        className="w-full p-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Warnings Repeater */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Safety Warnings (সতর্কতা ও নিরাপত্তা নির্দেশিকা)
                </label>
                <button
                  type="button"
                  onClick={() => setSafetyWarnings([...safetyWarnings, ''])}
                  className="text-xs text-teal-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Warning
                </button>
              </div>
              <div className="space-y-2">
                {safetyWarnings.map((warn, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={warn}
                      onChange={(e) => {
                        const copy = [...safetyWarnings];
                        copy[idx] = e.target.value;
                        setSafetyWarnings(copy);
                      }}
                      className="flex-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs"
                      placeholder="e.g. পাহাড়ি অঞ্চলে গাইড ছাড়া রাতে চলাচল করবেন না।"
                    />
                    <button
                      type="button"
                      onClick={() => setSafetyWarnings(safetyWarnings.filter((_, i) => i !== idx))}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Tips Repeater */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Travel Tips (ভ্রমণ টিপস ও পরামর্শ)
                </label>
                <button
                  type="button"
                  onClick={() => setTravelTips([...travelTips, ''])}
                  className="text-xs text-teal-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Tip
                </button>
              </div>
              <div className="space-y-2">
                {travelTips.map((tip, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => {
                        const copy = [...travelTips];
                        copy[idx] = e.target.value;
                        setTravelTips(copy);
                      }}
                      className="flex-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs"
                      placeholder="e.g. পর্যাপ্ত নগদ টাকা সঙ্গে রাখুন।"
                    />
                    <button
                      type="button"
                      onClick={() => setTravelTips(travelTips.filter((_, i) => i !== idx))}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SEO */}
        {/* ========================================================================= */}
        {activeTab === 'seo' && (
          <div className="space-y-4 animate-fade-in-up">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Meta Title (max 60 chars)
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="সাজেক ভ্যালি ভ্রমণ গাইড ও রিসোর্ট বুকিং | Pothik"
                maxLength={60}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Meta Description (max 160 chars)
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="সাজেক ভ্যালি ভ্রমণের সম্পূর্ণ রুট, হোটেল খরচ, সেরা সময় ও গাইড বুকিং তথ্য এক নজরে।"
                maxLength={160}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                SEO Keywords (comma separated)
              </label>
              <input
                type="text"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                placeholder="sajek valley, sajek resort, tour bd, rangamati, cloud valley"
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-teal-500"
              />
            </div>
          </div>
        )}

        {/* Footer Navigation and Save Button */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex gap-2 text-xs">
            {activeTab !== 'overview' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'location') setActiveTab('overview');
                  if (activeTab === 'details') setActiveTab('location');
                  if (activeTab === 'safety') setActiveTab('details');
                  if (activeTab === 'seo') setActiveTab('safety');
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 cursor-pointer"
              >
                Previous Tab
              </button>
            )}

            {activeTab !== 'seo' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'overview') setActiveTab('location');
                  if (activeTab === 'location') setActiveTab('details');
                  if (activeTab === 'details') setActiveTab('safety');
                  if (activeTab === 'safety') setActiveTab('seo');
                }}
                className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-gray-800 text-teal-600 dark:text-teal-400 font-bold hover:bg-teal-100 cursor-pointer"
              >
                Next Tab
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs shadow-md shadow-teal-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving Spot...' : 'Save Spot (স্পট সংরক্ষণ করুন)'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
