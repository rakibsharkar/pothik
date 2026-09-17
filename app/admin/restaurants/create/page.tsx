import React from 'react';
import prisma from '@/lib/prisma';
import { RestaurantCreateForm } from './RestaurantCreateForm';

export const revalidate = 0;

export default async function CreateRestaurantPage() {
  const [divisions, districts, upazilas, spots] = await Promise.all([
    prisma.division.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
    prisma.district.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, divisionId: true },
    }),
    prisma.upazila.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, districtId: true },
    }),
    prisma.spot.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, districtId: true, upazilaId: true },
    }),
  ]);

  return (
    <RestaurantCreateForm
      divisions={divisions}
      districts={districts}
      upazilas={upazilas}
      spots={spots}
    />
  );
}
