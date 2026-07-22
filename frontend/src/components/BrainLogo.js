import React from 'react';

/**
 * NeuroVero brain mark — clean stroke-based, no background.
 * Drop-in anywhere: <BrainLogo size={32} color="white" />
 */
export default function BrainLogo({ size = 32, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left hemisphere */}
      <path
        d="M16 6C12.5 5.5 8.5 7.5 7 11.5C5.5 15.5 5.5 19 7.5 22C9 24.5 12 26 15 26.5L16 26.8"
        stroke={color} strokeWidth="2" strokeLinecap="round"
      />
      {/* Right hemisphere */}
      <path
        d="M16 6C19.5 5.5 23.5 7.5 25 11.5C26.5 15.5 26.5 19 24.5 22C23 24.5 20 26 17 26.5L16 26.8"
        stroke={color} strokeWidth="2" strokeLinecap="round"
      />
      {/* Interhemispheric fissure */}
      <path
        d="M16 6V26.8"
        stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.38"
      />
      {/* Left sulcus */}
      <path
        d="M8.5 15C10 13 13 12.5 14.5 14"
        stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.52"
      />
      {/* Right sulcus */}
      <path
        d="M23.5 15C22 13 19 12.5 17.5 14"
        stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.52"
      />
      {/* Brainstem */}
      <path
        d="M14 26.8C14 28.6 18 28.6 18 26.8"
        stroke={color} strokeWidth="1.6" strokeLinecap="round"
      />
    </svg>
  );
}
