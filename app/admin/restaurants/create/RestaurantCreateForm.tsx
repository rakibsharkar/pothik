'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Utensils,
  MapPin,
  Clock,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  Trash2,
  ImageIcon,
  Sparkles,
  Phone,
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

interface Spot {
  id: number;
  name: string;
  districtId: number;
  upazilaId: number | null;
}

interface RestaurantCreateFormProps {
  divisions: Division[];
  districts: District[];
  upazilas: Upazila[];
  spots: Spot[];
}

export const RestaurantCreateForm: React.FC<RestaurantCreateFormProps> = ({
  divisions,
  districts,
  upazilas,
  spots,
}) => {
  const router = useRouter();

  // Cascading Location
  const [divisionId, setDivisionId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [upazilaId, setUpazilaId] = useState('');
  const [spotId, setSpotId] = useState('');

  // Basic Info
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [mobile, setMobile] = useState('');
  const [status, setStatus] = useState('approved');
  const [category, setCategory] = useState('ঐতিহ্যবাহী খাবার (Traditional Dining)');
  const [address, setAddress] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');

  // Dining Details
  const availableCuisines = [
    'Bengali (বাংলা)',
    'Indian (ভারতীয়)',
    'Chinese (চাইনিজ)',
    'Thai (থাই)',
    'Fast Food (ফাস্ট ফুড)',
    'Continental',
    'Mughlai (মুঘলাই)',
    'Barbecue (বারবিকিউ)',
    'Seafood (সামুদ্রিক মাছ)',
    'Indigenous/Tribal (পাহাড়ি খাবার)',
  ];
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([
    'Bengali (বাংলা)',
    'Indigenous/Tribal (পাহাড়ি খাবার)',
    'Barbecue (বারবিকিউ)',
  ]);
  const [priceRange, setPriceRange] = useState('$$');
  const [seatingCapacity, setSeatingCapacity] = useState('50');
  const [openingTime, setOpeningTime] = useState('08:00 AM');
  const [closingTime, setClosingTime] = useState('11:00 PM');
  const [is24Hours, setIs24Hours] = useState(false);

  // Amenities
  const availableAmenities = [
    { id: 'ac', label: '❄️ Air Conditioned' },
    { id: 'wifi', label: '🌐 Free WiFi' },
    { id: 'parking', label: '🅿️ Parking Available' },
    { id: 'family_space', label: '👨‍👩‍👧 Family Dining Area' },
    { id: 'halal', label: '🕌 100% Halal Food' },
    { id: 'outdoor', label: '🌿 Outdoor Open Rooftop' },
    { id: 'card_payment', label: '💳 Card/Bkash Payment' },
    { id: 'takeaway', label: '🥡 Takeaway & Parcel' },
    { id: 'prayer_space', label: '🕋 Prayer Space' },
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'family_space',
    'halal',
    'outdoor',
    'card_payment',
  ]);

  // Media & Map
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
  ]);
  const [googleMapLink, setGoogleMapLink] = useState('');
  const [lat, setLat] = useState('23.3847');
  const [lng, setLng] = useState('92.2986');
  const [videoUrl, setVideoUrl] = useState('');

  // Signature Dishes Repeater
  const [signatureDishes, setSignatureDishes] = useState<Array<{ name: string; price: string; photo: string }>>([
    {
      name: 'সাজেক স্পেশাল ব্যাম্বো চিকেন (Bamboo Chicken)',
      price: '৪৫০',
      photo: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80',
    },
    {
      name: 'পাহাড়ি খাঁটি হাঁসের কালা ভুনা',
      price: '৩৮০',
      photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    },
  ]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const generateSlug = (text: string) => {
    return (
      text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'rest-' + Math.floor(Math.random() * 1000)
    );
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(val));
    }
  };

  const toggleCuisine = (item: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const filteredDistricts = divisionId
    ? districts.filter((d) => d.divisionId === Number(divisionId))
    : districts;

  const filteredUpazilas = districtId
    ? upazilas.filter((u) => u.districtId === Number(districtId))
    : [];

  const filteredSpots = spots.filter((s) => {
    if (upazilaId && s.upazilaId) return s.upazilaId === Number(upazilaId);
    if (districtId) return s.districtId === Number(districtId);
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('রেস্টুরেন্টের নাম আবশ্যক।');
      return;
    }
    if (!divisionId || !districtId) {
      setError('বিভাগ এবং জেলা নির্বাচন আবশ্যক।');
      return;
    }

    setIsLoading(true);

    try {
      const validGallery = galleryImages.filter((img) => img.trim() !== '');
      const validDishes = signatureDishes.filter((d) => d.name.trim() !== '');

      const res = await fetch('/api/v1/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slug || generateSlug(name),
          divisionId: Number(divisionId),
          districtId: Number(districtId),
          upazilaId: upazilaId ? Number(upazilaId) : null,
          spotId: spotId ? Number(spotId) : null,
          mobile,
          category,
          status,
          address,
          shortDescription,
          fullDescription,
          cuisineTypes: selectedCuisines,
          priceRange,
          seatingCapacity: seatingCapacity ? parseInt(seatingCapacity, 10) : 50,
          openingTime,
          closingTime,
          is24Hours,
          amenities: selectedAmenities,
          featuredImage,
          galleryImages: validGallery,
          signatureDishes: validDishes,
          googleMapLink,
          lat: lat ? parseFloat(lat) : null,
          lng: lng ? parseFloat(lng) : null,
          videoUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'রেস্টুরেন্ট সংরক্ষণ করা যায়নি।');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/restaurants');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error creating restaurant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/restaurants"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>রেস্টুরেন্ট তালিকায় ফিরে যান</span>
        </Link>
        <span className="text-xs text-rose-600 font-semibold bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
          Provider Restaurant Specification
        </span>
      </div>

      <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <Utensils className="w-7 h-7 text-rose-600" />
          <span>নতুন রেস্টুরেন্ট নিবন্ধন (Add Restaurant Provider)</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          ক্যাসকেডিং লোকেশন, সিগনেচার ডিশ, মেনু স্পেসিফিকেশন ও সময়সূচীসহ রেস্টুরেন্ট অন্তর্ভুক্ত করুন।
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
          <span>রেস্টুরেন্ট সফলভাবে সংরক্ষিত হয়েছে! রিডাইরেক্ট হচ্ছে...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Location Filters (Cascading) */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <MapPin className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              অবস্থান ও পর্যটন স্পট (Cascading Location)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                বিভাগ (Division) *
              </label>
              <select
                value={divisionId}
                onChange={(e) => {
                  setDivisionId(e.target.value);
                  setDistrictId('');
                  setUpazilaId('');
                  setSpotId('');
                }}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500"
                required
              >
                <option value="">বিভাগ নির্বাচন করুন *</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} বিভাগ
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                জেলা (District) *
              </label>
              <select
                value={districtId}
                onChange={(e) => {
                  setDistrictId(e.target.value);
                  setUpazilaId('');
                  setSpotId('');
                }}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500"
                required
              >
                <option value="">জেলা নির্বাচন করুন *</option>
                {filteredDistricts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                উপজেলা / থানা (Upazila)
              </label>
              <select
                value={upazilaId}
                onChange={(e) => {
                  setUpazilaId(e.target.value);
                  setSpotId('');
                }}
                disabled={!districtId || filteredUpazilas.length === 0}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500 disabled:opacity-50"
              >
                <option value="">{filteredUpazilas.length === 0 ? 'উপজেলা' : 'উপজেলা নির্বাচন করুন'}</option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                নিকটবর্তী স্পট (Tourist Spot)
              </label>
              <select
                value={spotId}
                onChange={(e) => setSpotId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500"
              >
                <option value="">স্পট নির্বাচন (ঐচ্ছিক)</option>
                {filteredSpots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Restaurant Profile */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <Utensils className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              রেস্টুরেন্ট বিবরণ (Profile & Details)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Restaurant Name (রেস্টুরেন্টের নাম) *
              </label>
              <input
                type="text"
                placeholder="e.g. পাহাড়িকা ব্যাম্বো রেস্তোরাঁ / Paharika Cafe"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                placeholder="paharika-cafe"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Mobile / Contact Number
              </label>
              <input
                type="tel"
                placeholder="+880 17XXXXXXXX"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Category (ক্যাটাগরি)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500"
              >
                <option value="ঐতিহ্যবাহী খাবার (Traditional Dining)">ঐতিহ্যবাহী খাবার (Traditional Dining)</option>
                <option value="পাহাড়ি ও ব্যাম্বো ফুড (Tribal Cuisine)">পাহাড়ি ও ব্যাম্বো ফুড (Tribal Cuisine)</option>
                <option value="ক্যাফে ও ফাস্ট ফুড (Cafe & Snacks)">ক্যাফে ও ফাস্ট ফুড (Cafe & Snacks)</option>
                <option value="বারবিকিউ ও রুফটপ (BBQ & Rooftop)">বারবিকিউ ও রুফটপ (BBQ & Rooftop)</option>
                <option value="সি ফুড কর্নার (Seafood Specialty)">সি ফুড কর্নার (Seafood Specialty)</option>
                <option value="ফাইন ডাইনিং (Fine Dining)">ফাইন ডাইনিং (Fine Dining)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Status (অনুমোদন অবস্থা)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500"
              >
                <option value="approved">Approved (অনুমোদিত)</option>
                <option value="pending">Pending (অপেক্ষমান)</option>
                <option value="rejected">Rejected (বাতিলকৃত)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Address (পূর্ণাঙ্গ ঠিকানা) *
            </label>
            <input
              type="text"
              placeholder="e.g. ক্লাব রোড, রুইলুই বাজার, সাজেক ভ্যালি"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Short Description (সংক্ষিপ্ত পরিচিতি)
            </label>
            <textarea
              rows={2}
              placeholder="রেস্টুরেন্টের সংক্ষিপ্ত আকর্ষণীয় বিবরণ..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Full Description (বিস্তারিত বিবরণ)
            </label>
            <textarea
              rows={4}
              placeholder="রেস্টুরেন্টের ইতিহাস, রান্নার বিশেষত্ব ও পরিবেশ সম্পর্কে বিস্তারিত লিখুন..."
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Section 3: Cuisines, Timing, Capacity */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <Clock className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              খাবারের ধরন, সময়সূচী ও আসন সংখ্যা
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              Cuisine Types (খাবারের ধরণসমূহ)
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {availableCuisines.map((cuisine) => (
                <button
                  type="button"
                  key={cuisine}
                  onClick={() => toggleCuisine(cuisine)}
                  className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                    selectedCuisines.includes(cuisine)
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-600 dark:text-rose-300 font-bold'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold outline-none focus:border-rose-500"
              >
                <option value="$">$ (বাজেট ফ্রেন্ডলি / সাশ্রয়ী)</option>
                <option value="$$">$$ (মাঝারি / স্ট্যান্ডার্ড)</option>
                <option value="$$$">$$$ (প্রিমিয়াম)</option>
                <option value="$$$$">$$$$ (লাক্সারি ডাইনিং)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Seating Capacity (আসন)
              </label>
              <input
                type="number"
                value={seatingCapacity}
                onChange={(e) => setSeatingCapacity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Opening Time
              </label>
              <input
                type="text"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Closing Time
              </label>
              <input
                type="text"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="24hours-check"
              checked={is24Hours}
              onChange={(e) => setIs24Hours(e.target.checked)}
              className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
            />
            <label htmlFor="24hours-check" className="text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer">
              Open 24 Hours (সার্বক্ষণিক খোলা থাকে)
            </label>
          </div>
        </div>

        {/* Section 4: Signature Dishes Repeater */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                সিগনেচার ডিশ ও মেন্যু আইটেম (Signature Dishes Repeater)
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                setSignatureDishes([
                  ...signatureDishes,
                  { name: '', price: '', photo: '' },
                ])
              }
              className="text-xs text-rose-600 font-bold flex items-center gap-1 cursor-pointer bg-rose-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800"
            >
              <Plus className="w-3.5 h-3.5" /> Add Dish
            </button>
          </div>

          <div className="space-y-4">
            {signatureDishes.map((dish, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
              >
                <div className="md:col-span-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Dish Name (খাবারের নাম) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ব্যাম্বো চিকেন বা স্পেশাল বিরিয়ানি"
                      value={dish.name}
                      onChange={(e) => {
                        const copy = [...signatureDishes];
                        copy[idx].name = e.target.value;
                        setSignatureDishes(copy);
                      }}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Price (BDT ৳) *
                    </label>
                    <input
                      type="text"
                      placeholder="৳ 450"
                      value={dish.price}
                      onChange={(e) => {
                        const copy = [...signatureDishes];
                        copy[idx].price = e.target.value;
                        setSignatureDishes(copy);
                      }}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                    />
                  </div>
                </div>

                <div className="md:col-span-7">
                  <ImageUpload
                    value={dish.photo}
                    onChange={(url) => {
                      const copy = [...signatureDishes];
                      copy[idx].photo = url;
                      setSignatureDishes(copy);
                    }}
                    folder="restaurants/dishes"
                    label="খাবারের ছবি (Dish Photo)"
                    helperText="এই আইটেমের আকর্ষণীয় ছবি আপলোড করুন"
                    aspectRatio="square"
                  />
                </div>

                <div className="md:col-span-1 flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSignatureDishes(signatureDishes.filter((_, i) => i !== idx))}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl cursor-pointer"
                    title="ডিশ মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Amenities, Media & Map */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <ImageIcon className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              সুবিধাসমূহ, ছবি ও ম্যাপ (Amenities & Media)
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              Amenities & Services
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
              {availableAmenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    selectedAmenities.includes(amenity.id)
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-600 dark:text-rose-300 font-bold'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                    className="accent-rose-600 w-4 h-4 rounded"
                  />
                  <span className="truncate">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <ImageUpload
                value={featuredImage}
                onChange={setFeaturedImage}
                folder="restaurants"
                label="Featured Banner Image (রেস্টুরেন্টের প্রধান ছবি)"
                helperText="রেস্টুরেন্টের ফ্রন্ট ভিউ বা প্রধান সাইনবোর্ডের ছবি আপলোড করুন"
                aspectRatio="video"
                required
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Google Maps Link
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={googleMapLink}
                  onChange={(e) => setGoogleMapLink(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Video Review URL (YouTube / Reels)
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Gallery Upload */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-gray-50/50 dark:bg-gray-800/40">
            <MultiImageUpload
              values={galleryImages}
              onChange={setGalleryImages}
              folder="restaurants"
              label="Gallery Images (রেস্টুরেন্ট ও পরিবেশের অতিরিক্ত ছবি)"
              helperText="ডাইনিং রুম, রুফটপ ও বিভিন্ন আইটেমের ছবি নির্বাচন করুন (অটোমেটিক অপটিমাইজ হবে)"
              maxImages={10}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Latitude
              </label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Longitude
              </label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/admin/restaurants"
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xs hover:bg-gray-50 cursor-pointer"
          >
            বাতিল করুন
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'সংরক্ষণ করা হচ্ছে...' : 'রেস্টুরেন্ট সংরক্ষণ করুন (Save Restaurant)'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
