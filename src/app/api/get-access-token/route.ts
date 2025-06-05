// app/api/get-access-token/route.ts
import { HEYGEN_API_KEY, HEYGEN_URL } from '@/config';

export async function POST(request: Request) {
    // Ensure we never cache this response
    const headers = new Headers({
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'text/plain',
    });

    try {
        if (!HEYGEN_API_KEY) {
            throw new Error('HeyGen API key is missing from .env');
        }

        // Call HeyGen’s “create_token” endpoint
        const heygenRes = await fetch(`${HEYGEN_URL}/v1/streaming.create_token`, {
            method: 'POST',
            headers: {
                'x-api-key': HEYGEN_API_KEY,
            },
            // This prevents any upstream caching
            cache: 'no-store',
        });

        if (!heygenRes.ok) {
            // If HeyGen returns a non-200, bubble that up for debugging
            const errText = await heygenRes.text();
            console.error('HeyGen /streaming.create_token failed:', errText);
            return new Response('HeyGen token request failed', {
                status: 502,
                headers,
            });
        }

        const json = await heygenRes.json();
        // HeyGen’s response shape is { data: { token: '...' }, ... }
        const token = json?.data?.token;
        if (typeof token !== 'string') {
            console.error('Unexpected HeyGen response format:', json);
            return new Response('Invalid token format from HeyGen', {
                status: 500,
                headers,
            });
        }

        // Return just the token string in the body
        return new Response(token, {
            status: 200,
            headers,
        });
    } catch (err: any) {
        console.error('Error retrieving HeyGen access token:', err);
        return new Response('Failed to retrieve access token', {
            status: 500,
            headers,
        });
    }
}
