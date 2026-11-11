'use client';

import React from 'react';
import { OrnamentIcon } from './Ornaments';
import { Ornament, TreeTheme } from '@/types/database';

interface ChristmasTreeProps {
  theme?: TreeTheme | string;
  ornaments?: Ornament[];
  onTreeClick?: (coords?: { x: number; y: number }) => void;
  onOrnamentClick?: (ornament: Ornament) => void;
  interactive?: boolean;
  className?: string;
  showTopperStar?: boolean;
}

const THEME_STYLES: Record<
  string,
  {
    branchPrimary: string;
    branchSecondary: string;
    branchHighlight: string;
    snowColor?: string;
    trunkColor: string;
    potColor: string;
    lightsColor: string;
  }
> = {
  classic: {
    branchPrimary: '#143625',
    branchSecondary: '#0C2318',
    branchHighlight: '#1E523A',
    trunkColor: '#3E2723',
    potColor: '#B89647',
    lightsColor: '#F4D06F',
  },
  snowy: {
    branchPrimary: '#1E3F33',
    branchSecondary: '#12261F',
    branchHighlight: '#2A5847',
    snowColor: '#F0F6FC',
    trunkColor: '#2D1F1C',
    potColor: '#D6B66B',
    lightsColor: '#BAE6FD',
  },
  golden: {
    branchPrimary: '#1A3326',
    branchSecondary: '#0E1E16',
    branchHighlight: '#355E46',
    trunkColor: '#4A3B22',
    potColor: '#EAD49B',
    lightsColor: '#FFE082',
  },
  midnight: {
    branchPrimary: '#0C2022',
    branchSecondary: '#061314',
    branchHighlight: '#16383B',
    trunkColor: '#1A1C23',
    potColor: '#8B5CF6',
    lightsColor: '#A78BFA',
  },
};

