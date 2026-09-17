import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const divisionId = searchParams.get('divisionId');
    const districtId = searchParams.get('districtId');
    const search = searchParams.get('search');

    const whereClause: any = {};

    if (divisionId) {
      whereClause.divisionId = Number(divisionId);
    }
    if (districtId) {
      whereClause.districtId = Number(districtId);
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const spots = await prisma.spot.findMany({
      where: whereClause,
      include: {
        district: {
          select: { name: true, divisionId: true },
        },
      },
      orderBy: { isFeatured: 'desc' },
    });

    return NextResponse.json({ success: true, spots });
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
      districtId,
      divisionId,
      upazilaId,
      description,
      thumbnail,
      images,
      locationLat,
      locationLng,
      googleMapLink,
      nearbyLandmark,
      bestTimeToVisit,
      bestTimeDetails,
      entryFeeLocal,
      entryFeeForeign,
      difficultyLevel,
      featureTags,
      activityTags,
      facilities,
      safetyInfo,
      tripDuration,
      itinerary,
      travelTips,
      metaTitle,
      metaDescription,
      metaKeywords,
      isFeatured,
      routes,
    } = body;

    if (!name || !slug || !districtId) {
      return NextResponse.json(
        { error: 'নাম, স্লাগ এবং জেলা নির্বাচন বাধ্যতামূলক (Name, Slug, District are required)' },
        { status: 400 }
      );
    }

    // Check duplicate slug
    const existing = await prisma.spot.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'এই স্লাগ (Slug) ইতিমধ্যে ব্যবহৃত হয়েছে।' }, { status: 409 });
    }

    const spot = await prisma.spot.create({
      data: {
        name,
        slug,
        districtId: Number(districtId),
        divisionId: divisionId ? Number(divisionId) : undefined,
        upazilaId: upazilaId ? Number(upazilaId) : undefined,
        description,
        thumbnail,
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        locationLat: locationLat ? parseFloat(locationLat) : null,
        locationLng: locationLng ? parseFloat(locationLng) : null,
        googleMapLink: googleMapLink || null,
        nearbyLandmark: nearbyLandmark || null,
        bestTimeToVisit: bestTimeToVisit || null,
        bestTimeDetails: typeof bestTimeDetails === 'string' ? bestTimeDetails : JSON.stringify(bestTimeDetails || []),
        entryFeeLocal: entryFeeLocal ? parseFloat(entryFeeLocal) : 0,
        entryFeeForeign: entryFeeForeign ? parseFloat(entryFeeForeign) : 0,
        difficultyLevel: difficultyLevel || 'easy',
        featureTags: typeof featureTags === 'string' ? featureTags : JSON.stringify(featureTags || []),
        activityTags: typeof activityTags === 'string' ? activityTags : JSON.stringify(activityTags || []),
        facilities: typeof facilities === 'string' ? facilities : JSON.stringify(facilities || []),
        safetyInfo: typeof safetyInfo === 'string' ? safetyInfo : JSON.stringify(safetyInfo || []),
        tripDuration: tripDuration || null,
        itinerary: typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary || []),
        travelTips: typeof travelTips === 'string' ? travelTips : JSON.stringify(travelTips || []),
        metaTitle: metaTitle || name,
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null,
        isFeatured: Boolean(isFeatured),
        routes:
          Array.isArray(routes) && routes.length > 0
            ? {
                create: routes
                  .filter((r: any) => r.transport_mode || r.transportMode || r.route_details || r.routeDetails)
                  .map((r: any) => ({
                    transportMode: r.transport_mode || r.transportMode || 'bus',
                    estimatedCost: r.estimated_cost
                      ? parseFloat(r.estimated_cost)
                      : r.estimatedCost
                      ? parseFloat(r.estimatedCost)
                      : null,
                    duration: r.duration || null,
                    routeDetails: r.route_details || r.routeDetails || null,
                  })),
              }
            : undefined,
      },
      include: {
        district: true,
        division: true,
        upazila: true,
        routes: true,
      },
    });

    return NextResponse.json({ success: true, spot }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
