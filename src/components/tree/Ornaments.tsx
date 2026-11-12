'use client';

import React from 'react';

export { ORNAMENT_METADATA } from './ornament-metadata';

interface OrnamentIconProps {
  type: string;
  className?: string;
  size?: number;
}

export function OrnamentIcon({ type, className = '', size = 32 }: OrnamentIconProps) {
  switch (type) {
    case 'gold_ball':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <radialGradient id="goldSphere" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="45%" stopColor="#D6B66B" />
              <stop offset="85%" stopColor="#8C6D2B" />
              <stop offset="100%" stopColor="#4A3810" />
            </radialGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#D6B66B" floodOpacity="0.4" />
            </filter>
          </defs>
          <path d="M18 6 C18 3, 22 3, 22 6" stroke="#D6B66B" strokeWidth="2" strokeLinecap="round" />
          <rect x="17" y="6" width="6" height="3" rx="1.5" fill="#B89647" />
          <circle cx="20" cy="23" r="14" fill="url(#goldSphere)" filter="url(#goldGlow)" />
          <ellipse cx="16" cy="18" rx="4" ry="2.5" fill="#FFFBE6" opacity="0.6" transform="rotate(-25 16 18)" />
        </svg>
      );

    case 'silver_ball':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <radialGradient id="silverSphere" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#D8E2DC" />
              <stop offset="85%" stopColor="#88958D" />
              <stop offset="100%" stopColor="#4A524D" />
            </radialGradient>
            <filter id="silverGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#D8E2DC" floodOpacity="0.4" />
            </filter>
          </defs>
          <path d="M18 6 C18 3, 22 3, 22 6" stroke="#A4ADA5" strokeWidth="2" strokeLinecap="round" />
          <rect x="17" y="6" width="6" height="3" rx="1.5" fill="#88958D" />
          <circle cx="20" cy="23" r="14" fill="url(#silverSphere)" filter="url(#silverGlow)" />
          <ellipse cx="16" cy="18" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.8" transform="rotate(-25 16 18)" />
        </svg>
      );

    case 'red_ball':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <radialGradient id="redSphere" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FF8787" />
              <stop offset="45%" stopColor="#C92A2A" />
              <stop offset="85%" stopColor="#7E1717" />
              <stop offset="100%" stopColor="#3E0909" />
            </radialGradient>
            <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#C92A2A" floodOpacity="0.4" />
            </filter>
          </defs>
          <path d="M18 6 C18 3, 22 3, 22 6" stroke="#D6B66B" strokeWidth="2" strokeLinecap="round" />
          <rect x="17" y="6" width="6" height="3" rx="1.5" fill="#B89647" />
          <circle cx="20" cy="23" r="14" fill="url(#redSphere)" filter="url(#redGlow)" />
          <ellipse cx="16" cy="18" rx="4" ry="2.5" fill="#FFA8A8" opacity="0.6" transform="rotate(-25 16 18)" />
        </svg>
      );

    case 'star':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF5C0" />
              <stop offset="50%" stopColor="#F4D06F" />
              <stop offset="100%" stopColor="#D6B66B" />
            </linearGradient>
            <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#F4D06F" floodOpacity="0.8" />
            </filter>
          </defs>
          <path
            d="M20 4 L23.8 14.2 L34.8 14.7 L26.3 21.6 L29.2 32.2 L20 26.2 L10.8 32.2 L13.7 21.6 L5.2 14.7 L16.2 14.2 Z"
            fill="url(#starGrad)"
            filter="url(#starGlow)"
            stroke="#FFE685"
            strokeWidth="0.8"
          />
          <circle cx="20" cy="20" r="3" fill="#FFFDF0" opacity="0.85" />
        </svg>
      );

    case 'snowflake':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <filter id="snowGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#BAE6FD" floodOpacity="0.7" />
            </filter>
          </defs>
          <g stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" filter="url(#snowGlow)">
            <line x1="20" y1="6" x2="20" y2="34" />
            <line x1="6" y1="20" x2="34" y2="20" />
            <line x1="10" y1="10" x2="30" y2="30" />
            <line x1="10" y1="30" x2="30" y2="10" />
            <path d="M16 10 L20 14 L24 10" />
            <path d="M16 30 L20 26 L24 30" />
            <path d="M10 16 L14 20 L10 24" />
            <path d="M30 16 L26 20 L30 24" />
          </g>
          <circle cx="20" cy="20" r="2.5" fill="#FFFFFF" />
        </svg>
      );

    case 'bell':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="bellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="60%" stopColor="#E5A93C" />
              <stop offset="100%" stopColor="#9C6B13" />
            </linearGradient>
            <filter id="bellGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#E5A93C" floodOpacity="0.4" />
            </filter>
          </defs>
          <circle cx="20" cy="7" r="2.5" fill="none" stroke="#D6B66B" strokeWidth="2" />
          <path
            d="M20 9 C15 9, 13 15, 12 24 C10 27, 8 29, 8 30 C8 31, 9 32, 11 32 L29 32 C31 32, 32 31, 32 30 C32 29, 30 27, 28 24 C27 15, 25 9, 20 9 Z"
            fill="url(#bellGrad)"
            filter="url(#bellGlow)"
          />
          <circle cx="20" cy="33" r="3" fill="#D6B66B" />
          <ellipse cx="16" cy="18" rx="2" ry="5" fill="#FFF4D0" opacity="0.5" />
        </svg>
      );

    case 'gift_box':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="giftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#AF66FF" />
              <stop offset="100%" stopColor="#6C2EB9" />
            </linearGradient>
            <filter id="giftGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#9B51E0" floodOpacity="0.4" />
            </filter>
          </defs>
          <path d="M16 11 C13 7, 10 9, 14 13 Z" fill="#D6B66B" />
          <path d="M24 11 C27 7, 30 9, 26 13 Z" fill="#D6B66B" />
          <circle cx="20" cy="13" r="2" fill="#EAD49B" />
          <rect x="9" y="14" width="22" height="20" rx="3" fill="url(#giftGrad)" filter="url(#giftGlow)" />
          <rect x="8" y="14" width="24" height="5" rx="1.5" fill="#7C3AED" />
          <rect x="18" y="14" width="4" height="20" fill="#D6B66B" />
        </svg>
      );

    case 'heart':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <radialGradient id="heartGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFA6C2" />
              <stop offset="50%" stopColor="#E05780" />
              <stop offset="100%" stopColor="#871A3B" />
            </radialGradient>
            <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#E05780" floodOpacity="0.45" />
            </filter>
          </defs>
          <path d="M19 6 C19 3, 21 3, 21 6" stroke="#D6B66B" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M20 14 C17 9, 8 11, 8 19 C8 25, 16 30, 20 34 C24 30, 32 25, 32 19 C32 11, 23 9, 20 14 Z"
            fill="url(#heartGrad)"
            filter="url(#heartGlow)"
          />
          <ellipse cx="14" cy="16" rx="2.5" ry="1.5" fill="#FFE3EC" opacity="0.6" transform="rotate(-30 14 16)" />
        </svg>
      );

    default:
      return <circle cx="20" cy="20" r="10" fill="#D6B66B" />;
  }
}
