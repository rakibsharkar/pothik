import React from 'react';
import prisma from '@/lib/prisma';
import { SpotCreateForm } from './SpotCreateForm';

export const revalidate = 0;

export default async function CreateSpotPage() {
  const [divisions, districts, upazilas] = await Promise.all([
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
  ]);

  return <SpotCreateForm divisions={divisions} districts={districts} upazilas={upazilas} />;
}

