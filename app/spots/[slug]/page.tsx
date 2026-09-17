import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { SpotViewClient } from './SpotViewClient';

interface SpotDetailsProps {
  params: Promise<{ slug: string }>;
}

export default async function SpotDetailsPage({ params }: SpotDetailsProps) {
  const { slug } = await params;

  const spot = await prisma.spot.findUnique({
    where: { slug },
    include: {
      division: true,
      district: {
        include: {
          division: true,
        },
      },
      upazila: true,
      routes: true,
      hotels: {
        include: {
          rooms: true,
        },
      },
      restaurants: true,
      reviews: {
        include: {
          user: {
            select: { name: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!spot) {
    notFound();
  }

  return <SpotViewClient spot={spot} />;
}
