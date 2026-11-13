'use client';

import React, { useState } from 'react';
import { OrnamentTreeCarousel, OrnamentWithSender } from '@/components/tree/OrnamentTreeCarousel';
import { AdminTreeSignature } from '@/components/tree/AdminTreeSignature';
import { AddOrnamentModal } from '@/components/tree/AddOrnamentModal';
import { OrnamentIcon, ORNAMENT_METADATA } from '@/components/tree/Ornaments';
import { Tree, Profile } from '@/types/database';
import {
  Sparkles,
  TreePine,
  Copy,
  Check,
  Send,
  Lock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface PublicTreeClientProps {
  tree: Tree;
  profile: Profile;
  initialOrnaments: OrnamentWithSender[];
  unlockDateStr: string;
}

export function PublicTreeClient({
  tree,
  profile,
  initialOrnaments,
  unlockDateStr,
}: PublicTreeClientProps) {
  const [ornaments, setOrnaments] = useState<OrnamentWithSender[]>(initialOrnaments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedOrnamentDetail, setSelectedOrnamentDetail] = useState<OrnamentWithSender | null>(null);

  const unlockDate = new Date(unlockDateStr);
  const isUnlocked = new Date() >= unlockDate;
  const adminSignature = (tree.settings as Record<string, unknown> | null)?.admin_signature as
    | { note: string; signed_at?: string }
    | undefined;

  const handleTreeClick = () => {
    if (!tree.accept_messages) return;
    setIsModalOpen(true);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full text-center space-y-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-gold/30 text-gold text-xs font-semibold uppercase">
          <TreePine className="h-3.5 w-3.5" />
          @{profile.username}
        </div>

        <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-snow tracking-tight">
          {tree.tree_name}
        </h1>

        <p className="text-xs sm:text-sm text-muted">
          Bu ağaç {profile.display_name} için oluşturuldu. Ağaca tıklayarak süs bırakabilirsin.
        </p>

        {adminSignature?.note && (
          <div className="mt-4 text-left">
            <AdminTreeSignature signature={adminSignature} />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-forest/50 border border-forest-light text-xs text-snow flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span>Toplam Süs: <strong>{ornaments.length}</strong></span>
          </div>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-xl bg-surface hover:bg-forest/60 border border-forest text-xs text-snow flex items-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-gold" />
                <span className="text-gold">Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-gold" />
                <span>Ağacı Paylaş</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!tree.accept_messages && (
        <div className="w-full max-w-md mb-6 p-3.5 rounded-xl bg-yellow-950/40 border border-yellow-500/40 text-yellow-200 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-yellow-400" />
          <span>Bu ağaç şu anda yeni mesaj ve süs kabulüne kapalıdır.</span>
        </div>
      )}

      <div className="w-full max-w-md glass-panel-gold rounded-3xl p-6 relative flex flex-col items-center">
        <OrnamentTreeCarousel
          theme={tree.theme}
          ornaments={ornaments}
          interactive={tree.accept_messages}
          onTreeClick={handleTreeClick}
          onOrnamentClick={(orn) => setSelectedOrnamentDetail(orn)}
          className="w-full max-h-[480px]"
        />

        {tree.accept_messages && (
          <div className="mt-6 w-full flex flex-col items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-sm transition-all duration-200 shadow-xl shadow-gold/20 flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span>Ağaca Süs Bırak</span>
            </button>
            <span className="text-[11px] text-muted italic">
              veya doğrudan ağacın üzerine dokun!
            </span>
          </div>
        )}
      </div>

      {selectedOrnamentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm glass-panel-gold rounded-2xl p-6 text-center space-y-4">
            <div className="h-16 w-16 mx-auto flex items-center justify-center">
              <OrnamentIcon type={selectedOrnamentDetail.ornament_type} size={48} />
            </div>

            <div>
              <h3 className="text-base font-serif font-bold text-snow">
                {ORNAMENT_METADATA[selectedOrnamentDetail.ornament_type]?.label || 'Yılbaşı Süsü'}
              </h3>
              <p className="text-xs text-muted mt-1">
                {ORNAMENT_METADATA[selectedOrnamentDetail.ornament_type]?.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-forest/40 border border-gold/20 text-xs text-snow/90 flex items-center justify-center gap-2">
              <Lock className="h-4 w-4 text-gold shrink-0" />
              <span>
                {isUnlocked
                  ? 'Mesaj içeriği ağaç sahibine özeldir.'
                  : `Mesaj ${unlockDate.toLocaleDateString('tr-TR')} tarihinde sahibine açılacaktır.`}
              </span>
            </div>

            <button
              onClick={() => setSelectedOrnamentDetail(null)}
              className="w-full py-2.5 rounded-xl bg-surface hover:bg-surface/80 border border-forest text-snow text-xs font-semibold"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      <AddOrnamentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        treeId={tree.id}
        onSuccess={(newOrnament) => {
          setOrnaments((prev) => [...prev, newOrnament]);
        }}
      />

      <div className="mt-12 text-center text-xs text-muted">
        <span>Kendi ağacını süslemek ister misin? </span>
        <Link href="/kayit" className="text-gold font-semibold hover:underline">
          Ücretsiz Ağaç Oluştur
        </Link>
      </div>
    </div>
  );
}
