"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
const API_URL = `http://localhost:${process.env.PORT ?? 3001}`;
async function loginUser(email, password) {
    try {
        const response = await axios_1.default.post(`${API_URL}/auth/login`, {
            email,
            password,
        });
        return response.data.accessToken;
    }
    catch (error) {
        const status = error.response?.status;
        const body = error.response?.data;
        const msg = body?.message || body?.error || error.message;
        console.error(`[Login ${email}] status: ${status}, body:`, JSON.stringify(body));
        throw new Error(`Login failed for ${email}: ${msg}`);
    }
}
async function bookEvent(token, eventId) {
    const response = await axios_1.default.post(`${API_URL}/bookings`, { eventId }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}
async function getEvents(token) {
    const response = await axios_1.default.get(`${API_URL}/events`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}
async function runConcurrencyTest() {
    console.log('=== Concurrency Test ===\n');
    try {
        console.log('📝 Logging in to fetch events...');
        const adminToken = await loginUser('john@example.com', 'Password123');
        const events = await getEvents(adminToken);
        const limitedEvent = events.find((e) => e.remainingTickets === 2);
        if (!limitedEvent) {
            console.error('❌ No event with exactly 2 tickets found!');
            console.log('Available events:', events);
            process.exit(1);
        }
        console.log(`✅ Found event: "${limitedEvent.title}"`);
        console.log(`   Remaining tickets: ${limitedEvent.remainingTickets}`);
        console.log(`   Event ID: ${limitedEvent.id}\n`);
        console.log('🔑 Logging in as 10 different users...');
        const otherUserEmails = [
            'jane@example.com',
            'bob@example.com',
            'alice@example.com',
            'charlie@example.com',
            'diana@example.com',
            'edward@example.com',
            'fiona@example.com',
            'george@example.com',
            'hannah@example.com',
        ];
        const otherTokens = await Promise.all(otherUserEmails.map((email) => loginUser(email, 'Password123')));
        const tokens = [adminToken, ...otherTokens];
        console.log('🚀 Sending 10 simultaneous booking requests...\n');
        const startTime = Date.now();
        const results = await Promise.allSettled(tokens.map((token) => bookEvent(token, limitedEvent.id)));
        const endTime = Date.now();
        const successful = results.filter((r) => r.status === 'fulfilled');
        const failed = results.filter((r) => r.status === 'rejected');
        console.log('📊 Results:');
        console.log(`   Successful bookings: ${successful.length}`);
        console.log(`   Rejected bookings: ${failed.length}`);
        console.log(`   Total time: ${endTime - startTime}ms\n`);
        const updatedEvents = await getEvents(adminToken);
        const updatedEvent = updatedEvents.find((e) => e.id === limitedEvent.id);
        console.log('🎫 Final ticket count:');
        console.log(`   Remaining tickets: ${updatedEvent?.remainingTickets}\n`);
        const expectedSuccessful = 2;
        const expectedFailed = 8;
        const expectedRemainingTickets = 0;
        const testPassed = successful.length === expectedSuccessful &&
            failed.length === expectedFailed &&
            updatedEvent?.remainingTickets === expectedRemainingTickets;
        if (testPassed) {
            console.log('✅ TEST PASSED: No overselling detected!');
            console.log('Exactly 2 bookings succeeded');
            console.log('Exactly 8 bookings were rejected');
            console.log('Remaining tickets is 0');
        }
        else {
            console.log('❌ TEST FAILED: Overselling or unexpected behavior detected!');
            console.log(`   Expected: ${expectedSuccessful} successful, ${expectedFailed} failed`);
            console.log(`   Got: ${successful.length} successful, ${failed.length} failed`);
            console.log(`   Expected remaining tickets: ${expectedRemainingTickets}`);
            console.log(`   Got remaining tickets: ${updatedEvent?.remainingTickets}`);
            process.exit(1);
        }
        if (failed.length > 0) {
            console.log('\n📋 Rejection details (status + message):');
            failed.forEach((result, index) => {
                if (result.status === 'rejected') {
                    const error = result.reason;
                    const status = error.response?.status ?? '?';
                    const message = error.response?.data?.message || error.message || 'Unknown error';
                    console.log(`   ${index + 1}. ${status} — ${message}`);
                }
            });
        }
    }
    catch (error) {
        console.error('❌ Test failed with error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        process.exit(1);
    }
}
runConcurrencyTest();
//# sourceMappingURL=test-concurrency.js.map