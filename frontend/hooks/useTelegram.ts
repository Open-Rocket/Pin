'use client';

import { useEffect, useState } from 'react';
import { WebApp } from '@twa-dev/sdk';

export const useTelegram = () => {
  const [ready, setReady] = useState(false);
  const [webApp, setWebApp] = useState<WebApp | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setReady(true);
      return;
    }

    let initialized = false;

    // Функция для проверки и инициализации Telegram WebApp
    const initWebApp = () => {
      if (initialized) return;

      try {
        // Проверяем наличие глобального объекта Telegram
        const telegramWebApp = (window as any).Telegram?.WebApp;

        // Если есть глобальный объект, используем SDK
        if (telegramWebApp) {
          if (
            WebApp &&
            typeof WebApp === 'object' &&
            typeof WebApp.ready === 'function'
          ) {
            WebApp.ready();

            // 1️⃣ Запрашиваем полноэкранный режим
            try {
              if (typeof WebApp.expand === 'function') {
                WebApp.expand();
              }
            } catch (e) {
              console.warn('expand not available:', e);
            }

            // 2️⃣ Запрещаем закрытие свайпом вниз (WebApp API)
            try {
              if (typeof WebApp.disallowVerticalSwipe === 'function') {
                WebApp.disallowVerticalSwipe();
              }
            } catch (e) {
              console.warn('disallowVerticalSwipe not available:', e);
            }

            // 3️⃣ Блокируем ориентацию экрана в портретный режим
            try {
              if (typeof WebApp.lockOrientation === 'function') {
                WebApp.lockOrientation();
              }
            } catch (e) {
              console.warn('lockOrientation not available:', e);
            }

            // Показываем кнопку закрытия приложения
            if (typeof WebApp.showCloseButton === 'function') {
              WebApp.showCloseButton();
            }

            // Обработчик для кнопки закрытия
            if (typeof WebApp.onEvent === 'function') {
              WebApp.onEvent('backButtonClicked', () => {
                // Запрашиваем подтверждение перед закрытием
                if (
                  window.confirm('Вы уверены, что хотите закрыть приложение?')
                ) {
                  if (typeof WebApp.close === 'function') {
                    WebApp.close();
                  }
                }
              });
            }

            // 🔒 ЖЕСТКАЯ БЛОКИРОВКА TOUCH-СОБЫТИЙ (iOS Fix)
            // Предотвращает закрытие приложения свайпом вниз
            setupTouchLock();

            setWebApp(WebApp);
            initialized = true;
            setReady(true);
            return true;
          }
        }

        // Пробуем использовать SDK напрямую
        if (WebApp && typeof WebApp === 'object') {
          const tg = WebApp;
          // Проверяем, что мы в Telegram (есть initDataUnsafe или version)
          if (
            (tg.initDataUnsafe || tg.version) &&
            typeof tg.ready === 'function'
          ) {
            tg.ready();

            // 1️⃣ Запрашиваем полноэкранный режим
            try {
              if (typeof tg.expand === 'function') {
                tg.expand();
              }
            } catch (e) {
              console.warn('expand not available:', e);
            }

            // 2️⃣ Запрещаем закрытие свайпом вниз (WebApp API)
            try {
              if (typeof tg.disallowVerticalSwipe === 'function') {
                tg.disallowVerticalSwipe();
              }
            } catch (e) {
              console.warn('disallowVerticalSwipe not available:', e);
            }

            // 3️⃣ Блокируем ориентацию экрана в портретный режим
            try {
              if (typeof tg.lockOrientation === 'function') {
                tg.lockOrientation();
              }
            } catch (e) {
              console.warn('lockOrientation not available:', e);
            }

            // Показываем кнопку закрытия приложения
            if (typeof tg.showCloseButton === 'function') {
              tg.showCloseButton();
            }

            // Обработчик для кнопки закрытия
            if (typeof tg.onEvent === 'function') {
              tg.onEvent('backButtonClicked', () => {
                // Запрашиваем подтверждение перед закрытием
                if (
                  window.confirm('Вы уверены, что хотите закрыть приложение?')
                ) {
                  if (typeof tg.close === 'function') {
                    tg.close();
                  }
                }
              });
            }

            // 🔒 ЖЕСТКАЯ БЛОКИРОВКА TOUCH-СОБЫТИЙ (iOS Fix)
            // Предотвращает закрытие приложения свайпом вниз
            setupTouchLock();

            setWebApp(tg);
            initialized = true;
            setReady(true);
            return true;
          }
        }
      } catch (error) {
        // Работаем вне Telegram
        console.log('Running outside Telegram:', error);
      }

      return false;
    };

    // Пробуем инициализировать сразу
    if (!initWebApp()) {
      // Если не получилось, ждем немного и пробуем снова (на случай, если скрипт еще загружается)
      const timeout = setTimeout(() => {
        if (!initWebApp()) {
          // В любом случае устанавливаем ready, даже если Telegram не доступен
          setReady(true);
        }
      }, 200);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, []);

  return {
    ready,
    webApp,
    user: webApp?.initDataUnsafe?.user || null,
    isTelegram: !!webApp?.initDataUnsafe,
    expand: () => webApp?.expand?.(),
    close: () => webApp?.close?.(),
    showAlert: (message: string) => {
      if (webApp?.showAlert) {
        webApp.showAlert(message);
      } else {
        alert(message);
      }
    },
    showConfirm: (message: string) => {
      if (webApp?.showConfirm) {
        return webApp.showConfirm(message);
      } else {
        return Promise.resolve(window.confirm(message));
      }
    },
    hapticFeedback: (
      style: 'impact' | 'notification' | 'selection' = 'impact'
    ) => {
      webApp?.HapticFeedback?.impactOccurred?.(style);
    },
  };
};

