'use client';

import React, { useEffect, useState } from 'react';

interface Flake {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function SnowEffect() {
  const [flakes, setFlakes] = useState<Flake[]>([]);

  useEffect(() => {
    const generated: Flake[] = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 3.5 + 1.5,
        duration: Math.random() * 8 + 7,
        delay: Math.random() * 6,
        opacity: Math.random() * 0.7 + 0.25,
      });
    }
    setFlakes(generated);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="absolute rounded-full bg-snow shadow-sm block animate-snow-fall"
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
