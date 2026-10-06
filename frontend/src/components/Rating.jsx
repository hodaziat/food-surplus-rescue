import React from 'react';

const Rating = ({ initialRating = 5 }) => {
  // Rating ni 0 nundi 5 madyalo bound chesi integer ga marchadam
  const validRating = Math.min(5, Math.max(0, Math.round(Number(initialRating) || 5)));

  return (
    <div className="d-flex align-items-center">
      <span className="text-warning fs-5 me-1">
        {'★'.repeat(validRating)}
        {'☆'.repeat(5 - validRating)}
      </span>
      <small className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}>
        ({Number(initialRating).toFixed(1)})
      </small>
    </div>
  );
};

export default Rating;