/**
 * 🔒 ЖЕСТКАЯ БЛОКИРОВКА TOUCH-СОБЫТИЙ ДЛЯ iOS TELEGRAM
 *
 * ПРОБЛЕМА: disallowVerticalSwipe() часто не работает на iOS
 * РЕШЕНИЕ: Блокируем touch-события на уровне JavaScript
 *
 * Это предотвращает:
 * - Закрытие приложения свайпом вниз
 * - Overscroll на body/html
 * - Нежелательный скролл window
 */
function setupTouchLock() {
  if (typeof window === 'undefined') return;

  // 1️⃣ БЛОКИРУЕМ touchmove НА BODY И HTML (passive: false для preventDefault)
  const preventTouchMove = (e: TouchEvent) => {
    // Исключение: разрешаем скролл в специальных контейнерах
    const target = e.target as HTMLElement;

    // Проверяем есть ли у элемента класс для скролла
    const scrollableElement = target?.closest(
      '[data-allow-scroll], .overflow-y-auto, .modal-slide-up, [role="dialog"]'
    );

    // Если скролим внутри разрешенного контейнера - пропускаем
    if (scrollableElement) {
      return;
    }

    // Иначе блокируем touch-событие (предотвращает свайп вниз)
    e.preventDefault();
  };

  // Добавляем слушатель с passive: false (чтобы preventDefault работал)
  document.addEventListener('touchmove', preventTouchMove, { passive: false });
  document.body.addEventListener('touchmove', preventTouchMove, {
    passive: false,
  });

  // 2️⃣ БЛОКИРУЕМ OVERSCROLL ПОВЕДЕНИЕ
  // Это встроенное поведение iOS которое вызывает bounce-эффект
  const html = document.documentElement;
  const body = document.body;

  html.style.overscrollBehavior = 'none';
  body.style.overscrollBehavior = 'none';

  // 3️⃣ ЗАПРЕЩАЕМ НАТИВНЫЙ SWIPE GESTURE НА УРОВНЕ CSS
  // Добавляем стили если их еще нет
  if (!document.getElementById('telegram-miniapp-lock-styles')) {
    const style = document.createElement('style');
    style.id = 'telegram-miniapp-lock-styles';
    style.textContent = `
      /* Запрещаем overscroll pull-to-refresh на iOS */
      html, body {
        overscroll-behavior: none;
        overscroll-behavior-y: none;
        -webkit-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }

      /* Гарантированно фиксируем html и body */
      html {
        position: fixed;
        width: 100%;
        height: 100%;
        overflow: hidden;
        top: 0;
        left: 0;
      }

      body {
        position: fixed;
        width: 100%;
        height: 100%;
        overflow: hidden;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
      }

      /* Разрешаем скролл только в специальных контейнерах */
      [data-allow-scroll],
      .overflow-y-auto,
      .modal-slide-up,
      [role="dialog"] {
        overscroll-behavior: contain;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(style);
  }

  // 4️⃣ БЛОКИРУЕМ WHEEL И POINTER СОБЫТИЯ (для мыши)
  const preventWheel = (e: WheelEvent) => {
    const target = e.target as HTMLElement;
    const scrollableElement = target?.closest(
      '[data-allow-scroll], .overflow-y-auto'
    );

    if (!scrollableElement) {
      e.preventDefault();
    }
  };

  document.addEventListener('wheel', preventWheel, { passive: false });

  // 5️⃣ ЛОГИРОВАНИЕ (для отладки)
  console.log('🔒 Telegram Mini App Touch Lock активирована');
  console.log('✅ Свайп вниз заблокирован');
  console.log('✅ Overscroll поведение запрещено');
  console.log('✅ Body/HTML фиксированы');
}
