import React from 'react';
import prisma from '@/lib/prisma';
import { HomeClient } from '@/components/HomeClient';

export const revalidate = 60; // revalidate every 60 seconds

export default async function HomePage() {
  // Fetch divisions, districts, spots, hotels, restaurants, and guides from SQLite via Prisma
  const [divisions, districts, spots, hotels, restaurants, guides] = await Promise.all([
    prisma.division.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
    prisma.district.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, divisionId: true, slug: true },
    }),
    prisma.spot.findMany({
      include: {
        district: {
          select: { name: true },
        },
      },
      orderBy: { isFeatured: 'desc' },
    }),
    prisma.hotel.findMany({
      include: {
        spot: {
          select: { name: true, slug: true },
        },
        rooms: {
          select: { price: true, discountPrice: true, title: true },
        },
      },
      take: 6,
    }),
    prisma.restaurant.findMany({
      include: {
        district: {
          select: { name: true },
        },
      },
      take: 6,
    }),
    prisma.guide.findMany({
      include: {
        user: {
          select: { name: true, avatar: true },
        },
        pricing: {
          select: { dailyRate: true, halfDayRate: true },
        },
      },
      take: 6,
    }),
  ]);

  return (
    <HomeClient
      divisions={divisions}
      districts={districts}
      spots={spots}
      hotels={hotels}
      restaurants={restaurants}
      guides={guides}
    />
  );
}
