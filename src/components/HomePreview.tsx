'use client';

import React, { useState } from 'react';
import { ChristmasTree } from '@/components/tree/ChristmasTree';
import { TreePine } from 'lucide-react';
import { ORNAMENT_METADATA } from '@/components/tree/ornament-metadata';

const DEMO_ORNAMENTS = [
  { id: '1', tree_id: 'demo', ornament_type: 'gold_ball', position_x: 42, position_y: 28, created_at: '' },
  { id: '2', tree_id: 'demo', ornament_type: 'red_ball', position_x: 58, position_y: 36, created_at: '' },
  { id: '3', tree_id: 'demo', ornament_type: 'snowflake', position_x: 35, position_y: 48, created_at: '' },
  { id: '4', tree_id: 'demo', ornament_type: 'bell', position_x: 65, position_y: 52, created_at: '' },
  { id: '5', tree_id: 'demo', ornament_type: 'heart', position_x: 50, position_y: 62, created_at: '' },
  { id: '6', tree_id: 'demo', ornament_type: 'silver_ball', position_x: 28, position_y: 68, created_at: '' },
  { id: '7', tree_id: 'demo', ornament_type: 'gift_box', position_x: 72, position_y: 72, created_at: '' },
];

export function HomePreview() {
  const [selectedTheme, setSelectedTheme] = useState<'classic' | 'snowy' | 'golden' | 'midnight'>('golden');
  const [activeOrnamentNote, setActiveOrnamentNote] = useState<string | null>(
    'Bu ağaç sana özel. Arkadaşların dallara kendi sevgilerini bırakacak!'
  );

  return (
<div className="lg:col-span-5 flex flex-col items-center justify-center z-10">
  <div className="w-full max-w-sm rounded-3xl glass-panel-gold p-6 relative overflow-hidden flex flex-col items-center">
    <div className="w-full flex items-center justify-between pb-3 border-b border-forest/50 mb-3 text-xs">
      <span className="font-serif font-bold text-snow flex items-center gap-1.5">
        <TreePine className="h-3.5 w-3.5 text-gold" />
        Önizleme: @seninagacin
      </span>
      <span className="text-gold bg-forest/50 px-2 py-0.5 rounded border border-gold/20">
        {selectedTheme === 'classic' && 'Klasik Çam'}
        {selectedTheme === 'snowy' && 'Karlı Orman'}
        {selectedTheme === 'golden' && 'Altın Işıltı'}
        {selectedTheme === 'midnight' && 'Gece Safiri'}
      </span>
    </div>

    <div className="grid grid-cols-4 gap-1.5 w-full mb-4">
      {(['classic', 'snowy', 'golden', 'midnight'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setSelectedTheme(t)}
          className={`py-1 text-[11px] font-medium rounded-lg capitalize transition-all ${
            selectedTheme === t
              ? 'bg-gold text-background font-bold shadow'
              : 'bg-forest/30 text-muted hover:text-snow border border-forest/60'
          }`}
        >
          {t === 'classic' ? 'Klasik' : t === 'snowy' ? 'Karlı' : t === 'golden' ? 'Altın' : 'Gece'}
        </button>
      ))}
    </div>

    <ChristmasTree
      theme={selectedTheme}
      ornaments={DEMO_ORNAMENTS}
      interactive={true}
      onOrnamentClick={(ornament) => {
        const meta = ORNAMENT_METADATA[ornament.ornament_type];
        setActiveOrnamentNote(
          `${meta?.label || 'Süs'}: "${meta?.description || 'Yeni yıl dileği'}"`
        );
      }}
    />

    <div className="mt-4 w-full bg-forest/40 border border-gold/20 rounded-xl p-3 text-center">
      <p className="text-xs text-snow/90 italic">{activeOrnamentNote}</p>
      <span className="text-[10px] text-muted block mt-1">
        (Süslere tıklayarak keşfedebilirsiniz)
      </span>
    </div>
  </div>
</div>
  );
}
