'use client';
import { useEffect } from 'react';

export function TelegramInit() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      if (!tg) return;

      tg.ready();

      tg.requestFullscreen?.();
      tg.disableVerticalSwipes?.();
      tg.requestLocation?.();
    }
  }, []);

  return null;
}
