import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MovieCard from '../components/common/MovieCard';
import { SectionSkeleton } from '../components/common/Skeleton';
import { api } from '../services/api';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) return;

        setLoading(true);
        api.search(query)
            .then((res) => setResults(res?.items || []))
            .catch(() => setResults([]))
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <Layout>
            <div className="container searchPage">
                <h1 className="searchTitle">
                    Search Results for: &ldquo;{query}&rdquo;
                </h1>

                {loading ? (
                    <SectionSkeleton />
                ) : (
                    <div className="grid">
                        {results.length > 0 ? (
                            results.map((item) => (
                                <MovieCard key={item.id} movie={item} />
                            ))
                        ) : (
                            <p className="emptyMessage">No results found.</p>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Search;
