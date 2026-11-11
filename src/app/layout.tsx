import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';
import { SnowEffect } from '@/components/SnowEffect';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Eternal MyTree — Dijital Yılbaşı Ağacı ve Mesaj Platformu',
  description:
    'Kendi dijital yılbaşı ağacını oluştur, arkadaşlarınla paylaş, sürpriz süsler ve yeni yıl dilekleri topla.',
  keywords: ['yılbaşı ağacı', 'deco my tree', 'dijital ağaç', 'christmas tree', 'yeni yıl mesajı'],
  metadataBase: new URL('https://mytree.eternalproduction.net'),
  openGraph: {
    title: 'Eternal MyTree — Dijital Yılbaşı Ağacı',
    description: 'Arkadaşlarından yeni yıl süsleri ve sürpriz mesajlar al!',
    url: 'https://mytree.eternalproduction.net',
    siteName: 'Eternal MyTree',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      const profileRow = profile as { username?: string; is_admin?: boolean } | null;
      if (profileRow) {
        user = {
          username: profileRow.username,
          isAdmin: Boolean(profileRow.is_admin),
        };
      }
    }
  } catch {
    // If supabase env not provided or offline, gracefully continue
  }

  return (
    <html lang="tr" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-snow font-sans antialiased selection:bg-gold/30 selection:text-gold-light">
        <SnowEffect />
        <Navbar user={user} />
        <main className="flex-1 relative z-10 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
