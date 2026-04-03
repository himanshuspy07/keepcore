import React from 'react';

export const Logo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#619FEA" />
        <stop offset="100%" stopColor="#2C89B3" />
      </linearGradient>
    </defs>
    <path
      d="M50 10 C27.9 10 10 27.9 10 50 C10 72.1 27.9 90 50 90 C72.1 90 90 72.1 90 50"
      stroke="url(#logoGradient)"
      strokeWidth="10"
      strokeLinecap="round"
    />
    <path
      d="M50 20 C33.4 20 20 33.4 20 50 C20 66.6 33.4 80 50 80"
      stroke="url(#logoGradient)"
      strokeWidth="8"
      strokeLinecap="round"
      strokeDasharray="0.1 20"
    />
    <circle cx="50" cy="50" r="10" fill="url(#logoGradient)" />
  </svg>
);
