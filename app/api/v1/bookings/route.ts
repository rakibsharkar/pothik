import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomId, checkIn, checkOut, guestName, guestPhone, totalPrice, paymentMethod } = body;

    if (!roomId || !checkIn || !checkOut || !guestName || !guestPhone) {
      return NextResponse.json(
        { error: 'সব প্রয়োজনীয় তথ্য পূরণ করুন (Room, Dates, Name, Phone are required)' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: 'চেক-আউট তারিখ অবশ্যই চেক-ইন তারিখের পরে হতে হবে।' },
        { status: 400 }
      );
    }

    // Verify room exists
    const room = await prisma.room.findUnique({
      where: { id: Number(roomId) },
      include: { hotel: true },
    });

    if (!room) {
      return NextResponse.json({ error: 'নির্বাচিত রুমটি পাওয়া যায়নি।' }, { status: 404 });
    }

    // Get or create a guest user
    let user = await prisma.user.findFirst({
      where: { phone: guestPhone },
    });

    if (!user) {
      // Create guest user
      user = await prisma.user.create({
        data: {
          name: guestName,
          email: `${guestPhone.replace(/[^0-9]/g, '')}@tourbd.guest`,
          phone: guestPhone,
          password: 'guest_unauthenticated',
          role: 'user',
        },
      });
    }

    // Check for overlapping confirmed bookings
    const overlapping = await prisma.booking.findFirst({
      where: {
        roomId: room.id,
        status: { in: ['confirmed', 'pending'] },
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    if (overlapping) {
      return NextResponse.json(
        { error: 'দুঃখিত, এই তারিখে রুমটি ইতিমধ্যে বুকিং করা হয়েছে। অন্য তারিখ নির্বাচন করুন।' },
        { status: 409 }
      );
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        roomId: room.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice: Number(totalPrice) || room.price,
        paymentMethod: paymentMethod || 'bkash',
        paymentStatus: 'pending',
        status: 'pending',
      },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'বুকিং সফল হয়েছে!',
      booking,
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: error.message || 'বুকিং প্রক্রিয়াকরণে সমস্যা হয়েছে।' },
      { status: 500 }
    );
  }
}
