'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import {
  TreePine,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface DashboardNavProps {
  username: string;
}

export function DashboardNav({ username }: DashboardNavProps) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const treeUrl = `https://mytree.eternalproduction.net/tree/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(treeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-forest/60 mb-8">
      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
        <Link
          href="/hesabim"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            pathname === '/hesabim'
              ? 'bg-gold text-background shadow-md'
              : 'bg-surface hover:bg-forest/50 text-snow border border-forest/50'
          }`}
        >
          <TreePine className="h-4 w-4" />
          <span>Ağacım & Özet</span>
        </Link>

        <Link
          href="/hesabim/mesajlar"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            pathname === '/hesabim/mesajlar'
              ? 'bg-gold text-background shadow-md'
              : 'bg-surface hover:bg-forest/50 text-snow border border-forest/50'
          }`}
        >
          <Mail className="h-4 w-4" />
          <span>Gelen Mesajlar</span>
        </Link>

        <Link
          href="/hesabim/ayarlar"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            pathname === '/hesabim/ayarlar'
              ? 'bg-gold text-background shadow-md'
              : 'bg-surface hover:bg-forest/50 text-snow border border-forest/50'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Ağaç & Ayarlar</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          className="px-3.5 py-2 rounded-xl bg-forest/50 hover:bg-forest border border-gold/30 text-xs font-medium text-snow flex items-center gap-1.5 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-gold" />
              <span className="text-gold">Kopyalandı</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-gold" />
              <span>Ağaç Linkini Kopyala</span>
            </>
          )}
        </button>

        <Link
          href={`/tree/${username}`}
          target="_blank"
          className="p-2 rounded-xl bg-surface hover:bg-forest/50 border border-forest text-snow hover:text-gold transition-colors"
          title="Herkese Açık Ağacı Gör"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="p-2 rounded-xl bg-surface hover:bg-red-950/40 border border-forest hover:border-red-500/40 text-muted hover:text-red-400 transition-colors"
            title="Çıkış Yap"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
