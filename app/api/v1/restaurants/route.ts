import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        district: { select: { name: true } },
        division: { select: { name: true } },
      },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ success: true, restaurants });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      shortDescription,
      fullDescription,
      category,
      address,
      priceRange,
      openingTime,
      closingTime,
      is24Hours,
      mobile,
      featuredImage,
      galleryImages,
      signatureDishes,
      googleMapLink,
      lat,
      lng,
      districtId,
      divisionId,
      upazilaId,
      spotId,
      status,
    } = body;

    if (!name || !districtId || !divisionId) {
      return NextResponse.json(
        { error: 'রেস্টুরেন্টের নাম, বিভাগ এবং জেলা নির্বাচন আবশ্যক।' },
        { status: 400 }
      );
    }

    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') ||
      'rest-' + Date.now();

    // Check duplicate slug
    const existing = await prisma.restaurant.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json({ error: 'এই স্লাগ (Slug) ইতিমধ্যে ব্যবহৃত হয়েছে।' }, { status: 409 });
    }

    // Get admin user for ownership
    const admin = await prisma.user.findFirst({
      where: { role: 'admin' },
    });

    const restaurant = await prisma.restaurant.create({
      data: {
        userId: admin?.id || 1,
        name,
        slug: finalSlug,
        shortDescription: shortDescription || null,
        fullDescription: fullDescription || null,
        category: category || 'Dining',
        address: address || null,
        priceRange: priceRange || '$$',
        openingTime: openingTime || '09:00 AM',
        closingTime: closingTime || '10:00 PM',
        is24Hours: Boolean(is24Hours),
        mobile: mobile || null,
        featuredImage:
          featuredImage ||
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
        galleryImages: typeof galleryImages === 'string' ? galleryImages : JSON.stringify(galleryImages || []),
        signatureDishes: typeof signatureDishes === 'string' ? signatureDishes : JSON.stringify(signatureDishes || []),
        googleMapLink: googleMapLink || null,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        districtId: Number(districtId),
        divisionId: Number(divisionId),
        upazilaId: upazilaId ? Number(upazilaId) : null,
        spotId: spotId ? Number(spotId) : null,
        status: status || 'approved',
      },
    });

    return NextResponse.json({ success: true, restaurant }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

