import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MovieCard from '../components/common/MovieCard';
import { SectionSkeleton, SkeletonCard } from '../components/common/Skeleton';
import { CATEGORIES, getCategoryById } from '../constants/categories';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import './Category.css';

const Category = () => {
    const { category: urlCategory } = useParams();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(urlCategory || 'trending');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const { lastElementRef, page, resetPage } = useInfiniteScroll(hasMore, loadingMore);

    // Sync URL → state
    useEffect(() => {
        if (urlCategory && urlCategory !== activeCategory) {
            setActiveCategory(urlCategory);
        }
    }, [urlCategory]);

    // Initial fetch saat kategori berubah
    useEffect(() => {
        const currentCat = getCategoryById(activeCategory);
        if (!currentCat) return;

        const fetchInitial = async () => {
            setItems([]);
            setLoading(true);
            setHasMore(true);
            resetPage();
            try {
                const res = await currentCat.api(1);
                setItems(res?.items || []);
                setHasMore(res?.hasMore !== false);
            } catch {
                // Gagal fetch — biarkan items kosong
            } finally {
                setLoading(false);
            }
        };

        fetchInitial();
    }, [activeCategory]);

    // Load more saat page bertambah
    useEffect(() => {
        if (page <= 1) return;
        const currentCat = getCategoryById(activeCategory);
        if (!currentCat) return;

        const loadMore = async () => {
            setLoadingMore(true);
            try {
                const res = await currentCat.api(page);
                setItems((prev) => [...prev, ...(res?.items || [])]);
                setHasMore(res?.hasMore !== false);
            } catch {
                // Gagal load more — hentikan infinite scroll
                setHasMore(false);
            } finally {
                setLoadingMore(false);
            }
        };

        loadMore();
    }, [page]);

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
        navigate(`/category/${categoryId}`);
        window.scrollTo(0, 0);
    };

    const currentCategoryName = getCategoryById(activeCategory)?.name || activeCategory;

    return (
        <Layout>
            <div className="container categoryPage">
                <h1 className="categoryTitle">{currentCategoryName}</h1>

                <div className="categoryTabs">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            className={`categoryTab ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <SectionSkeleton />
                ) : (
                    <div className="grid">
                        {items.map((item, index) => {
                            const isLast = items.length === index + 1;
                            return isLast ? (
                                <div ref={lastElementRef} key={`${item.id}-${index}`}>
                                    <MovieCard movie={item} />
                                </div>
                            ) : (
                                <MovieCard key={`${item.id}-${index}`} movie={item} />
                            );
                        })}
                    </div>
                )}

                {loadingMore && (
                    <div className="grid">
                        {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {!hasMore && !loading && items.length > 0 && (
                    <p className="endMessage">You've reached the end.</p>
                )}

                {!loading && items.length === 0 && (
                    <p className="endMessage">No content available.</p>
                )}
            </div>
        </Layout>
    );
};

export default Category;
