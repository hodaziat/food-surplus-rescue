import React from 'react';

const Rating = ({ initialRating = 5 }) => {
  return (
    <div className="d-flex align-items-center">
      <span className="text-warning fs-5 me-1">
        {'★'.repeat(initialRating)}
        {'☆'.repeat(5 - initialRating)}
      </span>
      <small className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}>
        ({initialRating}.0)
      </small>
    </div>
  );
};

export default Rating;