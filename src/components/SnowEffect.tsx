import React from 'react';

const FLAKES = [
  { x: 4, size: 3, duration: 11, delay: 0, opacity: 0.5 },
  { x: 13, size: 2, duration: 14, delay: 3, opacity: 0.4 },
  { x: 22, size: 4, duration: 12, delay: 6, opacity: 0.55 },
  { x: 31, size: 2, duration: 15, delay: 1, opacity: 0.35 },
  { x: 42, size: 3, duration: 10, delay: 5, opacity: 0.5 },
  { x: 52, size: 2, duration: 13, delay: 2, opacity: 0.4 },
  { x: 61, size: 4, duration: 14, delay: 7, opacity: 0.5 },
  { x: 71, size: 2, duration: 12, delay: 4, opacity: 0.35 },
  { x: 82, size: 3, duration: 15, delay: 0, opacity: 0.5 },
  { x: 93, size: 2, duration: 11, delay: 5, opacity: 0.4 },
];

export function SnowEffect() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {FLAKES.map((flake, index) => (
        <span
          key={index}
          className="snow-flake absolute rounded-full bg-snow block animate-snow-fall"
          style={{
            left: `${flake.x}vw`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
