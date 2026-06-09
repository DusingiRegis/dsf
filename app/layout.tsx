import './globals.css';
import { Providers } from './providers';
import { VisitTracker } from '@/components/public/VisitTracker';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <VisitTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
