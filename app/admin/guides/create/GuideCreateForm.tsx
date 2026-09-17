'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UserCheck,
  User,
  MapPin,
  Phone,
  ShieldCheck,
  Award,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
  DollarSign,
  Lock,
} from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';


interface District {
  id: number;
  name: string;
  divisionId: number;
}

interface GuideCreateFormProps {
  districts: District[];
}

export const GuideCreateForm: React.FC<GuideCreateFormProps> = ({ districts }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'basic' | 'service' | 'contact' | 'identity' | 'admin'>('basic');

  // Step 1: Basic Profile Information
  const [name, setName] = useState('');
  const [userPhoto, setUserPhoto] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
  );
  const [dob, setDob] = useState('1995-05-12');
  const [gender, setGender] = useState('male');
  const [nationality, setNationality] = useState('Bangladeshi');
  const [shortBio, setShortBio] = useState(
    'আমি পার্বত্য চট্টগ্রাম ও বান্দরবানের পাহাড়ি ট্র্যাকিং ও সাজেক ভ্যালির অভিজ্ঞ স্থানীয় ট্যুর গাইড। বিগত ৫ বছর ধরে দেশি-বিদেশি পর্যটকদের নিরাপদ ও রোমাঞ্চকর ভ্রমণের অভিজ্ঞতা দিয়ে আসছি।'
  );
  const availableLanguages = ['Bangla (বাংলা)', 'English (ইংরেজি)', 'Arabic (আরবি)', 'Hindi (হিন্দি)', 'Chittagonian (চাটগাঁইয়া)', 'Sylheti (সিলেটি)'];
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Bangla (বাংলা)', 'English (ইংরেজি)']);
  const [yearsOfExperience, setYearsOfExperience] = useState('5');
  const availableSpecializations = [
    { id: 'hill', label: '⛰️ Hill Trekking (পাহাড়ি ট্র্যাকিং)' },
    { id: 'sea', label: '🏖️ Sea & Beach (সমুদ্র ভ্রমণ)' },
    { id: 'historical', label: '🏛️ Historical (ঐতিহাসিক স্থান)' },
    { id: 'religious', label: '🕌 Religious (ধর্মীয় দর্শন)' },
    { id: 'adventure', label: '🧗 Adventure & Camp (অ্যাডভেঞ্চার)' },
    { id: 'city_tour', label: '🏙️ City Tour (নগর পরিভ্রমণ)' },
    { id: 'eco_tourism', label: '🌱 Eco Tourism (ইকো ট্যুরিজম)' },
  ];
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([
    'hill',
    'adventure',
  ]);

  // Step 2: Service Area & Pricing
  const [selectedDistricts, setSelectedDistricts] = useState<number[]>([1, 2, 3]); // default some districts
  const [dailyRate, setDailyRate] = useState('1500');
  const [halfDayRate, setHalfDayRate] = useState('900');
  const [multiDayPackageRate, setMultiDayPackageRate] = useState('4000');
  const [maxGroupSize, setMaxGroupSize] = useState('12');
  const [vehicleIncluded, setVehicleIncluded] = useState(false);
  const [emergencySupportIncluded, setEmergencySupportIncluded] = useState(true);

  // Step 3: Contact & Emergency
  const [phone, setPhone] = useState('+880 1711-234567');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('+880 1711-234567');
  const [emergencyContactName, setEmergencyContactName] = useState('মোঃ করিম উল্লাহ (বড় ভাই)');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('+880 1819-987654');

  // Step 4: Identity Verification & References
  const [nidNumber, setNidNumber] = useState('19951234567890123');
  const [nidFrontImage, setNidFrontImage] = useState(
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80'
  );
  const [nidBackImage, setNidBackImage] = useState(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80'
  );
  const [permanentAddress, setPermanentAddress] = useState('গ্রাম: রুইলুই, থানা: বাঘাইছড়ি, জেলা: রাঙামাটি');
  const [currentAddress, setCurrentAddress] = useState('কলেজ রোড, খাগড়াছড়ি সদর, খাগড়াছড়ি');
  const [referenceName, setReferenceName] = useState('কাজী আনোয়ার হোসেন (সাবেক চেয়ারম্যান)');
  const [referencePhone, setReferencePhone] = useState('+880 1712-334455');

  // Step 5: Admin Control & Legal Status
  const [status, setStatus] = useState('approved');
  const [kycVerified, setKycVerified] = useState(true);
  const [policeVerified, setPoliceVerified] = useState(true);
  const [riskScore, setRiskScore] = useState('10');
  const [adminNotes, setAdminNotes] = useState('শারীরিকভাবে দক্ষ এবং স্থানীয় রুটে অত্যন্ত অভিজ্ঞ গাইড।');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [rulesAgreed, setRulesAgreed] = useState(true);
  const [safetyPolicyAgreed, setSafetyPolicyAgreed] = useState(true);
  const [backgroundCheckAccepted, setBackgroundCheckAccepted] = useState(true);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleSpecialization = (id: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleDistrict = (id: number) => {
    setSelectedDistricts((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setActiveTab('basic');
      setError('গাইডের পুরো নাম আবশ্যক।');
      return;
    }
    if (!email.trim() || !phone.trim()) {
      setActiveTab('contact');
      setError('ইমেইল এবং মোবাইল নম্বর আবশ্যক।');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          user_photo: userPhoto,
          dob,
          gender,
          nationality,
          short_bio: shortBio,
          languages: selectedLanguages,
          years_of_experience: yearsOfExperience,
          specialization: selectedSpecializations,
          districts: selectedDistricts,
          daily_rate: dailyRate,
          half_day_rate: halfDayRate,
          multi_day_package_rate: multiDayPackageRate,
          max_group_size: maxGroupSize,
          vehicle_included: vehicleIncluded,
          emergency_support_included: emergencySupportIncluded,
          whatsapp_number: whatsappNumber,
          emergency_contact_name: emergencyContactName,
          emergency_contact_phone: emergencyContactPhone,
          nid_number: nidNumber,
          nid_front_image: nidFrontImage,
          nid_back_image: nidBackImage,
          permanent_address: permanentAddress,
          current_address: currentAddress,
          reference_name: referenceName,
          reference_phone: referencePhone,
          status,
          kyc_verified: kycVerified,
          police_verified: policeVerified,
          risk_score: parseInt(riskScore, 10) || 0,
          admin_notes: adminNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ট্যুর গাইড সংরক্ষণ করা যায়নি।');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/guides');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error creating guide');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/guides"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>গাইড তালিকায় ফিরে যান</span>
        </Link>
        <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          GuideForm & Admin Control Schema
        </span>
      </div>

      <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <UserCheck className="w-7 h-7 text-indigo-600" />
          <span>নতুন ট্যুর গাইড নিবন্ধন (Add Tour Guide)</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          জাতীয় পরিচয়পত্র (NID), পুলিশ ভেরিফিকেশন, রেট প্যাকেজ ও সার্ভিস এরিয়াসহ গাইড প্রোফাইল তৈরি করুন।
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
          <span>ট্যুর গাইড সফলভাবে নিবন্ধিত হয়েছে! রিডাইরেক্ট হচ্ছে...</span>
        </div>
      )}

      {/* 5-Step Tabs matching Filament GuideForm */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 text-xs sm:text-sm font-semibold space-x-1 sm:space-x-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'basic'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <User className="w-4 h-4" />
          <span>১. প্রোফাইল ও দক্ষতা</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('service')}
          className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'service'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>২. সার্ভিস জেলা ও ফি</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'contact'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>৩. যোগাযোগ ও ইমার্জেন্সি</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'identity'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>৪. NID ও রেফারেন্স</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'admin'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>৫. এডমিন কন্ট্রোল ও পলিসি</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
        
        {/* Step 1: Basic Profile Information */}
        {activeTab === 'basic' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Full Name (as per NID - জাতীয় পরিচয়পত্র অনুযায়ী নাম) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. মোঃ তানভীর আলম"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <ImageUpload
                  value={userPhoto}
                  onChange={setUserPhoto}
                  folder="guides/avatars"
                  label="Profile Photo (প্রোফাইল ছবি)"
                  helperText="গাইডের স্পষ্ট ছবি নির্বাচন করুন (অটোমেটিক কম্প্রেস হবে)"
                  aspectRatio="square"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth (জন্ম তারিখ)
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Gender (লিঙ্গ)
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-indigo-500"
                >
                  <option value="male">Male (পুরুষ)</option>
                  <option value="female">Female (নারী)</option>
                  <option value="other">Other (অন্যান্য)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Years of Experience (অভিজ্ঞতা বছর)
                </label>
                <input
                  type="number"
                  min="0"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Short Bio (সংক্ষিপ্ত পরিচিতি ও গাইডিং অভিজ্ঞতা) *
              </label>
              <textarea
                rows={4}
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                placeholder="নিজের পরিচয় এবং গাইডিং এর প্রতি আপনার অভিজ্ঞতা সম্পর্কে বিস্তারিত লিখুন..."
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                Languages Spoken (ভাষাগত দক্ষতা)
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {availableLanguages.map((lang) => (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                      selectedLanguages.includes(lang)
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-300 font-bold'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                Specialized Tour Type (বিশেষজ্ঞতা)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {availableSpecializations.map((spec) => (
                  <label
                    key={spec.id}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      selectedSpecializations.includes(spec.id)
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSpecializations.includes(spec.id)}
                      onChange={() => toggleSpecialization(spec.id)}
                      className="accent-indigo-600 w-4 h-4 rounded"
                    />
                    <span className="truncate">{spec.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Service Area & Pricing */}
        {activeTab === 'service' && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Available Service Districts ({selectedDistricts.length} districts selected)
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs max-h-56 overflow-y-auto pr-1">
                {districts.map((d) => (
                  <label
                    key={d.id}
                    className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                      selectedDistricts.includes(d.id)
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDistricts.includes(d.id)}
                      onChange={() => toggleDistrict(d.id)}
                      className="accent-indigo-600 w-3.5 h-3.5 rounded"
                    />
                    <span className="truncate">{d.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Daily Rate (দৈনিক ফি ৳) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-xs">৳</span>
                  <input
                    type="number"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(e.target.value)}
                    className="w-full pl-8 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Half-Day Rate (অর্ধদিবস ফি ৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-xs">৳</span>
                  <input
                    type="number"
                    value={halfDayRate}
                    onChange={(e) => setHalfDayRate(e.target.value)}
                    className="w-full pl-8 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Multi-Day Package Rate (মাল্টি-ডে প্যাকেজ ৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-xs">৳</span>
                  <input
                    type="number"
                    value={multiDayPackageRate}
                    onChange={(e) => setMultiDayPackageRate(e.target.value)}
                    className="w-full pl-8 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Max Group Size (সর্বোচ্চ দল সদস্য)
                </label>
                <input
                  type="number"
                  value={maxGroupSize}
                  onChange={(e) => setMaxGroupSize(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="vehicle-check"
                  checked={vehicleIncluded}
                  onChange={(e) => setVehicleIncluded(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="vehicle-check" className="text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer">
                  Vehicle Included (পরিবহন অন্তর্ভুক্ত)
                </label>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="emergency-check"
                  checked={emergencySupportIncluded}
                  onChange={(e) => setEmergencySupportIncluded(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="emergency-check" className="text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer">
                  Emergency Support Included (জরুরী সহায়তা)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Contact & Emergency */}
        {activeTab === 'contact' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number (মোবাইল নম্বর) *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Email Address (ইমেইল ঠিকানা) *
                </label>
                <input
                  type="email"
                  placeholder="guide@pothik.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  WhatsApp Number (হোয়াটসঅ্যাপ)
                </label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-3">
              <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                🚨 Emergency Contact (জরুরী যোগাযোগের তথ্য)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Emergency Contact Person Name (জরুরী ব্যক্তির নাম)
                  </label>
                  <input
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Emergency Contact Phone (জরুরী ফোন নম্বর)
                  </label>
                  <input
                    type="tel"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Identity Verification & References */}
        {activeTab === 'identity' && (
          <div className="space-y-4 animate-fade-in-up">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                National ID (NID) Number *
              </label>
              <input
                type="text"
                placeholder="10 or 17 digit NID number"
                value={nidNumber}
                onChange={(e) => setNidNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-mono outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ImageUpload
                value={nidFrontImage}
                onChange={setNidFrontImage}
                folder="guides/kyc"
                label="NID Front Side (সামনের অংশ)"
                helperText="জাতীয় পরিচয়পত্রের সামনের অংশের স্পষ্ট ছবি বা স্ক্যান কপি"
              />

              <ImageUpload
                value={nidBackImage}
                onChange={setNidBackImage}
                folder="guides/kyc"
                label="NID Back Side (পেছনের অংশ)"
                helperText="জাতীয় পরিচয়পত্রের পেছনের অংশের স্পষ্ট ছবি বা স্ক্যান কপি"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Permanent Address (স্থায়ী ঠিকানা)
                </label>
                <textarea
                  rows={2}
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Current Address (বর্তমান ঠিকানা)
                </label>
                <textarea
                  rows={2}
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-3">
              <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                স্থানীয় গণমান্য ব্যক্তির রেফারেন্স (Local Reference)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Reference Person Name (রেফারেন্স ব্যক্তির নাম)
                  </label>
                  <input
                    type="text"
                    value={referenceName}
                    onChange={(e) => setReferenceName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Reference Contact Phone (রেফারেন্স ফোন নম্বর)
                  </label>
                  <input
                    type="tel"
                    value={referencePhone}
                    onChange={(e) => setReferencePhone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Admin Control & Legal Status */}
        {activeTab === 'admin' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="p-4 rounded-xl border-2 border-indigo-500/30 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                  🛡️ Admin Control & Verification Status (এডমিন যাচাইকরণ)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Verification Status (স্ট্যাটাস)
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-bold outline-none focus:border-indigo-500"
                  >
                    <option value="approved">Approved (অনুমোদিত গাইড)</option>
                    <option value="pending">Pending (যাচাই অপেক্ষমান)</option>
                    <option value="under_review">Under Review (পর্যালোচনাধীন)</option>
                    <option value="suspended">Suspended (স্থগিত)</option>
                    <option value="rejected">Rejected (বাতিলকৃত)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Risk Score (অভ্যন্তরীণ ঝুঁকি স্কোর: 0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={riskScore}
                    onChange={(e) => setRiskScore(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="kyc-verified"
                    checked={kycVerified}
                    onChange={(e) => setKycVerified(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                  <label htmlFor="kyc-verified" className="text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer">
                    KYC Verified (এনআইডি পরিচয়পত্র যাচাই সম্পন্ন)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="police-verified"
                    checked={policeVerified}
                    onChange={(e) => setPoliceVerified(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                  <label htmlFor="police-verified" className="text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer">
                    Police Verified (পুলিশ ক্লিয়ারেন্স অনুমোদিত)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Admin Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="অভ্যন্তরীণ প্রশাসনিক মন্তব্য..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                />
              </div>
            </div>

            {/* Legal Agreements */}
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="accent-indigo-600 rounded"
                />
                <span>আমি নিশ্চিত করছি যে প্রদত্ত সকল তথ্য ও পরিচয়পত্র সঠিক।</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={rulesAgreed}
                  onChange={(e) => setRulesAgreed(e.target.checked)}
                  className="accent-indigo-600 rounded"
                />
                <span>আমি প্ল্যাটফর্মের নিয়মাবলী ও নিরাপত্তা নীতিমালা মেনে চলতে বাধ্য থাকব।</span>
              </label>
            </div>
          </div>
        )}

        {/* Footer Navigation and Submit Bar */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex gap-2 text-xs">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'service') setActiveTab('basic');
                  if (activeTab === 'contact') setActiveTab('service');
                  if (activeTab === 'identity') setActiveTab('contact');
                  if (activeTab === 'admin') setActiveTab('identity');
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 cursor-pointer"
              >
                Previous Step
              </button>
            )}

            {activeTab !== 'admin' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'basic') setActiveTab('service');
                  if (activeTab === 'service') setActiveTab('contact');
                  if (activeTab === 'contact') setActiveTab('identity');
                  if (activeTab === 'identity') setActiveTab('admin');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 cursor-pointer"
              >
                Next Step
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'সংরক্ষণ করা হচ্ছে...' : 'ট্যুর গাইড যুক্ত করুন (Save Tour Guide)'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
