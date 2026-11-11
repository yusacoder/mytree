'use client';

import React, { useState } from 'react';
import { updateTreeSettingsAction } from '@/app/actions/tree';
import { TreeTheme } from '@/types/database';
import { ChristmasTree } from '@/components/tree/ChristmasTree';
import {
  TreePine,
  Check,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface TreeSettingsClientProps {
  initialTree: {
    tree_name: string;
    theme: TreeTheme;
    accept_messages: boolean;
    is_public: boolean;
  };
}

const THEMES: { id: TreeTheme; label: string; desc: string }[] = [
  { id: 'classic', label: 'Klasik Çam', desc: 'Geleneksel koyu yeşil ve altın parıltılar' },
  { id: 'snowy', label: 'Karlı Orman', desc: 'Buz mavisi ve kar taneleriyle kaplı dallar' },
  { id: 'golden', label: 'Altın Işıltı', desc: 'Asil altın ve sıcak ışıkların zarafeti' },
  { id: 'midnight', label: 'Gece Safiri', desc: 'Derin gece mavisi ve mor sihir' },
];

export function TreeSettingsClient({ initialTree }: TreeSettingsClientProps) {
  const [treeName, setTreeName] = useState(initialTree.tree_name);
  const [selectedTheme, setSelectedTheme] = useState<TreeTheme>(initialTree.theme);
  const [acceptMessages, setAcceptMessages] = useState(initialTree.accept_messages);
  const [isPublic, setIsPublic] = useState(initialTree.is_public);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const formData = new FormData();
    formData.set('treeName', treeName);
    formData.set('theme', selectedTheme);
    formData.set('acceptMessages', acceptMessages ? 'on' : 'off');
    formData.set('isPublic', isPublic ? 'on' : 'off');

    const result = await updateTreeSettingsAction(formData);

    if (result.success) {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || 'Ayarlar kaydedilemedi.');
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 glass-panel-gold rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-serif font-bold text-snow flex items-center gap-2">
          <TreePine className="h-5 w-5 text-gold" />
          Ağaç Özelleştirme
        </h2>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-forest/80 border border-gold/40 text-gold-light text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-gold" />
            <span>Ağaç ayarların başarıyla güncellendi!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-snow/90 mb-1">
              Ağacının Başlığı
            </label>
            <input
              type="text"
              name="treeName"
              required
              value={treeName}
              onChange={(e) => setTreeName(e.target.value)}
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl bg-forest-dark border border-forest/80 focus:border-gold focus:outline-none text-snow text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-snow/90 mb-2">
              Ağaç Teması
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    selectedTheme === theme.id
                      ? 'border-gold bg-forest/70 shadow-md shadow-gold/10'
                      : 'border-forest/60 bg-surface hover:border-forest-light'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-snow">{theme.label}</span>
                    {selectedTheme === theme.id && (
                      <div className="h-5 w-5 rounded-full bg-gold text-background flex items-center justify-center">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted mt-1 leading-snug">
                    {theme.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-surface border border-forest/70 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-snow block">
                  Mesaj ve Süs Kabulü
                </span>
                <span className="text-xs text-muted block">
                  Kapatıldığında ziyaretçiler yeni süs bırakamaz.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptMessages"
                  checked={acceptMessages}
                  onChange={(e) => setAcceptMessages(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-forest-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-snow after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
              </label>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-forest/70 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-snow block">
                  Herkese Açık Ağaç
                </span>
                <span className="text-xs text-muted block">
                  Ağaç bağlantının herkes tarafından görüntülenebilmesi.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-forest-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-snow after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-sm transition-all duration-200 shadow-xl shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Kaydediliyor...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Değişiklikleri Kaydet</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="w-full glass-panel rounded-3xl p-6 flex flex-col items-center text-center">
          <span className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">
            Anlık Önizleme
          </span>
          <h3 className="font-serif text-lg font-bold text-snow mb-4 truncate max-w-full">
            {treeName || 'Yılbaşı Ağacım'}
          </h3>

          <div className="w-full flex items-center justify-center py-2">
            <ChristmasTree
              theme={selectedTheme}
              interactive={false}
              ornaments={[]}
              className="max-h-[380px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
