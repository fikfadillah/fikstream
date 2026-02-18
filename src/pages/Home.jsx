import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import HeroBanner from '../components/home/HeroBanner';
import Section from '../components/layout/Section';
import MovieCard from '../components/common/MovieCard';
import { SectionSkeleton } from '../components/common/Skeleton';
import { api } from '../services/api';
import { HOME_SECTIONS } from '../constants/categories';

const INITIAL_SECTIONS_STATE = HOME_SECTIONS.reduce((acc, cat) => {
    acc[cat.id] = { ...cat, data: [], loading: true };
    return acc;
}, {});

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [sections, setSections] = useState(INITIAL_SECTIONS_STATE);

    useEffect(() => {
        // Fetch trending
        api.getTrending()
            .then((res) => setTrending(res?.items || []))
            .catch(() => { });

        // Fetch semua section secara paralel
        HOME_SECTIONS.forEach((cat) => {
            cat.api(1)
                .then((res) => {
                    setSections((prev) => ({
                        ...prev,
                        [cat.id]: { ...prev[cat.id], data: res?.items || [], loading: false },
                    }));
                })
                .catch(() => {
                    setSections((prev) => ({
                        ...prev,
                        [cat.id]: { ...prev[cat.id], loading: false },
                    }));
                });
        });
    }, []);

    // Konten terbaru tahun 2026, deduplikasi berdasarkan ID
    const latestContent = useMemo(() => {
        const allItems = [
            ...trending,
            ...Object.values(sections).flatMap((s) => s.data),
        ];
        const latest = allItems.filter(
            (item) => item.year === 2026 || item.year === '2026'
        );
        return Array.from(new Map(latest.map((item) => [item.id, item])).values());
    }, [trending, sections]);

    return (
        <Layout>
            {trending.length > 0 && <HeroBanner items={trending.slice(0, 5)} />}

            {latestContent.length > 0 && (
                <Section title="New Releases / Ongoing" linkTo={null}>
                    {latestContent.slice(0, 10).map((item) => (
                        <MovieCard key={`latest-${item.id}`} movie={item} />
                    ))}
                </Section>
            )}

            {Object.values(sections).map((section) =>
                section.loading ? (
                    <SectionSkeleton key={section.id} />
                ) : (
                    section.data.length > 0 && (
                        <Section key={section.id} title={section.name} linkTo={section.link}>
                            {section.data.slice(0, 10).map((item) => (
                                <MovieCard key={item.id} movie={item} />
                            ))}
                        </Section>
                    )
                )
            )}
        </Layout>
    );
};

export default Home;
