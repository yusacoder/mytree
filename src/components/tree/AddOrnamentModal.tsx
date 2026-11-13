'use client';

import React, { useState } from 'react';
import { OrnamentIcon, ORNAMENT_METADATA } from './Ornaments';
import { Ornament, OrnamentType } from '@/types/database';
import { addOrnamentAction } from '@/app/actions/ornament';
import { X, Sparkles, Send, Loader2, AlertCircle } from 'lucide-react';

interface AddOrnamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  treeId: string;
  onSuccess: (ornament: Ornament & { sender_name: string; is_anonymous: boolean }) => void;
}

const ORNAMENT_OPTIONS: OrnamentType[] = [
  'gold_ball',
  'silver_ball',
  'red_ball',
  'star',
  'snowflake',
  'bell',
  'gift_box',
  'heart',
];

export function AddOrnamentModal({
  isOpen,
  onClose,
  treeId,
  onSuccess,
}: AddOrnamentModalProps) {
  const [selectedOrnament, setSelectedOrnament] = useState<OrnamentType>('gold_ball');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set('treeId', treeId);
    formData.set('ornamentType', selectedOrnament);
    formData.set('senderName', isAnonymous ? 'Anonim' : (senderName.trim() || 'Gizli Dost'));
    formData.set('messageContent', message);
    formData.set('isAnonymous', isAnonymous ? 'true' : 'false');

    const result = await addOrnamentAction(formData);

    if (result.success) {
      setLoading(false);
      setMessage('');
      setSenderName('');
      onSuccess(result.ornament);
      onClose();
    } else {
      setError(result.error || 'Bir sorun oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg glass-panel-gold rounded-3xl p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-muted hover:text-snow hover:bg-forest/60 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-1.5 mb-6">
          <div className="mx-auto h-11 w-11 rounded-2xl bg-forest border border-gold/40 flex items-center justify-center text-gold shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-snow">
            Ağaca Süs & Mesaj Bırak
          </h2>
          <p className="text-xs text-muted">
            Süsünü seç ve ağaç sahibine özel yeni yıl dileğini yaz.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-snow/90 mb-2">
              Süs Seçimi
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {ORNAMENT_OPTIONS.map((type) => {
                const meta = ORNAMENT_METADATA[type];
                const isSelected = selectedOrnament === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedOrnament(type)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'border-gold bg-forest/80 shadow-md shadow-gold/20 scale-105'
                        : 'border-forest/60 bg-surface hover:border-forest-light'
                    }`}
                  >
                    <OrnamentIcon type={type} size={32} />
                    <span className="text-[10px] font-medium text-snow mt-1 truncate max-w-full">
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-snow/90">
                Adın / Lakabın (3–12 karakter)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted hover:text-snow">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-forest text-gold focus:ring-gold h-3.5 w-3.5 bg-forest-dark"
                />
                <span>Anonim Gönder</span>
              </label>
            </div>

            <input
              type="text"
              disabled={isAnonymous}
              value={isAnonymous ? 'Anonim Dost' : senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Örn: Ayşe veya Liseden Dostun"
              minLength={3}
              maxLength={12}
              required={!isAnonymous}
              className="w-full px-3.5 py-2.5 rounded-xl bg-forest-dark border border-forest/80 focus:border-gold focus:outline-none text-snow text-xs sm:text-sm transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-snow/90">
                Yeni Yıl Mesajın
              </label>
              <span className="text-[11px] text-muted">
                {message.length} / 300
              </span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={300}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Yeni yılda kalbinden geçen tüm güzellikler seninle olsun..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-forest-dark border border-forest/80 focus:border-gold focus:outline-none text-snow text-xs sm:text-sm transition-colors resize-none"
            />
            <p className="text-[10px] text-muted mt-1 italic">
              🔒 Not: Mesajın 25 Aralık 2026&apos;ya kadar gizli kalacaktır. Ağaç sahibi bu tarihe kadar sadece süsünü ve ismini görebilir.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-sm transition-all duration-200 shadow-lg shadow-gold/15 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Süs Ağaca Asılıyor...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Süsü Ağaca As & Mesajı Gönder</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
