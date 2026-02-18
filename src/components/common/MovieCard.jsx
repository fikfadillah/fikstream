import React from 'react';
import { Star, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const isNew = String(movie.year) === '2026';
  const isOngoing = isNew && /series|tv|drama/i.test(movie.type || '');
  const statusLabel = isOngoing ? 'ONGOING' : isNew ? 'NEW' : null;

  return (
    <Link to={`/detail/${movie.detailPath || ''}`} className="movieCard">
      <div className="posterWrapper">
        <img src={movie.poster} alt={movie.title} className="posterImage" loading="lazy" />

        {/* Play Button Overlay — center */}
        <div className="playOverlay">
          <div className="playButton">
            <Play size={22} fill="currentColor" />
          </div>
        </div>

        {/* Status Badge — top-left */}
        {statusLabel && (
          <div className={`statusBadge ${isOngoing ? 'ongoing' : 'new'}`}>
            {isOngoing && <span className="pulseDot" />}
            {statusLabel}
          </div>
        )}

        {/* Rating Badge — top-right */}
        <div className="ratingBadge">
          <Star size={12} fill="#E8C547" stroke="none" />
          {movie.rating}
        </div>

        <div className="overlay">
          <h3 className="movieTitle">{movie.title}</h3>
          <div className="movieInfo">
            <span>{movie.year}</span>
            <span>{movie.type}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
