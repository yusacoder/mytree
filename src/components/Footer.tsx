import React from 'react';
import Link from 'next/link';
import { TreePine, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-forest/40 bg-surface/80 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest border border-gold/30">
            <TreePine className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="font-serif text-sm font-semibold text-snow flex items-center gap-1.5">
              Eternal MyTree <Sparkles className="h-3 w-3 text-gold" />
            </p>
            <p className="text-xs text-muted">
              Online Christmas Tree Decoration & Message Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-muted">
          <Link href="/" className="hover:text-gold transition-colors">
            Ana Sayfa
          </Link>
          <Link href="/kayit" className="hover:text-gold transition-colors">
            Ağaç Oluştur
          </Link>
          <Link href="/giris" className="hover:text-gold transition-colors">
            Giriş Yap
          </Link>
          <Link href="/admin/giris" className="hover:text-gold transition-colors">
            Yönetim
          </Link>
        </div>

        <div className="text-xs text-muted flex items-center gap-1.5">
          <span>&copy; {new Date().getFullYear()} Eternal MyTree. Sevgiyle hazırlandı.</span>
        </div>
      </div>
    </footer>
  );
}
