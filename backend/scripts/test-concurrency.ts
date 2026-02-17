import 'dotenv/config';
import axios from 'axios';

const API_URL = `http://localhost:${process.env.PORT ?? 3001}`;

interface LoginResponse {
    user: {
        id: string;
        email: string;
        name: string;
    };
    accessToken: string;
    refreshToken: string;
}

interface BookingResponse {
    booking: {
        id: string;
        eventId: string;
        userId: string;
        status: string;
    };
    event: {
        id: string;
        title: string;
        remainingTickets: number;
    };
}

async function loginUser(email: string, password: string): Promise<string> {
    try {
        const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
            email,
            password,
        });
        return response.data.accessToken;
    } catch (error: any) {
        const status = error.response?.status;
        const body = error.response?.data;
        const msg = body?.message || body?.error || error.message;
        console.error(`[Login ${email}] status: ${status}, body:`, JSON.stringify(body));
        throw new Error(`Login failed for ${email}: ${msg}`);
    }
}

async function bookEvent(
    token: string,
    eventId: string,
): Promise<BookingResponse> {
    const response = await axios.post<BookingResponse>(
        `${API_URL}/bookings`,
        { eventId },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response.data;
}

async function getEvents(token: string): Promise<any[]> {
    const response = await axios.get(`${API_URL}/events`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}

async function runConcurrencyTest() {
    console.log('=== Concurrency Test ===\n');

    try {
        // Step 1: Login as the first user to get events
        console.log('📝 Logging in to fetch events...');
        const adminToken = await loginUser('john@example.com', 'Password123');

        // Step 2: Find the event with 2 tickets (Limited Concert)
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

        // Step 3: 10 ta user uchun tokenlar — john allaqachon login, qolgan 9 tasini login qilamiz
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
        const otherTokens = await Promise.all(
            otherUserEmails.map((email) => loginUser(email, 'Password123')),
        );
        const tokens = [adminToken, ...otherTokens];

        // Step 4: Fire 10 simultaneous booking requests
        console.log('🚀 Sending 10 simultaneous booking requests...\n');

        const startTime = Date.now();
        const results = await Promise.allSettled(
            tokens.map((token) => bookEvent(token, limitedEvent.id)),
        );
        const endTime = Date.now();

        // Step 5: Analyze results
        const successful = results.filter((r) => r.status === 'fulfilled');
        const failed = results.filter((r) => r.status === 'rejected');

        console.log('📊 Results:');
        console.log(`   Successful bookings: ${successful.length}`);
        console.log(`   Rejected bookings: ${failed.length}`);
        console.log(`   Total time: ${endTime - startTime}ms\n`);

        // Step 6: Check final ticket count
        const updatedEvents = await getEvents(adminToken);
        const updatedEvent = updatedEvents.find((e) => e.id === limitedEvent.id);

        console.log('🎫 Final ticket count:');
        console.log(`   Remaining tickets: ${updatedEvent?.remainingTickets}\n`);

        // Step 7: Verify test results
        const expectedSuccessful = 2;
        const expectedFailed = 8;
        const expectedRemainingTickets = 0;

        const testPassed =
            successful.length === expectedSuccessful &&
            failed.length === expectedFailed &&
            updatedEvent?.remainingTickets === expectedRemainingTickets;

        if (testPassed) {
            console.log('✅ TEST PASSED: No overselling detected!');
            console.log('Exactly 2 bookings succeeded');
            console.log('Exactly 8 bookings were rejected');
            console.log('Remaining tickets is 0');
        } else {
            console.log('❌ TEST FAILED: Overselling or unexpected behavior detected!');
            console.log(`   Expected: ${expectedSuccessful} successful, ${expectedFailed} failed`);
            console.log(`   Got: ${successful.length} successful, ${failed.length} failed`);
            console.log(`   Expected remaining tickets: ${expectedRemainingTickets}`);
            console.log(`   Got remaining tickets: ${updatedEvent?.remainingTickets}`);
            process.exit(1);
        }

        // Show error messages and status codes from failed requests
        if (failed.length > 0) {
            console.log('\n📋 Rejection details (status + message):');
            failed.forEach((result, index) => {
                if (result.status === 'rejected') {
                    const error = result.reason as any;
                    const status = error.response?.status ?? '?';
                    const message =
                        error.response?.data?.message || error.message || 'Unknown error';
                    console.log(`   ${index + 1}. ${status} — ${message}`);
                }
            });
        }
    } catch (error: any) {
        console.error('❌ Test failed with error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        process.exit(1);
    }
}

// Run the test
runConcurrencyTest();
