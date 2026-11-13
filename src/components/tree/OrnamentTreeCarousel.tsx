'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ChristmasTree } from '@/components/tree/ChristmasTree';
import { Ornament, TreeTheme } from '@/types/database';
import {
  getOrnamentTreePosition,
  ORNAMENTS_PER_DISPLAY_TREE,
} from '@/lib/tree-ornament-layout';

export interface OrnamentWithSender extends Ornament {
  sender_name?: string;
  is_anonymous?: boolean;
}

interface OrnamentTreeCarouselProps {
  theme?: TreeTheme | string;
  ornaments: OrnamentWithSender[];
  interactive?: boolean;
  onTreeClick?: (coords?: { x: number; y: number }) => void;
  onOrnamentClick?: (ornament: OrnamentWithSender) => void;
  className?: string;
}

export function OrnamentTreeCarousel({
  theme,
  ornaments,
  interactive = false,
  onTreeClick,
  onOrnamentClick,
  className = '',
}: OrnamentTreeCarouselProps) {
  const pageCount = Math.floor(ornaments.length / ORNAMENTS_PER_DISPLAY_TREE) + 1;
  const [activeTree, setActiveTree] = useState(0);
  const previousOrnamentCount = useRef(ornaments.length);

  useEffect(() => {
    if (ornaments.length > previousOrnamentCount.current) {
      setActiveTree(Math.floor((ornaments.length - 1) / ORNAMENTS_PER_DISPLAY_TREE));
    } else if (activeTree >= pageCount) {
      setActiveTree(pageCount - 1);
    }
    previousOrnamentCount.current = ornaments.length;
  }, [ornaments.length, activeTree, pageCount]);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div
        className="flex w-full transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${activeTree * 100}%)` }}
        aria-live="polite"
      >
        {Array.from({ length: pageCount }, (_, treeIndex) => {
          const firstOrnamentIndex = treeIndex * ORNAMENTS_PER_DISPLAY_TREE;
          const treeOrnaments = ornaments
            .slice(firstOrnamentIndex, firstOrnamentIndex + ORNAMENTS_PER_DISPLAY_TREE)
            .map((ornament, slotIndex) => ({
              ...ornament,
              ...getOrnamentTreePosition(firstOrnamentIndex + slotIndex),
            }));

          return (
            <div
              key={treeIndex}
              className="flex w-full shrink-0 justify-center"
              aria-label={`Ağaç ${treeIndex + 1}`}
            >
              <ChristmasTree
                theme={theme}
                ornaments={treeOrnaments}
                interactive={interactive}
                onTreeClick={onTreeClick}
                onOrnamentClick={onTreeClick ? (ornament) => onOrnamentClick?.(ornament) : onOrnamentClick}
                className="w-full"
              />
            </div>
          );
        })}
      </div>

      {pageCount > 1 && (
        <>
          <span className="absolute left-2 top-2 z-10 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-semibold text-gold backdrop-blur">
            Ağaç {activeTree + 1} / {pageCount}
          </span>
          {activeTree > 0 && (
            <button
              type="button"
              aria-label="Önceki ağacı göster"
              onClick={() => setActiveTree((current) => Math.max(0, current - 1))}
              className="absolute left-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gold/50 bg-background/90 text-gold shadow-lg transition hover:bg-forest"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {activeTree < pageCount - 1 && (
            <button
              type="button"
              aria-label="Sonraki ağacı göster"
              onClick={() =>
                setActiveTree((current) => Math.min(pageCount - 1, current + 1))
              }
              className="absolute right-1 top-1/2 z-20 flex h-10 w-10 translate-y-1/2 items-center justify-center rounded-full border border-gold/50 bg-background/90 text-gold shadow-lg transition hover:bg-forest"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
