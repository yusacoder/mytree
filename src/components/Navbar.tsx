'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, TreePine, Menu, X, Shield, User } from 'lucide-react';

interface NavbarProps {
  user?: {
    username?: string;
    isAdmin?: boolean;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-forest/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest border border-gold/40 shadow-inner group-hover:border-gold transition-colors">
            <TreePine className="h-6 w-6 text-gold" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-wide text-snow flex items-center gap-1.5">
              Eternal <span className="text-gold">MyTree</span>
              <Sparkles className="h-3.5 w-3.5 text-gold/80" />
            </span>
            <span className="text-[10px] tracking-wider text-muted uppercase">
              Digital Holiday Tree
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-gold ${
              isActive('/') ? 'text-gold' : 'text-snow/80'
            }`}
          >
            Ana Sayfa
          </Link>
          <Link
            href="/#nasil-calisir"
            className="text-sm font-medium text-snow/80 hover:text-gold transition-colors"
          >
            Nasıl Çalışır?
          </Link>

          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-forest/60">
              <Link
                href="/hesabim"
                className={`text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-gold ${
                  pathname.startsWith('/hesabim') ? 'text-gold' : 'text-snow/80'
                }`}
              >
                <User className="h-4 w-4 text-gold" />
                Panelim
              </Link>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium flex items-center gap-1.5 text-gold/90 hover:text-gold bg-forest/40 px-3 py-1.5 rounded-lg border border-gold/30"
                >
                  <Shield className="h-4 w-4" />
                  Yönetici
                </Link>
              )}
              <Link
                href="/hesabim/ayarlar"
                className="text-xs text-muted hover:text-snow"
              >
                {user.username ? `@${user.username}` : 'Ayarlar'}
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-forest/60">
              <Link
                href="/giris"
                className="text-sm font-medium text-snow/90 hover:text-gold px-3 py-1.5 rounded-lg transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit"
                className="text-sm font-medium bg-gold hover:bg-gold-light text-background font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-gold/10 hover:shadow-gold/20"
              >
                Ağacını Oluştur
              </Link>
            </div>
          )}
        </nav>

        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-snow hover:text-gold rounded-lg focus:outline-none"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-forest bg-surface px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-snow hover:text-gold"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/#nasil-calisir"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-snow hover:text-gold"
          >
            Nasıl Çalışır?
          </Link>

          {user ? (
            <>
              <Link
                href="/hesabim"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-gold"
              >
                Kullanıcı Paneli
              </Link>
              <Link
                href="/hesabim/mesajlar"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-snow hover:text-gold"
              >
                Gelen Mesajlar
              </Link>
              <Link
                href="/hesabim/ayarlar"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-snow hover:text-gold"
              >
                Ayarlar
              </Link>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-gold"
                >
                  Yönetici Paneli
                </Link>
              )}
            </>
          ) : (
            <div className="pt-4 border-t border-forest/60 space-y-2">
              <Link
                href="/giris"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-xl border border-forest text-snow font-medium"
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-xl bg-gold text-background font-semibold"
              >
                Kayıt Ol & Ağacını Oluştur
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
