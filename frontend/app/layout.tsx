import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { TelegramProvider } from '@/components/TelegramProvider';

export const metadata: Metadata = {
  title: 'Pin - Городские задачи на карте',
  description: 'Сервис городских задач на карте',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head />
      <body>
        {/* Главный фиксированный контейнер */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Script
            src="https://telegram.org/js/telegram-web-app.js"
            strategy="afterInteractive"
          />
          <TelegramProvider>
            <div
              id="app-container"
              data-allow-scroll
              style={{
                width: '100%',
                height: '100%',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {children}
            </div>
          </TelegramProvider>
        </div>
      </body>
    </html>
  );
}
