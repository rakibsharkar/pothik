'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Images,
  X,
  Plus,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
} from 'lucide-react';
import { compressImage, formatBytes } from '@/lib/imageCompression';

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  helperText?: string;
  maxImages?: number;
  maxWidth?: number;
  quality?: number;
  className?: string;
}

export default function MultiImageUpload({
  values = [],
  onChange,
  folder = 'general',
  label = 'ফটো গ্যালারি (Gallery Images)',
  helperText = 'একাধিক ছবি ড্রপ করুন বা ব্রাউজ করে নির্বাচন করুন (অটোমেটিক কম্প্রেস হবে)',
  maxImages = 15,
  maxWidth = 1920,
  quality = 0.82,
  className = '',
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [lastUploadedSavings, setLastUploadedSavings] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      setError('শুধুমাত্র ইমেজ ফাইল নির্বাচন করুন');
      return;
    }

    if (values.length + files.length > maxImages) {
      setError(`সর্বোচ্চ ${maxImages} টি ছবি আপলোড করা যাবে`);
      return;
    }

    setError(null);
    setUploadingCount(files.length);

    let totalOriginal = 0;
    let totalCompressed = 0;
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        // Compress
        const compressed = await compressImage(file, {
          maxWidth,
          quality,
          format: 'image/webp',
        });

        totalOriginal += compressed.originalSize;
        totalCompressed += compressed.compressedSize;

        // Upload
        const formData = new FormData();
        formData.append('file', compressed.file);
        formData.append('folder', folder);

        const res = await fetch('/api/v1/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            uploadedUrls.push(data.url);
          }
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...values, ...uploadedUrls]);
        const savingsPct =
          totalOriginal > 0
            ? Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100)
            : 0;
        setLastUploadedSavings(
          `${formatBytes(totalOriginal)} ➔ ${formatBytes(totalCompressed)} (${savingsPct}% সাশ্রয়)`
        );
        setTimeout(() => setLastUploadedSavings(null), 5000);
      }
    } catch (err: any) {
      console.error('Batch upload failed:', err);
      setError('কিছু ছবি আপলোডে সমস্যা হয়েছে');
    } finally {
      setUploadingCount(0);
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(values.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    onChange([...values, urlInput.trim()]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Images className="w-3.5 h-3.5 text-emerald-600" />
            <span>{label}</span>
            <span className="text-gray-400 font-normal">
              ({values.length}/{maxImages})
            </span>
          </label>
          {helperText && <p className="text-[11px] text-gray-400 mt-0.5">{helperText}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'লিঙ্ক লুকান' : 'URL দিয়ে যোগ'}</span>
          </button>
        </div>
      </div>

      {/* URL input drawer */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            যোগ করুন
          </button>
        </div>
      )}

      {/* Savings alert */}
      {lastUploadedSavings && (
        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>ছবিগুলো সফলভাবে কম্প্রেস হয়েছে: {lastUploadedSavings}</span>
        </div>
      )}

      {/* Dropzone & Preview Grid */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Upload Button Tile */}
        {values.length < maxImages && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all p-2 text-center ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 scale-[0.98]'
                : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800/70'
            }`}
          >
            {uploadingCount > 0 ? (
              <div className="space-y-1">
                <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin mx-auto" />
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 block">
                  {uploadingCount}টি প্রসেস হচ্ছে...
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block">
                  ছবি যোগ করুন
                </span>
                <span className="text-[9px] text-gray-400 block">ড্রপ বা ক্লিক</span>
              </div>
            )}
          </div>
        )}

        {/* Existing Images */}
        {values.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="group relative aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 shadow-xs"
          >
            <img
              src={url}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-bold">
              #{idx + 1}
            </div>

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-900 shadow"
                title="নতুন ট্যাবে প্রিভিউ"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow"
                title="ছবি মুছে ফেলুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
