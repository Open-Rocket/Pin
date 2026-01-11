import '@twa-dev/sdk';

export const initTelegram = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const webApp =
      (window as any).Telegram?.WebApp || (window as any).WebApp || null;
    if (webApp && typeof webApp.ready === 'function') {
      try {
        webApp.ready();
      } catch (e) {
        console.warn('webApp.ready() failed:', e);
      }
      return webApp;
    }
  } catch (error) {
    console.log('Telegram WebApp not available:', error);
  }

  return null;
};

export const getTelegramUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const webApp =
      (window as any).WebApp || (window as any).Telegram?.WebApp || null;
    if (webApp?.initDataUnsafe?.user) {
      return webApp.initDataUnsafe.user;
    }
  } catch (error) {
    console.log('Telegram WebApp not available:', error);
  }

  return null;
};