export function ChristmasTree({
  theme = 'classic',
  ornaments = [],
  onTreeClick,
  onOrnamentClick,
  interactive = true,
  className = '',
  showTopperStar = true,
}: ChristmasTreeProps) {
  const currentTheme = THEME_STYLES[theme] || THEME_STYLES.classic;

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onTreeClick || !interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    if (y >= 12 && y <= 82 && x >= 15 && x <= 85) {
      onTreeClick({ x, y });
    }
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 400 520"
        className="w-full max-w-[440px] h-auto drop-shadow-2xl cursor-pointer"
        onClick={handleSvgClick}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="treeBackdropGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D6B66B" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#080D0B" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="tier1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentTheme.branchHighlight} />
            <stop offset="50%" stopColor={currentTheme.branchPrimary} />
            <stop offset="100%" stopColor={currentTheme.branchSecondary} />
          </linearGradient>

          <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EAD49B" />
            <stop offset="60%" stopColor={currentTheme.potColor} />
            <stop offset="100%" stopColor="#69511C" />
          </linearGradient>
        </defs>

        <circle cx="200" cy="240" r="180" fill="url(#treeBackdropGlow)" />

        <g id="base">
          <rect x="184" y="420" width="32" height="35" rx="3" fill={currentTheme.trunkColor} />
          <path d="M188 420 L188 455" stroke="#1F1513" strokeWidth="2" opacity="0.6" />
          <polygon points="160,450 240,450 228,495 172,495" fill="url(#potGrad)" stroke="#B89647" strokeWidth="1" />
          <ellipse cx="200" cy="450" rx="40" ry="6" fill="#D6B66B" opacity="0.4" />
          <line x1="162" y1="452" x2="238" y2="452" stroke="#FFF7D6" strokeWidth="1.5" opacity="0.7" />
        </g>

        <g id="tier-4">
          <path
            d="M200 270
               L240 315 L228 322 L275 365 L260 372 L315 425
               C285 435, 230 438, 200 435
               C170 438, 115 435, 85 425
               L140 372 L125 365 L172 322 L160 315 Z"
            fill="url(#tier1Grad)"
            stroke="#08140E"
            strokeWidth="1.5"
          />
          {currentTheme.snowColor && (
            <path
              d="M98 422 C130 415, 175 428, 200 422 C225 428, 270 415, 302 422 C275 433, 230 436, 200 435 C170 436, 125 433, 98 422 Z"
              fill={currentTheme.snowColor}
              opacity="0.85"
            />
          )}
        </g>

        <g id="tier-3">
          <path
            d="M200 190
               L238 235 L224 242 L268 288 L254 295 L292 342
               C265 352, 225 355, 200 352
               C175 355, 135 352, 108 342
               L146 295 L132 288 L176 242 L162 235 Z"
            fill="url(#tier1Grad)"
            stroke="#08140E"
            strokeWidth="1.5"
          />
          {currentTheme.snowColor && (
            <path
              d="M120 340 C145 334, 180 345, 200 340 C220 345, 255 334, 280 340 C260 349, 225 352, 200 350 C175 352, 140 349, 120 340 Z"
              fill={currentTheme.snowColor}
              opacity="0.85"
            />
          )}
        </g>

        <g id="tier-2">
          <path
            d="M200 120
               L232 165 L220 172 L254 212 L242 218 L270 258
               C245 268, 220 270, 200 268
               C180 270, 155 268, 130 258
               L158 218 L146 212 L180 172 L168 165 Z"
            fill="url(#tier1Grad)"
            stroke="#08140E"
            strokeWidth="1.5"
          />
          {currentTheme.snowColor && (
            <path
              d="M142 256 C165 250, 185 260, 200 256 C215 260, 235 250, 258 256 C240 264, 220 267, 200 265 C180 267, 160 264, 142 256 Z"
              fill={currentTheme.snowColor}
              opacity="0.85"
            />
          )}
        </g>

        <g id="tier-1">
          <path
            d="M200 65
               L228 108 L218 114 L244 148 L232 154 L250 185
               C230 193, 215 195, 200 193
               C185 195, 170 193, 150 185
               L168 154 L156 148 L182 114 L172 108 Z"
            fill="url(#tier1Grad)"
            stroke="#08140E"
            strokeWidth="1.5"
          />
          {currentTheme.snowColor && (
            <path
              d="M162 183 C175 178, 190 186, 200 183 C210 186, 225 178, 238 183 C225 190, 212 192, 200 191 C188 192, 175 190, 162 183 Z"
              fill={currentTheme.snowColor}
              opacity="0.85"
            />
          )}
        </g>

        <g id="garlands" opacity="0.65">
          <path d="M175 145 Q 200 165, 225 148" stroke="#D6B66B" strokeWidth="1" strokeDasharray="2 6" fill="none" />
          <path d="M152 215 Q 200 245, 248 218" stroke="#D6B66B" strokeWidth="1" strokeDasharray="2 7" fill="none" />
          <path d="M130 295 Q 200 335, 270 298" stroke="#D6B66B" strokeWidth="1.2" strokeDasharray="2 8" fill="none" />
          <path d="M110 375 Q 200 425, 290 380" stroke="#D6B66B" strokeWidth="1.2" strokeDasharray="2 8" fill="none" />
        </g>

        <g id="lights">
          {[
            { cx: 185, cy: 110, delay: '0s' },
            { cx: 215, cy: 125, delay: '0.7s' },
            { cx: 168, cy: 175, delay: '1.2s' },
            { cx: 202, cy: 160, delay: '0.4s' },
            { cx: 232, cy: 178, delay: '1.8s' },
            { cx: 145, cy: 245, delay: '0.9s' },
            { cx: 190, cy: 235, delay: '1.5s' },
            { cx: 220, cy: 248, delay: '0.2s' },
            { cx: 252, cy: 240, delay: '1.1s' },
            { cx: 125, cy: 325, delay: '0.6s' },
            { cx: 170, cy: 315, delay: '1.7s' },
            { cx: 212, cy: 328, delay: '0.3s' },
            { cx: 248, cy: 310, delay: '1.4s' },
            { cx: 275, cy: 330, delay: '0.8s' },
            { cx: 115, cy: 405, delay: '1.3s' },
            { cx: 160, cy: 395, delay: '0.5s' },
            { cx: 205, cy: 412, delay: '1.9s' },
            { cx: 250, cy: 400, delay: '0.1s' },
            { cx: 285, cy: 410, delay: '1.6s' },
          ].map((light, i) => (
            <circle
              key={i}
              cx={light.cx}
              cy={light.cy}
              r="2.5"
              fill={currentTheme.lightsColor}
              className="animate-twinkle"
              style={{ animationDelay: light.delay }}
            />
          ))}
        </g>

        {showTopperStar && (
          <g id="tree-star" className="animate-float">
            <defs>
              <radialGradient id="topperGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF2B2" />
                <stop offset="60%" stopColor="#D6B66B" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="52" r="22" fill="url(#topperGlow)" opacity="0.75" />
            <polygon
              points="200,28 206,46 225,48 210,60 215,78 200,67 185,78 190,60 175,48 194,46"
              fill="#FFE79A"
              stroke="#D6B66B"
              strokeWidth="1.5"
            />
            <circle cx="200" cy="54" r="3.5" fill="#FFFFFF" />
          </g>
        )}
      </svg>

      <div className="absolute inset-0 pointer-events-none">
        {ornaments.map((ornament) => (
          <button
            key={ornament.id}
            onClick={(e) => {
              e.stopPropagation();
              if (onOrnamentClick) onOrnamentClick(ornament);
            }}
            style={{
              left: `${ornament.position_x}%`,
              top: `${ornament.position_y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute pointer-events-auto transition-transform duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-gold rounded-full p-1 group"
            title={`Süs: ${ornament.ornament_type}`}
          >
            <OrnamentIcon
              type={ornament.ornament_type}
              size={32}
              className="drop-shadow-lg transition-transform group-hover:rotate-6"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
