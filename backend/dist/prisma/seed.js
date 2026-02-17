"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcrypt"));
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is required');
}
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Starting database seed...');
    const hashedPassword = await bcrypt.hash('Password123', 10);
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
    const users = await Promise.all(userEmails.map(({ email, name }) => prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: hashedPassword,
            name,
        },
    })));
    console.log(`Created ${users.length} users`);
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
//# sourceMappingURL=seed.js.map