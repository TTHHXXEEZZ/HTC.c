import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, interactive = false, onChange, size = 18 }) {
  const [hoverRating, setHoverRating] = useState(0);

  const getStarColor = (starIndex) => {
    const activeVal = interactive ? (hoverRating || rating) : rating;
    if (activeVal >= starIndex) {
      return 'var(--warning)'; // Full star
    }
    // Handle half-star rendering for view-only mode
    if (!interactive && activeVal > starIndex - 1 && activeVal < starIndex) {
      return 'url(#half-star)';
    }
    return '#cbd5e1'; // Empty gray star
  };

  const handleStarClick = (index) => {
    if (interactive && onChange) {
      onChange(index);
    }
  };

  const handleMouseEnter = (index) => {
    if (interactive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className={`star-rating-container ${interactive ? 'interactive' : ''}`} onMouseLeave={handleMouseLeave}>
      {/* SVG Pattern Definition for Half Star */}
      {!interactive && (
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="var(--warning)" />
              <stop offset="50%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {[1, 2, 3, 4, 5].map((index) => {
        const starColor = getStarColor(index);
        return (
          <button
            key={index}
            type="button"
            className="star-btn"
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            disabled={!interactive}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              padding: '2px',
              background: 'none',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none'
            }}
          >
            <Star
              size={size}
              fill={starColor}
              color={starColor === '#cbd5e1' ? '#94a3b8' : starColor}
              style={{
                transition: interactive ? 'transform 0.1s ease' : 'none',
                transform: interactive && hoverRating >= index ? 'scale(1.15)' : 'scale(1)'
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
