/**
 * Netlify Function: proxy.js
 *
 * Bertindak sebagai proxy antara frontend dan API eksternal.
 * URL API asli disimpan di environment variable (API_BASE_URL)
 * dan TIDAK pernah dikirim ke browser.
 *
 * Endpoint: GET /api/proxy?action=...&page=...
 */

const ALLOWED_ACTIONS = [
    'trending',
    'indonesian-movies',
    'indonesian-drama',
    'kdrama',
    'short-tv',
    'anime',
    'adult-comedy',
    'western-tv',
    'indo-dub',
    'search',
    'detail',
    'stream',
];

const ALLOWED_DOMAINS = [
    'fikstream.netlify.app',
    'localhost',
    '127.0.0.1'
];

export const handler = async (event) => {
    // 1. Cek Origin/Referer untuk keamanan ekstra
    const origin = event.headers.origin || event.headers.referer;
    // Jika tidak ada origin/referer (misal direct curl/browser access), atau domain tidak diizinkan -> Block
    const isAllowed = origin && ALLOWED_DOMAINS.some(domain => origin.includes(domain));

    if (!isAllowed) {
        // Uncomment baris bawah jika ingin strict mode (saat ini warning dulu agar tidak break dev)
        // console.warn(`Blocked access from unauthorized origin: ${origin}`);
        return {
            statusCode: 403,
            body: JSON.stringify({ error: 'Access Denied: Unauthorized Origin' }),
        };
    }

    // 2. Hanya izinkan GET request
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    const params = event.queryStringParameters || {};
    const { action } = params;

    // Validasi: action wajib ada dan harus dari daftar yang diizinkan
    if (!action || !ALLOWED_ACTIONS.includes(action)) {
        console.error(`Invalid action: ${action}`);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid or missing action parameter' }),
        };
    }

    const apiBaseUrl = process.env.API_BASE_URL;

    if (!apiBaseUrl) {
        console.error('CRITICAL: API_BASE_URL environment variable is not set!');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error: API_BASE_URL missing' }),
        };
    }

    try {
        // Bangun URL ke API eksternal dengan semua query params yang diterima
        let targetUrl;
        if (action === 'stream') {
            // Asumsi: stream.php ada di root yang sama dengan API_BASE_URL, atau parent directory
            // Jika API_BASE_URL = 'https://api.megawe.net/index.php', maka stream.php = 'https://api.megawe.net/stream.php'
            // Kita pakai URL constructor dengan base dari API_BASE_URL
            targetUrl = new URL('stream.php', apiBaseUrl);
        } else {
            targetUrl = new URL(apiBaseUrl);
        }

        Object.entries(params).forEach(([key, value]) => {
            targetUrl.searchParams.append(key, value);
        });

        // console.log(`Proxying request to: ${targetUrl.toString()}`); // Uncomment for debugging URL

        const response = await fetch(targetUrl.toString(), {
            headers: {
                'User-Agent': 'FikStream/1.0',
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Upstream API failed with status: ${response.status}`);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Upstream API error: ${response.status}` }),
            };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Proxy internal error:', error);
        return {
            statusCode: 502,
            body: JSON.stringify({ error: 'Failed to reach upstream API', details: error.message }),
        };
    }
};
