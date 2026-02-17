import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed...');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('Password123', 10);

  // Create 10 users for testing
  const userEmails = [
    { email: 'john@example.com', name: 'John Doe' },
    { email: 'jane@example.com', name: 'Jane Smith' },
    { email: 'bob@example.com', name: 'Bob Johnson' },
    { email: 'alice@example.com', name: 'Alice Williams' },
    { email: 'charlie@example.com', name: 'Charlie Brown' },
    { email: 'diana@example.com', name: 'Diana Prince' },
    { email: 'edward@example.com', name: 'Edward Norton' },
    { email: 'fiona@example.com', name: 'Fiona Green' },
    { email: 'george@example.com', name: 'George Miller' },
    { email: 'hannah@example.com', name: 'Hannah Baker' },
  ];

  const users = await Promise.all(
    userEmails.map(({ email, name }) =>
      prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          password: hashedPassword,
          name,
        },
      })
    )
  );

  console.log(`Created ${users.length} users`);

  // Create events
  const events = await Promise.all([
    prisma.event.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440001' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Tech Conference 2025',
        description: 'Annual technology conference featuring the latest innovations in software development, AI, and cloud computing.',
        date: new Date('2025-03-15T10:00:00Z'),
        venue: 'Convention Center',
        totalTickets: 100,
        remainingTickets: 100,
        price: 49.99,
      },
    }),
    prisma.event.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440002' },
      update: { remainingTickets: 2 },
      create: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Limited Concert',
        description: 'Exclusive acoustic concert with limited seating. Perfect for testing race conditions!',
        date: new Date('2025-04-20T19:00:00Z'),
        venue: 'Intimate Theater',
        totalTickets: 2,
        remainingTickets: 2,
        price: 150.00,
      },
    }),
    prisma.event.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440003' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        title: 'Startup Pitch Night',
        description: 'Watch innovative startups pitch their ideas to top investors.',
        date: new Date('2025-05-10T18:00:00Z'),
        venue: 'Innovation Hub',
        totalTickets: 50,
        remainingTickets: 50,
        price: 25.00,
      },
    }),
    prisma.event.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440004' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440004',
        title: 'Music Festival 2025',
        description: 'Three-day music festival featuring top artists from around the world.',
        date: new Date('2025-06-15T12:00:00Z'),
        venue: 'City Park',
        totalTickets: 500,
        remainingTickets: 500,
        price: 199.99,
      },
    }),
    prisma.event.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440005' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440005',
        title: 'Cooking Masterclass',
        description: 'Learn from Michelin-star chefs in this hands-on cooking workshop.',
        date: new Date('2025-07-05T14:00:00Z'),
        venue: 'Culinary Institute',
        totalTickets: 20,
        remainingTickets: 20,
        price: 89.99,
      },
    }),
  ]);

  console.log(`Created ${events.length} events`);

  // Limited Concert uchun bookinglarni bekor qilamiz — concurrency test har seed dan keyin ishlashi uchun
  const limitedEventId = '550e8400-e29b-41d4-a716-446655440002';
  await prisma.booking.updateMany({
    where: { eventId: limitedEventId, status: 'CONFIRMED' },
    data: { status: 'CANCELLED' },
  });

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📝 Test credentials:');
  console.log('   Email: john@example.com');
  console.log('   Password: Password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();

    await pool.end();
  });
