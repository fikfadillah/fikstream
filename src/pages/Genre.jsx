import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MovieCard from '../components/common/MovieCard';
import { SkeletonCard } from '../components/common/Skeleton';
import { Tag, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import './Genre.css';

const Genre = () => {
    const { genreName } = useParams();
    const decodedGenre = decodeURIComponent(genreName || '');

    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const observerRef = useRef(null);
    const lastItemRef = useRef(null);

    // Reset saat genre berubah
    useEffect(() => {
        setItems([]);
        setPage(1);
        setHasMore(true);
        setInitialLoad(true);
        window.scrollTo(0, 0);
    }, [decodedGenre]);

    // Fetch data
    useEffect(() => {
        if (!decodedGenre || !hasMore) return;

        setLoading(true);
        api.search(decodedGenre, page)
            .then((res) => {
                const newItems = res?.items || [];
                setItems((prev) => page === 1 ? newItems : [...prev, ...newItems]);
                setHasMore(newItems.length > 0 && (res?.hasMore ?? newItems.length >= 10));
            })
            .catch(() => setHasMore(false))
            .finally(() => {
                setLoading(false);
                setInitialLoad(false);
            });
    }, [decodedGenre, page]);

    // Infinite scroll observer
    const lastItemCallback = useCallback((node) => {
        if (loading) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prev) => prev + 1);
            }
        });
        if (node) observerRef.current.observe(node);
    }, [loading, hasMore]);

    return (
        <Layout>
            <div className="container genrePage">
                {/* Header */}
                <div className="genreHeader">
                    <Link to="/" className="genreBackBtn">
                        <ArrowLeft size={18} />
                        Kembali
                    </Link>
                    <div className="genreTitleRow">
                        <Tag size={24} className="genreIcon" />
                        <h1 className="genreTitle">{decodedGenre}</h1>
                    </div>
                    <p className="genreSubtitle">
                        Menampilkan konten dengan genre <strong>{decodedGenre}</strong>
                    </p>
                </div>

                {/* Grid */}
                {initialLoad ? (
                    <div className="grid">
                        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : items.length === 0 ? (
                    <div className="genreEmpty">
                        <p>Tidak ada konten ditemukan untuk genre <strong>"{decodedGenre}"</strong>.</p>
                        <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
                    </div>
                ) : (
                    <div className="grid">
                        {items.map((item, idx) => {
                            const isLast = idx === items.length - 1;
                            return (
                                <div key={`${item.id}-${idx}`} ref={isLast ? lastItemCallback : null}>
                                    <MovieCard movie={item} />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Loading more */}
                {loading && !initialLoad && (
                    <div className="genreLoadingMore">
                        <div className="spinner" />
                    </div>
                )}

                {/* End of results */}
                {!hasMore && items.length > 0 && (
                    <p className="genreEndMsg">Semua konten sudah ditampilkan.</p>
                )}
            </div>
        </Layout>
    );
};

export default Genre;
