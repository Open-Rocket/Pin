'use client'

import { useEffect } from 'react'
import { initTelegram } from '@/lib/telegram'

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Безопасная инициализация Telegram
    try {
      initTelegram()
    } catch (error) {
      // Игнорируем ошибки инициализации - приложение должно работать и без Telegram
      console.log('Telegram initialization failed:', error)
    }
  }, [])

  return <>{children}</>
}
