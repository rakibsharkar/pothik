'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  X,
  RefreshCw,
  Link as LinkIcon,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { compressImage, formatBytes, CompressionResult } from '@/lib/imageCompression';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  maxWidth?: number;
  quality?: number;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'general',
  label,
  helperText,
  required = false,
  maxWidth = 1920,
  quality = 0.82,
  aspectRatio = 'auto',
  className = '',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    original: string;
    compressed: string;
    savings: number;
  } | null>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('শুধুমাত্র ইমেজ ফাইল (JPG, PNG, WebP) সিলেক্ট করুন।');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setStatusMessage('ছবি কম্প্রেস ও অপটিমাইজ করা হচ্ছে...');

    try {
      // 1. Client-side smart compression
      const compressionResult: CompressionResult = await compressImage(file, {
        maxWidth,
        quality,
        format: 'image/webp',
      });

      setStats({
        original: formatBytes(compressionResult.originalSize),
        compressed: formatBytes(compressionResult.compressedSize),
        savings: compressionResult.savingsPercentage,
      });

      setStatusMessage('সার্ভারে আপলোড হচ্ছে...');

      // 2. Upload to server
      const formData = new FormData();
      formData.append('file', compressionResult.file);
      formData.append('folder', folder);

      const res = await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('সার্ভারে আপলোড ব্যর্থ হয়েছে');
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
        setUrlInput(data.url);
        setStatusMessage('সফলভাবে আপলোড সম্পন্ন হয়েছে!');
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        throw new Error(data.error || 'অজানা ত্রুটি');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'আপলোড করার সময় সমস্যা হয়েছে');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setError('একটি বৈধ ইমেজ ইউআরএল প্রদান করুন');
      return;
    }
    setError(null);
    setStats(null);
    onChange(urlInput.trim());
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    setStats(null);
    setError(null);
    setStatusMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Mode Switch */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>{label}</span>
            {required && <span className="text-rose-500">*</span>}
          </label>
        )}

        <div className="flex items-center gap-1 text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              mode === 'upload'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            ফাইল আপলোড
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              mode === 'url'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            লিঙ্ক / URL
          </button>
        </div>
      </div>

      {/* URL Mode */}
      {mode === 'url' && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
          >
            সেট করুন
          </button>
        </div>
      )}

      {/* Upload Mode or Image Preview */}
      {mode === 'upload' && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={onFileChange}
            className="hidden"
          />

          {!value ? (
            /* Dropzone when no image is selected */
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 scale-[0.99]'
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800/70'
              }`}
            >
              {isProcessing ? (
                <div className="py-4 space-y-2">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {statusMessage || 'কম্প্রেস ও আপলোড হচ্ছে...'}
                  </p>
                  <p className="text-[11px] text-gray-400">অপেক্ষা করুন, ছবির সাইজ অপটিমাইজ করা হচ্ছে</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      ডিভাইস থেকে ছবি আপলোড করুন
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      ছবি এখানে টেনে আনুন বা ক্লিক করে সিলেক্ট করুন (অটোমেটিক কম্প্রেস হবে)
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-[10px] font-semibold text-emerald-600">
                    <span>স্মার্ট WebP কম্প্রেশন</span>
                    <span>•</span>
                    <span>HD কোয়ালিটি সংরক্ষিত</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Preview when image exists */
            <div className="relative group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 shadow-sm">
              <div
                className={`relative w-full overflow-hidden bg-black/40 flex items-center justify-center ${
                  aspectRatio === 'video'
                    ? 'aspect-video'
                    : aspectRatio === 'square'
                    ? 'aspect-square max-w-[200px] mx-auto'
                    : 'max-h-56'
                }`}
              >
                <img
                  src={value}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-gray-900 text-xs font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>পরিবর্তন</span>
                  </button>

                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-white/90 hover:bg-white text-gray-900 shadow-md transition-transform active:scale-95"
                    title="নতুন ট্যাবে দেখুন"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-transform active:scale-95"
                    title="ছবি মুছে ফেলুন"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Compression stats ribbon */}
              {stats && (
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/70 border-t border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      {stats.original} ➔ {stats.compressed}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-[10px] font-bold">
                    {stats.savings}% সাইজ সাশ্রয়
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className="text-[11px] text-gray-400">{helperText}</p>
      )}
    </div>
  );
}
