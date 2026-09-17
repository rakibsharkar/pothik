import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Next.js SQLite Database...');

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tourbd.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@tourbd.com',
      phone: '01700000000',
      role: 'admin',
      password: '$2y$12$K1H1bA2uDfZ5jW5E8GqGSeF9m4O7XhH8n4A5u4s6m1W3b9u8p7A1e', // 'password'
    },
  });
  console.log('✅ Admin User created:', admin.email);

  // 2. Divisions & Districts
  const divisionsData = [
    {
      name: 'Barishal',
      slug: 'barishal',
      districts: ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
    },
    {
      name: 'Chattogram',
      slug: 'chattogram',
      districts: ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Cumilla', "Cox's Bazar", 'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
    },
    {
      name: 'Dhaka',
      slug: 'dhaka',
      districts: ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
    },
    {
      name: 'Khulna',
      slug: 'khulna',
      districts: ['Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
    },
    {
      name: 'Mymensingh',
      slug: 'mymensingh',
      districts: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur'],
    },
    {
      name: 'Rajshahi',
      slug: 'rajshahi',
      districts: ['Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Pabna', 'Rajshahi', 'Sirajganj', 'Chapainawabganj'],
    },
    {
      name: 'Rangpur',
      slug: 'rangpur',
      districts: ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'],
    },
    {
      name: 'Sylhet',
      slug: 'sylhet',
      districts: ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
    },
  ];

  const districtMap: Record<string, number> = {};
  const divisionMap: Record<string, number> = {};

  for (const div of divisionsData) {
    const createdDiv = await prisma.division.upsert({
      where: { name: div.name },
      update: {},
      create: { name: div.name, slug: div.slug },
    });
    divisionMap[div.name] = createdDiv.id;

    for (const distName of div.districts) {
      const slug = distName.toLowerCase().replace(/['\s]+/g, '-');
      const dist = await prisma.district.upsert({
        where: { slug },
        update: {},
        create: {
          name: distName,
          slug,
          divisionId: createdDiv.id,
        },
      });
      districtMap[distName] = dist.id;
    }
  }
  console.log('✅ Divisions and Districts seeded successfully.');

  // 3. Featured Spots
  const spotsData = [
    {
      name: 'সাজেক ভ্যালি (Sajek Valley)',
      slug: 'sajek-valley',
      district: 'Rangamati',
      division: 'Chattogram',
      description: 'মেঘের রাজ্য সাজেক ভ্যালি বাংলাদেশের সবচেয়ে আকর্ষণীয় পাহাড়ি পর্যটন কেন্দ্র। রাঙ্গামাটি জেলার বাঘাইছড়ি উপজেলায় অবস্থিত এই উপত্যকা সমুদ্রপৃষ্ঠ থেকে প্রায় ১৮০০ ফুট উঁচুতে অবস্থিত।',
      thumbnail: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1200&auto=format&fit=crop',
      bestTimeToVisit: 'অক্টোবর থেকে মার্চ',
      entryFeeLocal: 50.0,
      difficultyLevel: 'easy',
      isFeatured: true,
      featureTags: JSON.stringify(['hills', 'nature', 'clouds', 'photography']),
      locationLat: 23.3820,
      locationLng: 92.2938,
      tripDuration: '২ দিন ৩ রাত',
    },
    {
      name: 'কক্সবাজার সমুদ্র সৈকত (Cox\'s Bazar Beach)',
      slug: 'coxs-bazar-beach',
      district: "Cox's Bazar",
      division: 'Chattogram',
      description: 'বিশ্বের দীর্ঘতম ১২০ কিমি প্রাকৃতিক বালুকাময় সমুদ্র সৈকত। সূর্যাস্ত ও সূর্যোদয়ের অপূর্ব দৃশ্য এবং নানা ধরনের সামুদ্রিক খাবারের জন্য এটি বিশ্বখ্যাত।',
      thumbnail: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop',
      bestTimeToVisit: 'নভেম্বর থেকে ফেব্রুয়ারি',
      entryFeeLocal: 0.0,
      difficultyLevel: 'easy',
      isFeatured: true,
      featureTags: JSON.stringify(['sea', 'beach', 'sunset', 'seafood']),
      locationLat: 21.4272,
      locationLng: 91.9702,
      tripDuration: '৩ দিন ২ রাত',
    },
    {
      name: 'সুন্দরবন ম্যানগ্রোভ ফরেস্ট (Sundarbans)',
      slug: 'sundarbans-mangrove-forest',
      district: 'Bagerhat',
      division: 'Khulna',
      description: 'ইউনেস্কো বিশ্ব ঐতিহ্যবাহী স্থান এবং পৃথিবীর বৃহত্তম শ্বাসমূলীয় ম্যানগ্রোভ বন। রয়েল বেঙ্গল টাইগার এবং চিত্রা হরিণের অন্যতম প্রধান আবাসভূমি।',
      thumbnail: 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?q=80&w=1200&auto=format&fit=crop',
      bestTimeToVisit: 'ডিসেম্বর থেকে ফেব্রুয়ারি',
      entryFeeLocal: 150.0,
      difficultyLevel: 'moderate',
      isFeatured: true,
      featureTags: JSON.stringify(['forest', 'wildlife', 'river', 'unesco']),
      locationLat: 21.9497,
      locationLng: 89.1833,
      tripDuration: '৩ দিন ৪ রাত',
    },
    {
      name: 'শ্রীমঙ্গল চা বাগান (Sreemangal Tea Gardens)',
      slug: 'sreemangal-tea-gardens',
      district: 'Moulvibazar',
      division: 'Sylhet',
      description: 'বাংলাদেশের চায়ের রাজধানী নামে পরিচিত শ্রীমঙ্গল। চারদিকে সবুজ চায়ের বাগান, লাউয়াছড়া জাতীয় উদ্যান এবং বৈচিত্র্যময় বন্যপ্রাণীর সমাহার।',
      thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
      bestTimeToVisit: 'সেপ্টেম্বর থেকে মার্চ',
      entryFeeLocal: 30.0,
      difficultyLevel: 'easy',
      isFeatured: true,
      featureTags: JSON.stringify(['tea-garden', 'nature', 'rainforest', 'greenery']),
      locationLat: 24.3065,
      locationLng: 91.7296,
      tripDuration: '২ দিন ১ রাত',
    },
    {
      name: 'সেন্টমার্টিন দ্বীপ (Saint Martin\'s Island)',
      slug: 'saint-martins-island',
      district: "Cox's Bazar",
      division: 'Chattogram',
      description: 'বাংলাদেশের একমাত্র প্রবাল দ্বীপ সেন্টমার্টিন। নীল জলরাশি, নারিকেল গাছের সারি এবং প্রবাল পাথরের প্রাকৃতিক সৌন্দর্য একে স্বর্গীয় রূপ দান করেছে।',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      bestTimeToVisit: 'নভেম্বর থেকে ফেব্রুয়ারি',
      entryFeeLocal: 0.0,
      difficultyLevel: 'easy',
      isFeatured: true,
      featureTags: JSON.stringify(['island', 'coral', 'sea', 'blue-water']),
      locationLat: 20.6276,
      locationLng: 92.3225,
      tripDuration: '২ দিন ১ রাত',
    },
    {
      name: 'রাতারগুল সোয়াম্প ফরেস্ট (Ratargul Swamp Forest)',
      slug: 'ratargul-swamp-forest',
      district: 'Sylhet',
      division: 'Sylhet',
      description: 'বাংলাদেশের একমাত্র মিঠাপানির জলাবন। বর্ষাকালে গাছের ডালে ভেসে থাকা এই বনের ভেতরে নৌকা ভ্রমণ এক অনন্য রোমাঞ্চকর অভিজ্ঞতা।',
      thumbnail: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200&auto=format&fit=crop',
      bestTimeToVisit: 'জুলাই থেকে অক্টোবর',
      entryFeeLocal: 50.0,
      difficultyLevel: 'easy',
      isFeatured: true,
      featureTags: JSON.stringify(['swamp-forest', 'boat-ride', 'nature', 'monsoon']),
      locationLat: 25.0042,
      locationLng: 91.9298,
      tripDuration: '১ দিন',
    },
  ];

  for (const s of spotsData) {
    const distId = districtMap[s.district] || 1;
    const divId = divisionMap[s.division] || 1;

    const spot = await prisma.spot.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        name: s.name,
        slug: s.slug,
        districtId: distId,
        divisionId: divId,
        description: s.description,
        thumbnail: s.thumbnail,
        bestTimeToVisit: s.bestTimeToVisit,
        entryFeeLocal: s.entryFeeLocal,
        difficultyLevel: s.difficultyLevel,
        isFeatured: s.isFeatured,
        featureTags: s.featureTags,
        locationLat: s.locationLat,
        locationLng: s.locationLng,
        tripDuration: s.tripDuration,
      },
    });

    // 4. Create Hotel & Room for this spot
    const hotelSlug = `${s.slug}-resort`;
    const hotel = await prisma.hotel.upsert({
      where: { slug: hotelSlug },
      update: {},
      create: {
        spotId: spot.id,
        userId: admin.id,
        name: `${s.name.split(' (')[0]} প্রিমিয়াম রিসোর্ট`,
        slug: hotelSlug,
        address: `${s.district}, বাংলাদেশ`,
        contactNumber: '+880 1812-345678',
        rating: 4.8,
        totalReviews: 124,
        featuredImage: s.thumbnail,
        amenities: JSON.stringify(['Free WiFi', 'AC', 'Breakfast Included', 'Mountain/Sea View']),
      },
    });

    await prisma.room.createMany({
      data: [
        {
          hotelId: hotel.id,
          title: 'Deluxe Couple Room',
          slug: `${hotelSlug}-deluxe-couple`,
          price: 4500.0,
          discountPrice: 3800.0,
          maxGuests: 2,
          bedType: 'King Bed',
          roomSize: '320 sqft',
          amenities: JSON.stringify(['Balcony', 'AC', 'Hot Water', 'Breakfast']),
        },
        {
          hotelId: hotel.id,
          title: 'Family Suite with View',
          slug: `${hotelSlug}-family-suite`,
          price: 7500.0,
          discountPrice: 6500.0,
          maxGuests: 4,
          bedType: '2 Double Beds',
          roomSize: '550 sqft',
          amenities: JSON.stringify(['Balcony View', 'AC', 'Living Area', 'Hot Water']),
        },
      ],
    });
  }
  console.log('✅ Top Spots, Hotels, and Rooms seeded successfully.');

  console.log('🎉 Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
