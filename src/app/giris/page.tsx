'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/app/actions/auth';
import { TreePine, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result && !result.success) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass-panel-gold p-8 sm:p-10 rounded-3xl relative">
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-forest border border-gold/40 flex items-center justify-center text-gold shadow-md">
            <TreePine className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-snow">
            Hoş Geldiniz
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Yılbaşı ağacınızı ve gelen sürpriz mesajlarınızı yönetin.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-snow/90 mb-1">
              E-posta Adresi
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="ornek@mail.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-forest-dark border border-forest/80 focus:border-gold focus:outline-none text-snow text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-snow/90 mb-1">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-forest-dark border border-forest/80 focus:border-gold focus:outline-none text-snow text-sm transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-sm transition-all duration-200 shadow-lg shadow-gold/15 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Giriş Yapılıyor...</span>
              </>
            ) : (
              <>
                <span>Giriş Yap</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-forest/40">
          <p className="text-xs text-muted">
            Henüz ağacını oluşturmadın mı?{' '}
            <Link href="/kayit" className="text-gold font-semibold hover:underline">
              Hemen Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
