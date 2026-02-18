import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook untuk infinite scroll menggunakan IntersectionObserver.
 *
 * @param {boolean} hasMore - Apakah masih ada data yang bisa dimuat
 * @param {boolean} isLoading - Apakah sedang loading
 * @returns {{ lastElementRef: Function, page: number, resetPage: Function }}
 */
export const useInfiniteScroll = (hasMore, isLoading) => {
    const [page, setPage] = useState(1);
    const observer = useRef(null);

    const lastElementRef = useCallback(
        (node) => {
            if (isLoading || !hasMore) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    const resetPage = useCallback(() => setPage(1), []);

    return { lastElementRef, page, resetPage };
};
