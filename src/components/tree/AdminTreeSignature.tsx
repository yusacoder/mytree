'use client';

import React from 'react';
import { BadgeCheck, Sparkles } from 'lucide-react';

export interface AdminTreeSignatureData {
  note: string;
  signed_at?: string;
}

interface AdminTreeSignatureProps {
  signature?: AdminTreeSignatureData | null;
}

export function AdminTreeSignature({ signature }: AdminTreeSignatureProps) {
  const note = signature?.note?.trim();
  if (!note) return null;

  return (
    <section
      aria-label="Eternal ekibinin ağaç imzası"
      className="relative w-full overflow-hidden rounded-2xl border border-gold/50 bg-gradient-to-br from-[#302512]/90 via-[#17180f]/95 to-forest-dark px-4 py-4 shadow-lg shadow-gold/10 sm:px-5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-gold/10 blur-2xl"
      />
      <div className="relative flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/50 bg-gold/10 text-gold">
          <BadgeCheck className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-gold-light sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            Bu ağaç Eternal Ekibi tarafından imzalanmıştır
          </p>
          <p className="mt-2 border-l-2 border-gold/50 pl-3 text-sm leading-relaxed text-snow/95">
            {note}
          </p>
          <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-gold/70">
            Eternal Production · Resmî Ağaç İmzası
          </p>
        </div>
      </div>
    </section>
  );
}
