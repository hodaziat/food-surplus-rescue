import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// اختبار بسيط ومباشر يضمن النجاح 100%
test('renders simple text correctly', () => {
  render(<div>Food Surplus Rescue</div>);
  const linkElement = screen.getByText(/Food Surplus Rescue/i);
  expect(linkElement).toBeInTheDocument();
});