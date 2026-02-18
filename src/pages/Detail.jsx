import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import VideoPlayer from '../components/player/VideoPlayer';
import MovieCard from '../components/common/MovieCard';
import { SkeletonCard } from '../components/common/Skeleton';
import { Star, Calendar, Film, Globe, Play } from 'lucide-react';
import { api } from '../services/api';
import './Detail.css';

/**
 * Helper: Ambil ID dari URL stream asli dan ubah jadi URL proxy.
 * format asli: .../stream.php?id=XXXX
 * format proxy: /api/proxy?action=stream&id=XXXX
 */
const convertStreamUrl = (url) => {
    if (!url) return null;
    const match = url.match(/[?&]id=([^&]+)/);
    return match ? api.getStreamUrl(match[1]) : url;
};

/** Ambil daftar episode dari data season/episode API */
const getEpisodes = (detail, activeSeason) => {
    if (detail.seasons?.length > 0) {
        const seasonData = detail.seasons.find((s) => s.season === activeSeason) || detail.seasons[0];
        return seasonData?.episodes || [];
    }
    return detail.episodes || [];
};

const LoadingSpinner = () => (
    <Layout>
        <div className="container detailLoading">
            <div className="spinner" />
        </div>
    </Layout>
);

const Detail = () => {
    const { detailPath } = useParams();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSeason, setActiveSeason] = useState(1);
    const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        if (!detailPath) return;
        window.scrollTo(0, 0);

        const fetchDetail = async () => {
            setLoading(true);
            try {
                const decodedPath = decodeURIComponent(detailPath);
                const res = await api.getDetail(decodedPath);
                const movieData = res.data || res.items?.[0] || res;
                setDetail(movieData);
                setActiveSeason(movieData.seasons?.[0]?.season ?? 1);
                setCurrentVideoUrl(convertStreamUrl(movieData.playerUrl || movieData.iframe || null));
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [detailPath]);

    useEffect(() => {
        api.getTrending(1)
            .then((res) => setRecommendations((res.data || res.items || []).slice(0, 10)))
            .catch(() => { });
    }, []);

    if (loading) return <LoadingSpinner />;
    if (!detail) return <Layout><div className="container">Detail not found.</div></Layout>;

    const hasEpisodes = detail.seasons?.length > 0 || detail.episodes?.length > 0;
    const episodes = getEpisodes(detail, activeSeason);
    const genres = detail.genre ? detail.genre.split(',').map(g => g.trim()) : [];

    return (
        <Layout>
            {/* ── Backdrop Blur Header ── */}
            <div
                className="detailBackdrop"
                style={{ backgroundImage: `url(${detail.poster})` }}
            >
                <div className="detailBackdropOverlay" />
            </div>

            <div className="container detailContainer">

                {/* ── Video Player ── */}
                {currentVideoUrl && (
                    <div className="playerSection">
                        <VideoPlayer key={currentVideoUrl} url={currentVideoUrl} />
                    </div>
                )}

                {/* ── Episode Grid (landscape, di bawah player) ── */}
                {hasEpisodes && (
                    <div className="episodeSection">
                        <div className="episodeSectionHeader">
                            <h2 className="episodeSectionTitle">Episodes</h2>
                            {detail.seasons?.length > 1 && (
                                <select
                                    className="seasonSelect"
                                    value={activeSeason}
                                    onChange={(e) => setActiveSeason(Number(e.target.value))}
                                >
                                    {detail.seasons.map((s) => (
                                        <option key={s.season} value={s.season}>Season {s.season}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="episodeGrid">
                            {episodes.map((ep, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentVideoUrl(convertStreamUrl(ep.playerUrl))}
                                    className={`episodeCard ${currentVideoUrl === convertStreamUrl(ep.playerUrl) ? 'active' : ''}`}
                                >
                                    <div className="episodeCardPlay">
                                        <Play size={16} fill="currentColor" />
                                    </div>
                                    <div className="episodeCardInfo">
                                        <span className="episodeNum">Episode {ep.episode || idx + 1}</span>
                                        <span className="episodeTitle">{ep.title || `Episode ${ep.episode || idx + 1}`}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Detail Header: Poster + Info ── */}
                <div className="detailHeader">
                    <img src={detail.poster} alt={detail.title} className="detailPoster" />
                    <div className="detailInfo">
                        <h1 className="detailTitle">{detail.title}</h1>

                        {/* Metadata Grid */}
                        <div className="detailMeta">
                            {detail.rating && (
                                <div className="metaItem">
                                    <Star size={16} fill="#fbbf24" stroke="none" />
                                    <span>{detail.rating}</span>
                                </div>
                            )}
                            {detail.year && (
                                <div className="metaItem">
                                    <Calendar size={16} />
                                    <span>{detail.year}</span>
                                </div>
                            )}
                            {detail.type && (
                                <div className="metaItem">
                                    <Film size={16} />
                                    <span>{detail.type}</span>
                                </div>
                            )}
                            {detail.country && (
                                <div className="metaItem">
                                    <Globe size={16} />
                                    <span>{detail.country}</span>
                                </div>
                            )}
                        </div>

                        {/* Genre Pills — clickable */}
                        {genres.length > 0 && (
                            <div className="detailGenres">
                                {genres.map((g, i) => (
                                    <Link
                                        key={i}
                                        to={`/genre/${encodeURIComponent(g)}`}
                                        className="detailGenrePill"
                                    >
                                        {g}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <p className="detailDesc">
                            {detail.description || detail.plot || 'No description available.'}
                        </p>
                    </div>
                </div>

                {/* ── Recommendations ── */}
                {recommendations.length > 0 && (
                    <div className="recommendationsSection">
                        <h2 className="sectionTitle">Rekomendasi</h2>
                        <div className="recommendationsGrid">
                            {recommendations.map((item, idx) => (
                                <MovieCard key={item.id || idx} movie={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Detail;
