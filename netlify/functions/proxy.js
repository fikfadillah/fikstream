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
];

exports.handler = async (event) => {
    // Hanya izinkan GET request
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
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid or missing action parameter' }),
        };
    }

    const apiBaseUrl = process.env.API_BASE_URL;

    if (!apiBaseUrl) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error' }),
        };
    }

    try {
        // Bangun URL ke API eksternal dengan semua query params yang diterima
        const targetUrl = new URL(apiBaseUrl);
        Object.entries(params).forEach(([key, value]) => {
            targetUrl.searchParams.append(key, value);
        });

        const response = await fetch(targetUrl.toString(), {
            headers: {
                'User-Agent': 'FikStream/1.0',
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
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
        return {
            statusCode: 502,
            body: JSON.stringify({ error: 'Failed to reach upstream API' }),
        };
    }
};
