import React from 'react';
import prisma from '@/lib/prisma';
import { GuideCreateForm } from './GuideCreateForm';

export const revalidate = 0;

export default async function CreateGuidePage() {
  const districts = await prisma.district.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, divisionId: true },
  });

  return <GuideCreateForm districts={districts} />;
}
