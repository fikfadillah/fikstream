import { api } from '../services/api';

/**
 * Daftar kategori terpusat.
 * Digunakan di Category.jsx dan Home.jsx.
 *
 * @typedef {{ id: string, name: string, api: Function, link: string }} Category
 * @type {Category[]}
 */
export const CATEGORIES = [
    { id: 'trending', name: 'Trending', api: api.getTrending, link: '/category/trending' },
    { id: 'indonesian-movies', name: 'Film Indonesia', api: api.getIndonesianMovies, link: '/category/indonesian-movies' },
    { id: 'indonesian-drama', name: 'Drama Indonesia', api: api.getIndonesianDrama, link: '/category/indonesian-drama' },
    { id: 'kdrama', name: 'K-Drama', api: api.getKDrama, link: '/category/kdrama' },
    { id: 'c-drama', name: 'C-Drama', api: api.getCDrama, link: '/category/c-drama' },
    { id: 'short-tv', name: 'Short TV', api: api.getShortTV, link: '/category/short-tv' },
    { id: 'anime', name: 'Anime', api: api.getAnime, link: '/category/anime' },
    { id: 'adult-comedy', name: 'Komedi Dewasa', api: api.getAdultComedy, link: '/category/adult-comedy' },
    { id: 'western-tv', name: 'Western TV', api: api.getWesternTV, link: '/category/western-tv' },
    { id: 'indo-dub', name: 'Indo Dub', api: api.getIndoDub, link: '/category/indo-dub' },
];

/**
 * Kategori yang ditampilkan di Home page (section rows).
 * Subset dari CATEGORIES, tidak termasuk trending (sudah di hero banner).
 */
export const HOME_SECTIONS = CATEGORIES.filter((cat) =>
    ['kdrama', 'c-drama', 'short-tv', 'anime', 'western-tv', 'indo-dub'].includes(cat.id)
);

/**
 * Cari kategori berdasarkan ID.
 * @param {string} id
 * @returns {Category | undefined}
 */
export const getCategoryById = (id) => CATEGORIES.find((cat) => cat.id === id);
