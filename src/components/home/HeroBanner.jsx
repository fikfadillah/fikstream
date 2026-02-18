import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Star, Calendar, Film, Info } from 'lucide-react';
import './HeroBanner.css';

const HeroBanner = ({ items = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (items.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [items.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    if (items.length === 0) return null;

    return (
        <div className="heroContainer">
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className={`heroSlide ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${item.poster})` }}
                >
                    <div className="heroOverlay">
                        <div className="heroContent">
                            <h1 className="heroTitle">{item.title}</h1>

                            <div className="heroMeta">
                                <span className="heroRating">
                                    <Star size={16} fill="#fbbf24" stroke="none" />
                                    {item.rating}
                                </span>
                                <span className="heroYear">{item.year}</span>
                                <span className="heroType">{item.type}</span>
                            </div>

                            {/* Genre Pills */}
                            {item.genre && (
                                <div className="heroGenres">
                                    {item.genre.split(',').slice(0, 3).map((g, idx) => (
                                        <span key={idx} className="genrePill">
                                            {g.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Synopsis */}
                            <p className="heroSynopsis">
                                {item.description || item.plot || "No synopsis available for this title. Watch now to discover the story."}
                            </p>

                            <div className="heroActions">
                                <Link to={`/detail/${item.detailPath}`} className="btn btn-primary heroWatchBtn">
                                    <Play size={20} fill="currentColor" />
                                    Tonton Sekarang
                                </Link>
                                <Link to={`/detail/${item.detailPath}`} className="btn btn-secondary heroInfoBtn">
                                    <Info size={20} />
                                    Info Lengkap
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button className="navButton navPrev" onClick={prevSlide}>
                <ChevronLeft size={24} />
            </button>
            <button className="navButton navNext" onClick={nextSlide}>
                <ChevronRight size={24} />
            </button>

            {/* Slide Indicators */}
            <div className="slideIndicators">
                {items.map((_, idx) => (
                    <div
                        key={idx}
                        className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(idx)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroBanner;
