import React from 'react';
import '../layout/Section.css';

export const SkeletonCard = () => (
    <div style={{
        aspectRatio: '2/3',
        backgroundColor: 'var(--card-bg)',
        borderRadius: 'var(--border-radius-lg)',
        background: 'linear-gradient(90deg, var(--card-bg) 25%, #1E293B 50%, var(--card-bg) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite ease-in-out'
    }}></div>
);

export const SectionSkeleton = () => (
    <div className="section container">
        <div style={{
            width: '200px',
            height: '28px',
            backgroundColor: 'var(--card-bg)',
            marginBottom: '24px',
            borderRadius: 'var(--border-radius)',
            background: 'linear-gradient(90deg, var(--card-bg) 25%, #1E293B 50%, var(--card-bg) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite ease-in-out'
        }}></div>
        <div className="grid">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
    </div>
);
