import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Correct import for Geist Sans
import { GeistMono } from 'geist/font/mono'; // Correct import for Geist Mono
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { TanstackProvider } from '@/providers/tanstack-provider';


export const metadata: Metadata = {
  title: 'CalorieSnap',
  description: 'Count calories by snapping pictures of your food.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
       <TanstackProvider>
          <SidebarProvider>
            <Header />
            <SidebarInset>
              {children}
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
