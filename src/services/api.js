/**
 * API Service — FikStream ✍️
 *
 * Semua request diarahkan ke Netlify Function (/api/proxy)
 * yang bertindak sebagai proxy ke API eksternal.
 * URL API asli TIDAK pernah terekspos ke browser.
 */

const BASE_URL = '/api/proxy';

/**
 * Fungsi dasar untuk fetch ke proxy endpoint.
 * @param {Record<string, string|number>} params - Query parameters
 * @returns {Promise<any>} Response JSON dari API
 */
const fetchFromApi = async (params) => {
  const url = new URL(BASE_URL, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

export const api = {
  getTrending: (page = 1) => fetchFromApi({ action: 'trending', page }),
  getIndonesianMovies: (page = 1) => fetchFromApi({ action: 'indonesian-movies', page }),
  getIndonesianDrama: (page = 1) => fetchFromApi({ action: 'indonesian-drama', page }),
  getKDrama: (page = 1) => fetchFromApi({ action: 'kdrama', page }),
  getShortTV: (page = 1) => fetchFromApi({ action: 'short-tv', page }),
  getAnime: (page = 1) => fetchFromApi({ action: 'anime', page }),
  getAdultComedy: (page = 1) => fetchFromApi({ action: 'adult-comedy', page }),
  getWesternTV: (page = 1) => fetchFromApi({ action: 'western-tv', page }),
  getIndoDub: (page = 1) => fetchFromApi({ action: 'indo-dub', page }),
  /** C-Drama menggunakan search fallback karena tidak ada endpoint khusus */
  getCDrama: (page = 1) => fetchFromApi({ action: 'search', q: 'chinese', page }),
  search: (keyword, page = 1) => fetchFromApi({ action: 'search', q: keyword, page }),
  getDetail: (detailPath) => fetchFromApi({ action: 'detail', detailPath }),
  getStreamUrl: (id) => `${BASE_URL}?action=stream&id=${id}`,
};
