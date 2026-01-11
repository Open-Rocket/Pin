import { WebApp } from '@twa-dev/sdk'

export const initTelegram = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    // Проверяем наличие глобального объекта Telegram
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const webApp = WebApp
      if (webApp && typeof webApp.ready === 'function') {
        webApp.ready()
        return webApp
      }
    }
    
    // Пробуем использовать SDK напрямую, если он доступен
    if (WebApp && typeof WebApp === 'object' && typeof WebApp.ready === 'function') {
      WebApp.ready()
      return WebApp
    }
  } catch (error) {
    console.log('Telegram WebApp not available:', error)
  }
  
  return null
}

export const getTelegramUser = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const webApp = WebApp
    if (webApp?.initDataUnsafe?.user) {
      return webApp.initDataUnsafe.user
    }
  } catch (error) {
    console.log('Telegram WebApp not available:', error)
  }
  
  return null
}
