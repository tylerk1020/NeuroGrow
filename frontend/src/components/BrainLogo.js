import React from 'react';

/**
 * NeuroVero mark — Psi (ψ) symbol, clean stroke-based, no background.
 * Drop-in anywhere: <BrainLogo size={32} color="white" />
 */
export default function BrainLogo({ size = 32, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Center vertical stem */}
      <path
        d="M16 8V26"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"
      />
      {/* Left arc */}
      <path
        d="M10 8C10 8 7 12 7 16C7 20.5 11 24 16 24"
        stroke={color} strokeWidth="2.2" strokeLinecap="round"
      />
      {/* Right arc */}
      <path
        d="M22 8C22 8 25 12 25 16C25 20.5 21 24 16 24"
        stroke={color} strokeWidth="2.2" strokeLinecap="round"
      />
    </svg>
  );
}
