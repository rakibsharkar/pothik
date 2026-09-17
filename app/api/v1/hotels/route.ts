import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        spot: true,
        rooms: true,
      },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ success: true, hotels });
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
      spotId,
      address,
      contactNumber,
      amenities,
      rating,
      featuredImage,
      galleryImages,
      lat,
      lng,
      status,
      isVerified,
    } = body;

    if (!name || !spotId) {
      return NextResponse.json(
        { error: 'হোটেলের নাম এবং ট্যুরিস্ট স্পট নির্বাচন বাধ্যতামূলক।' },
        { status: 400 }
      );
    }

    // Generate or ensure slug
    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') ||
      'hotel-' + Date.now();

    // Check duplicate slug
    const existing = await prisma.hotel.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json(
        { error: 'এই স্লাগ (Slug) ইতিমধ্যে ব্যবহৃত হয়েছে। দয়া করে ভিন্ন নাম দিন।' },
        { status: 409 }
      );
    }

    // Get admin user for ownership
    const admin = await prisma.user.findFirst({
      where: { role: 'admin' },
    });

    const hotel = await prisma.hotel.create({
      data: {
        userId: admin?.id || 1,
        spotId: Number(spotId),
        name,
        slug: finalSlug,
        address: address || null,
        contactNumber: contactNumber || null,
        amenities: typeof amenities === 'string' ? amenities : JSON.stringify(amenities || []),
        rating: rating ? parseFloat(rating) : 4.5,
        featuredImage:
          featuredImage ||
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
        galleryImages: typeof galleryImages === 'string' ? galleryImages : JSON.stringify(galleryImages || []),
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        status: status || 'active',
        isVerified: Boolean(isVerified),
      },
      include: {
        spot: true,
      },
    });

    return NextResponse.json({ success: true, hotel }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
