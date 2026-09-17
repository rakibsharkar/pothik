'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Hotel,
  MapPin,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Save,
  ImageIcon,
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

interface HotelCreateFormProps {
  divisions: Division[];
  districts: District[];
  upazilas: Upazila[];
  spots: Spot[];
}

export const HotelCreateForm: React.FC<HotelCreateFormProps> = ({
  divisions,
  districts,
  upazilas,
  spots,
}) => {
  const router = useRouter();

  // Location filters
  const [divisionId, setDivisionId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [upazilaId, setUpazilaId] = useState('');
  const [spotId, setSpotId] = useState('');

  // Hotel basic info
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [paymentMode, setPaymentMode] = useState('pay_at_property');
  const [rating, setRating] = useState('4.8');
  const [isVerified, setIsVerified] = useState(true);
  const [status, setStatus] = useState('active');

  // Amenities
  const availableAmenities = [
    { id: 'wifi', label: '🌐 High-Speed WiFi' },
    { id: 'ac', label: '❄️ Air Conditioned (AC)' },
    { id: 'parking', label: '🅿️ Free Parking' },
    { id: 'restaurant', label: '🍲 In-house Restaurant' },
    { id: 'room_service', label: '🛎️ 24/7 Room Service' },
    { id: 'power_backup', label: '⚡ 24/7 Generator Backup' },
    { id: 'hot_water', label: '🚿 Hot Water Geyser' },
    { id: 'swimming_pool', label: '🏊 Swimming Pool' },
    { id: 'balcony_view', label: '🌄 Mountain/Scenic Balcony' },
    { id: 'cctv_security', label: '🛡️ CCTV & Guard Security' },
    { id: 'helipad_transfer', label: '🚁 Helipad Transfer' },
    { id: 'campfire', label: '🔥 Campfire & BBQ Zone' },
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'wifi',
    'room_service',
    'power_backup',
    'hot_water',
    'balcony_view',
  ]);

  // Media
  const [featuredImage, setFeaturedImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [lat, setLat] = useState('23.3847');
  const [lng, setLng] = useState('92.2986');

  // Business Verification (Provider Documents)
  const [tradeLicenseImage, setTradeLicenseImage] = useState('');
  const [signboardImage, setSignboardImage] = useState('');
  const [receptionImage, setReceptionImage] = useState('');
  const [utilityBillImage, setUtilityBillImage] = useState('');

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
        .replace(/^-+|-+$/g, '') || 'hotel-' + Math.floor(Math.random() * 10000)
    );
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(val));
    }
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered lists for cascading dropdowns
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
      setError('হোটেলের নাম আবশ্যক।');
      return;
    }
    if (!spotId) {
      setError('ট্যুরিস্ট স্পট নির্বাচন করা বাধ্যতামূলক।');
      return;
    }

    setIsLoading(true);

    try {
      const validGallery = galleryImages.filter((img) => img.trim() !== '');

      const res = await fetch('/api/v1/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slug || generateSlug(name),
          spotId: Number(spotId),
          address,
          contactNumber,
          paymentMode,
          amenities: selectedAmenities,
          rating: parseFloat(rating) || 4.5,
          featuredImage,
          galleryImages: validGallery,
          lat: lat ? parseFloat(lat) : null,
          lng: lng ? parseFloat(lng) : null,
          isVerified,
          status,
          verificationDocs: {
            tradeLicenseImage,
            signboardImage,
            receptionImage,
            utilityBillImage,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'হোটেল সংরক্ষণ করা যায়নি।');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/hotels');
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
          href="/admin/hotels"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোটেল তালিকায় ফিরে যান</span>
        </Link>
        <span className="text-xs text-orange-600 font-semibold bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
          Provider Hotel Specification
        </span>
      </div>

      <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <Hotel className="w-7 h-7 text-orange-600" />
          <span>নতুন হোটেল ও রিসোর্ট নিবন্ধন (Add Hotel Provider)</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          ক্যাসকেডিং লোকেশন, রুম পলিসি ও প্রোভাইডার ভেরিফিকেশনসহ হোটেল যুক্ত করুন।
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
          <span>হোটেল সফলভাবে সংরক্ষিত হয়েছে! রিডাইরেক্ট হচ্ছে...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Location Filters (Cascading) */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              অবস্থান ও ট্যুরিস্ট স্পট ফিল্টার (Cascading Location)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                বিভাগ (Division)
              </label>
              <select
                value={divisionId}
                onChange={(e) => {
                  setDivisionId(e.target.value);
                  setDistrictId('');
                  setUpazilaId('');
                  setSpotId('');
                }}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold outline-none focus:border-orange-500"
              >
                <option value="">সকল বিভাগ</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} বিভাগ
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                জেলা (District)
              </label>
              <select
                value={districtId}
                onChange={(e) => {
                  setDistrictId(e.target.value);
                  setUpazilaId('');
                  setSpotId('');
                }}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold outline-none focus:border-orange-500"
              >
                <option value="">সকল জেলা</option>
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
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold outline-none focus:border-orange-500 disabled:opacity-50"
              >
                <option value="">{filteredUpazilas.length === 0 ? 'সকল উপজেলা' : 'উপজেলা নির্বাচন করুন'}</option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                ট্যুরিস্ট স্পট (Tourist Spot) *
              </label>
              <select
                value={spotId}
                onChange={(e) => setSpotId(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border-2 border-orange-500/50 bg-orange-50/20 dark:bg-gray-800 text-xs font-bold outline-none focus:border-orange-600"
              >
                <option value="">স্পট নির্বাচন করুন *</option>
                {filteredSpots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Hotel Details */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <Hotel className="w-5 h-5 text-orange-600" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              হোটেলের মৌলিক বিবরণ (Hotel Profile)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Hotel Name (হোটেলের নাম) *
              </label>
              <input
                type="text"
                placeholder="e.g. সাজেক রিসোর্ট / Sajek Resort"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                placeholder="sajek-resort"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Address (সম্পূর্ণ ঠিকানা ও ল্যান্ডমার্ক) *
            </label>
            <input
              type="text"
              placeholder="e.g. রুইলুই পাড়া, হ্যালিপ্যাডের কাছে, সাজেক, বাঘাইছড়ি"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Contact Number (যোগাযোগ নম্বর)
              </label>
              <input
                type="tel"
                placeholder="+880 18XXXXXXXX"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Payment Mode (পেমেন্ট পলিসি)
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold outline-none focus:border-orange-500"
              >
                <option value="pay_at_property">Pay at Property (হোটেল কাউন্টারে পরিশোধ)</option>
                <option value="prepaid">Prepaid (অনলাইন অগ্রিম পরিশোধ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Rating (রেটিং - 0 to 5)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Amenities */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              হোটেলের সুবিধাসমূহ (Amenities & Features)
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
            {availableAmenities.map((amenity) => (
              <label
                key={amenity.id}
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  selectedAmenities.includes(amenity.id)
                    ? 'bg-orange-50 dark:bg-orange-950/50 border-orange-500 text-orange-700 dark:text-orange-300 font-bold'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.id)}
                  onChange={() => toggleAmenity(amenity.id)}
                  className="accent-orange-600 w-4 h-4 rounded"
                />
                <span className="truncate">{amenity.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 4: Media & Map */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <ImageIcon className="w-5 h-5 text-orange-600" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              ছবি ও অবস্থান কোঅর্ডিনেট (Photos & Coordinates)
            </h2>
          </div>

          <div>
            <ImageUpload
              value={featuredImage}
              onChange={setFeaturedImage}
              folder="hotels"
              label="Featured Image (প্রধান ব্যানার ছবি)"
              helperText="হোটেল বা রিসোর্টের প্রধান ফ্রন্ট ভিউ ছবি নির্বাচন করুন (অটোমেটিক কম্প্রেস হয়ে দ্রুত লোড হবে)"
              aspectRatio="video"
              required
            />
          </div>

          {/* Gallery Repeater */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-gray-50/50 dark:bg-gray-800/40">
            <MultiImageUpload
              values={galleryImages}
              onChange={setGalleryImages}
              folder="hotels"
              label="Gallery Images (রিসোর্ট ও রুমের অতিরিক্ত ছবি)"
              helperText="রুম, ওয়াশরুম, ব্যালকনি ও লবির একাধিক ছবি নির্বাচন করুন। সব ছবি একসাথে কম্প্রেস হয়ে আপলোড হবে।"
              maxImages={10}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Latitude (অক্ষাংশ)
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
                Longitude (দ্রাঘিমাংশ)
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

        {/* Section 5: Business Verification */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <ShieldCheck className="w-5 h-5 text-orange-600" />
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                প্রোভাইডার ভেরিফিকেশন ডকুমেন্ট (Business Verification)
              </h2>
              <p className="text-[11px] text-gray-400">
                হোটেল মালিকানা নিশ্চিত করতে প্রয়োজনীয় সরকারি ও প্রোপার্টি ডকুমেন্টস আপলোড করুন।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ImageUpload
              value={tradeLicenseImage}
              onChange={setTradeLicenseImage}
              folder="hotels/kyc"
              label="ট্রেড লাইসেন্স কপি (Trade License)"
              helperText="হোটেল পরিচালনার বৈধ সরকারি ট্রেড লাইসেন্স ডকুমেন্ট"
            />

            <ImageUpload
              value={signboardImage}
              onChange={setSignboardImage}
              folder="hotels/kyc"
              label="হোটেল সাইনবোর্ড ছবি (Outside Front View)"
              helperText="রাস্তা থেকে স্পষ্টভাবে দৃশ্যমান প্রধান সাইনবোর্ড ছবি"
            />

            <ImageUpload
              value={receptionImage}
              onChange={setReceptionImage}
              folder="hotels/kyc"
              label="রিসেপশন ডেস্ক ও লবি (Reception Photo)"
              helperText="হোটেলের অভ্যন্তরে অতিথি অভ্যর্থনা কাউন্টারের ছবি"
            />

            <ImageUpload
              value={utilityBillImage}
              onChange={setUtilityBillImage}
              folder="hotels/kyc"
              label="ইউটিলিটি বিল কপি (Utility Bill)"
              helperText="হোটেলের ঠিকানার সাথে মিল রেখে সাম্প্রতিক বিদ্যুৎ/গ্যাস বিল"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="verified-check"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
              className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
            />
            <label htmlFor="verified-check" className="text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer">
              Mark Hotel as Verified (ভেরিফাইড ব্যাজ সক্রিয় করুন)
            </label>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/admin/hotels"
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xs hover:bg-gray-50 cursor-pointer"
          >
            বাতিল করুন
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'সংরক্ষণ করা হচ্ছে...' : 'হোটেল যুক্ত করুন (Save Hotel Provider)'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
