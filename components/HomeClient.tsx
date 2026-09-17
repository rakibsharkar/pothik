'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { CategoriesSection } from './CategoriesSection';
import { FeaturedSpots, SpotItem } from './FeaturedSpots';
import { HotelsSection, HotelItem } from './HotelsSection';
import { RestaurantsSection, RestaurantItem } from './RestaurantsSection';
import { GuidesSection, GuideItem } from './GuidesSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FeaturesSection } from './FeaturesSection';
import { Footer } from './Footer';

interface HomeClientProps {
  divisions: Array<{ id: number; name: string; slug: string | null }>;
  districts: Array<{ id: number; name: string; divisionId: number; slug: string | null }>;
  spots: SpotItem[];
  hotels: HotelItem[];
  restaurants?: RestaurantItem[];
  guides?: GuideItem[];
}

export const HomeClient: React.FC<HomeClientProps> = ({
  divisions,
  districts,
  spots,
  hotels,
  restaurants,
  guides,
}) => {
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleHeroSearch = (
    divisionId: string,
    districtId: string,
    category: string,
    keyword: string
  ) => {
    setSelectedDivision(divisionId);
    setSelectedDistrict(districtId);
    setSelectedCategory(category === 'all' ? '' : category);
    setSearchKeyword(keyword);

    const spotsSection = document.getElementById('spots');
    if (spotsSection) {
      spotsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      if (selectedDivision && spot.divisionId !== Number(selectedDivision)) {
        return false;
      }
      if (selectedDistrict && spot.districtId !== Number(selectedDistrict)) {
        return false;
      }
      if (searchKeyword) {
        const query = searchKeyword.toLowerCase();
        const matchesName = spot.name.toLowerCase().includes(query);
        const matchesDesc = (spot.description || '').toLowerCase().includes(query);
        const matchesDistrict = (spot.district?.name || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesDistrict) {
          return false;
        }
      }
      if (selectedCategory) {
        const lowerDesc = (spot.description || '').toLowerCase();
        const lowerName = spot.name.toLowerCase();
        if (
          (selectedCategory === 'mountains' || selectedCategory === 'hills') &&
          !lowerName.includes('সাজেক') &&
          !lowerDesc.includes('পাহাড়') &&
          !lowerDesc.includes('উপত্যকা')
        ) {
          return false;
        }
        if (
          (selectedCategory === 'beaches' || selectedCategory === 'sea') &&
          !lowerName.includes('কক্সবাজার') &&
          !lowerName.includes('সেন্টমার্টিন') &&
          !lowerDesc.includes('সমুদ্র') &&
          !lowerDesc.includes('সৈকত')
        ) {
          return false;
        }
        if (
          (selectedCategory === 'forests' || selectedCategory === 'forest') &&
          !lowerName.includes('সুন্দরবন') &&
          !lowerName.includes('রাতারগুল') &&
          !lowerDesc.includes('বন') &&
          !lowerDesc.includes('ম্যানগ্রোভ')
        ) {
          return false;
        }
        if (
          selectedCategory === 'islands' &&
          !lowerName.includes('সেন্টমার্টিন') &&
          !lowerDesc.includes('দ্বীপ')
        ) {
          return false;
        }
      }
      return true;
    });
  }, [spots, selectedDivision, selectedDistrict, selectedCategory, searchKeyword]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        <HeroSection
          divisions={divisions}
          districts={districts}
          onSearch={handleHeroSearch}
        />

        <CategoriesSection
          activeCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        <FeaturedSpots spots={filteredSpots} />

        <HotelsSection hotels={hotels} />

        <RestaurantsSection restaurants={restaurants} />

        <GuidesSection guides={guides} />

        <TestimonialsSection />

        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
};
