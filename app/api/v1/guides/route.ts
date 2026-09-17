import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const guides = await prisma.guide.findMany({
      include: {
        user: true,
        pricing: true,
      },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ success: true, guides });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      user_photo,
      dob,
      gender,
      nationality,
      short_bio,
      languages,
      years_of_experience,
      specialization,
      districts,
      daily_rate,
      half_day_rate,
      multi_day_package_rate,
      max_group_size,
      vehicle_included,
      emergency_support_included,
      whatsapp_number,
      emergency_contact_name,
      emergency_contact_phone,
      nid_number,
      nid_front_image,
      nid_back_image,
      permanent_address,
      current_address,
      reference_name,
      reference_phone,
      status,
      kyc_verified,
      police_verified,
      risk_score,
      admin_notes,
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'গাইডের নাম, ইমেইল এবং মোবাইল নম্বর আবশ্যক।' },
        { status: 400 }
      );
    }

    // Check existing email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'এই ইমেইল দিয়ে ইতিমধ্যে একজন ব্যবহারকারী নিবন্ধিত রয়েছে।' },
        { status: 409 }
      );
    }

    // Create User record
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: 'guide',
        avatar:
          user_photo ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        password: 'GuidePassword123!',
        isVerifiedMobile: true,
        kycStatus: kyc_verified ? 'verified' : 'pending',
        nidFrontImage: nid_front_image || null,
        nidBackImage: nid_back_image || null,
        userPhoto: user_photo || null,
        dob: dob || null,
        gender: gender || 'male',
        nationality: nationality || 'Bangladeshi',
        nidNumber: nid_number || null,
      },
    });

    // Create Guide record with pricing
    const guide = await prisma.guide.create({
      data: {
        userId: user.id,
        shortBio: short_bio || null,
        languages: typeof languages === 'string' ? languages : JSON.stringify(languages || ['Bangla']),
        yearsOfExperience: parseInt(years_of_experience, 10) || 1,
        specialization: Array.isArray(specialization) ? specialization.join(', ') : specialization || 'General Guide',
        whatsappNumber: whatsapp_number || phone,
        status: status || 'approved',
        kycVerified: Boolean(kyc_verified),
        pricing: {
          create: {
            dailyRate: daily_rate ? parseFloat(daily_rate) : 1500,
            halfDayRate: half_day_rate ? parseFloat(half_day_rate) : 900,
          },
        },
      },
      include: {
        user: true,
        pricing: true,
      },
    });

    return NextResponse.json({ success: true, guide }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
