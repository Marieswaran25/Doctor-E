// src/lib/createHeygenToken.ts
import axios from 'axios';

export async function createHeygenToken(): Promise<string> {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_HEYGEN_URL}/v1/streaming.create_token`,
            null, // No body required
            {
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_HEYGEN_API_KEY || '',
                    'Cache-Control': 'no-store',
                },
            },
        );

        const token = response.data?.data?.token;
        if (!token) {
            throw new Error('Invalid token response from HeyGen');
        }

        return token;
    } catch (err) {
        console.error('Error creating HeyGen token:', err);
        throw err;
    }
}
