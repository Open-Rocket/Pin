'use client';
"use strict";
exports.__esModule = true;
exports.useTelegram = void 0;
var react_1 = require("react");
require("@twa-dev/sdk");
exports.useTelegram = function () {
    var _a;
    var _b = react_1.useState(false), ready = _b[0], setReady = _b[1];
    var _c = react_1.useState(null), webApp = _c[0], setWebApp = _c[1];
    react_1.useEffect(function () {
        if (typeof window === 'undefined') {
            setReady(true);
            return;
        }
        var initialized = false;
        // Функция для проверки и инициализации Telegram WebApp
        var initWebApp = function () {
            var _a, _b, _c, _d, _f, _g, _h;
            if (initialized)
                return;
            try {
                // Проверяем наличие глобального объекта Telegram
                var telegramWebApp = (_a = window.Telegram) === null || _a === void 0 ? void 0 : _a.WebApp;
                // Если есть глобальный объект, используем SDK
                if (telegramWebApp) {
                    if (window.WebApp &&
                        typeof window.WebApp === 'object' &&
                        typeof window.WebApp.ready === 'function') {
                        try {
                            window.WebApp.ready();
                        }
                        catch (e) {
                            console.warn('WebApp.ready() failed:', e);
                        }
                        // 1️⃣ Запрашиваем полноэкранный режим
                        try {
                            (_c = (_b = window.WebApp).expand) === null || _c === void 0 ? void 0 : _c.call(_b);
                        }
                        catch (e) {
                            console.warn('expand not available:', e);
                        }
                        // 2️⃣ Запрещаем закрытие свайпом вниз (WebApp API)
                        try {
                            (_f = (_d = window.WebApp).disallowVerticalSwipe) === null || _f === void 0 ? void 0 : _f.call(_d);
                        }
                        catch (e) {
                            console.warn('disallowVerticalSwipe not available:', e);
                        }
                        // 3️⃣ Блокируем ориентацию экрана в портретный режим
                        try {
                            (_h = (_g = window.WebApp).lockOrientation) === null || _h === void 0 ? void 0 : _h.call(_g);
                        }
                        catch (e) {
                            console.warn('lockOrientation not available:', e);
                        }
                        // Показываем кнопку закрытия приложения
                        if (typeof window.WebApp.showCloseButton === 'function') {
                            window.WebApp.showCloseButton();
                        }
                        // Обработчик для кнопки закрытия
                        if (typeof window.WebApp.onEvent === 'function') {
                            window.WebApp.onEvent('backButtonClicked', function () {
                                // Запрашиваем подтверждение перед закрытием
                                if (window.confirm('Вы уверены, что хотите закрыть приложение?')) {
                                    if (typeof window.WebApp.close === 'function') {
                                        window.WebApp.close();
                                    }
                                }
                            });
                        }
                        // 🔒 ЖЕСТКАЯ БЛОКИРОВКА TOUCH-СОБЫТИЙ (iOS Fix)
                        // Предотвращает закрытие приложения свайпом вниз
                        setupTouchLock();
                        setWebApp(window.WebApp);
                        initialized = true;
                        setReady(true);
                        return true;
                    }
                }
                // Пробуем использовать SDK напрямую
                if (window.WebApp &&
                    typeof window.WebApp === 'object') {
                    var tg_1 = window.WebApp;
                    // Проверяем, что мы в Telegram (есть initDataUnsafe или version)
                    if ((tg_1.initDataUnsafe || tg_1.version) &&
                        typeof tg_1.ready === 'function') {
                        try {
                            tg_1.ready();
                        }
                        catch (e) {
                            console.warn('tg.ready() failed:', e);
                        }
                        // 1️⃣ Запрашиваем полноэкранный режим
                        try {
                            if (typeof tg_1.expand === 'function') {
                                tg_1.expand();
                            }
                        }
                        catch (e) {
                            console.warn('expand not available:', e);
                        }
                        // 2️⃣ Запрещаем закрытие свайпом вниз (WebApp API)
                        try {
                            if (typeof tg_1.disallowVerticalSwipe === 'function') {
                                tg_1.disallowVerticalSwipe();
                            }
                        }
                        catch (e) {
                            console.warn('disallowVerticalSwipe not available:', e);
                        }
                        // 3️⃣ Блокируем ориентацию экрана в портретный режим
                        try {
                            if (typeof tg_1.lockOrientation === 'function') {
                                tg_1.lockOrientation();
                            }
                        }
                        catch (e) {
                            console.warn('lockOrientation not available:', e);
                        }
                        // Показываем кнопку закрытия приложения
                        if (typeof tg_1.showCloseButton === 'function') {
                            tg_1.showCloseButton();
                        }
                        // Обработчик для кнопки закрытия
                        if (typeof tg_1.onEvent === 'function') {
                            tg_1.onEvent('backButtonClicked', function () {
                                // Запрашиваем подтверждение перед закрытием
                                if (window.confirm('Вы уверены, что хотите закрыть приложение?')) {
                                    if (typeof tg_1.close === 'function') {
                                        tg_1.close();
                                    }
                                }
                            });
                        }
                        // 🔒 ЖЕСТКАЯ БЛОКИРОВКА TOUCH-СОБЫТИЙ (iOS Fix)
                        // Предотвращает закрытие приложения свайпом вниз
                        setupTouchLock();
                        setWebApp(tg_1);
                        initialized = true;
                        setReady(true);
                        return true;
                    }
                }
            }
            catch (error) {
                // Работаем вне Telegram
                console.log('Running outside Telegram:', error);
            }
            return false;
        };
        // Пробуем инициализировать сразу
        if (!initWebApp()) {
            // Если не получилось, ждем немного и пробуем снова (на случай, если скрипт еще загружается)
            var timeout_1 = setTimeout(function () {
                if (!initWebApp()) {
                    // В любом случае устанавливаем ready, даже если Telegram не доступен
                    setReady(true);
                }
            }, 200);
            return function () {
                clearTimeout(timeout_1);
            };
        }
    }, []);
    return {
        ready: ready,
        webApp: webApp,
        user: ((_a = webApp === null || webApp === void 0 ? void 0 : webApp.initDataUnsafe) === null || _a === void 0 ? void 0 : _a.user) || null,
        isTelegram: !!(webApp === null || webApp === void 0 ? void 0 : webApp.initDataUnsafe),
        expand: function () { var _a; return (_a = webApp === null || webApp === void 0 ? void 0 : webApp.expand) === null || _a === void 0 ? void 0 : _a.call(webApp); },
        close: function () { var _a; return (_a = webApp === null || webApp === void 0 ? void 0 : webApp.close) === null || _a === void 0 ? void 0 : _a.call(webApp); },
        showAlert: function (message) {
            if (webApp === null || webApp === void 0 ? void 0 : webApp.showAlert) {
                webApp.showAlert(message);
            }
            else {
                alert(message);
            }
        },
        showConfirm: function (message) {
            if (webApp === null || webApp === void 0 ? void 0 : webApp.showConfirm) {
                return webApp.showConfirm(message);
            }
            else {
                return Promise.resolve(window.confirm(message));
            }
        },
        hapticFeedback: function (style) {
            var _a, _b;
            if (style === void 0) { style = 'impact'; }
            (_b = (_a = webApp === null || webApp === void 0 ? void 0 : webApp.HapticFeedback) === null || _a === void 0 ? void 0 : _a.impactOccurred) === null || _b === void 0 ? void 0 : _b.call(_a, style);
        }
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
    if (typeof window === 'undefined')
        return;
    if (window.__telegramMiniAppTouchLockInstalled)
        return;
    // 1️⃣ БЛОКИРУЕМ touchmove НА BODY И HTML (passive: false для preventDefault)
    var preventTouchMove = function (e) {
        // Исключение: разрешаем скролл в специальных контейнерах
        var target = e.target;
        // Проверяем есть ли у элемента класс для скролла
        var scrollableElement = target === null || target === void 0 ? void 0 : target.closest('[data-allow-scroll], .overflow-y-auto, .modal-slide-up, [role="dialog"]');
        // Если скролим внутри разрешенного контейнера - пропускаем
        if (scrollableElement) {
            return;
        }
        // Иначе блокируем touch-событие (предотвращает свайп вниз)
        e.preventDefault();
    };
    // Добавляем слушатель с passive: false (чтобы preventDefault работал)
    var onTouchStart = function (_e) {
        // no-op: ensure touchstart is present for touchmove detection
    };
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', preventTouchMove, { passive: false });
    // 2️⃣ БЛОКИРУЕМ OVERSCROLL ПОВЕДЕНИЕ
    // Это встроенное поведение iOS которое вызывает bounce-эффект
    var html = document.documentElement;
    var body = document.body;
    html.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';
    // 3️⃣ ЗАПРЕЩАЕМ НАТИВНЫЙ SWIPE GESTURE НА УРОВНЕ CSS
    // Добавляем стили если их еще нет
    if (!document.getElementById('telegram-miniapp-lock-styles')) {
        var style = document.createElement('style');
        style.id = 'telegram-miniapp-lock-styles';
        style.textContent = "\n      /* \u0417\u0430\u043F\u0440\u0435\u0449\u0430\u0435\u043C overscroll pull-to-refresh \u043D\u0430 iOS */\n      html, body, #__next {\n        overscroll-behavior: none;\n        overscroll-behavior-y: none;\n        -webkit-user-select: none;\n        user-select: none;\n        -webkit-touch-callout: none;\n        -webkit-tap-highlight-color: transparent;\n      }\n\n      /* \u0413\u0430\u0440\u0430\u043D\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E \u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u043C html, body \u0438 \u043A\u043E\u0440\u043D\u0435\u0432\u043E\u0439 \u043A\u043E\u043D\u0442\u0435\u0439\u043D\u0435\u0440 Next.js */\n      html, body, #__next {\n        position: fixed;\n        width: 100%;\n        height: 100%;\n        overflow: hidden;\n        top: 0;\n        left: 0;\n        margin: 0;\n        padding: 0;\n      }\n\n      /* \u0420\u0430\u0437\u0440\u0435\u0448\u0430\u0435\u043C \u0441\u043A\u0440\u043E\u043B\u043B \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0445 \u043A\u043E\u043D\u0442\u0435\u0439\u043D\u0435\u0440\u0430\u0445 */\n      [data-allow-scroll],\n      .overflow-y-auto,\n      .modal-slide-up,\n      [role=\"dialog\"] {\n        overscroll-behavior: contain;\n        overflow-y: auto;\n        -webkit-overflow-scrolling: touch;\n      }\n    ";
        document.head.appendChild(style);
    }
    // 4️⃣ БЛОКИРУЕМ WHEEL И POINTER СОБЫТИЯ (для мыши)
    var preventWheel = function (e) {
        var target = e.target;
        var scrollableElement = target === null || target === void 0 ? void 0 : target.closest('[data-allow-scroll], .overflow-y-auto');
        if (!scrollableElement) {
            e.preventDefault();
        }
    };
    document.addEventListener('wheel', preventWheel, { passive: false });
    window.__telegramMiniAppTouchLockInstalled = true;
}
// Ensure touch lock is always installed when running in browser
if (typeof window !== 'undefined') {
    try {
        setupTouchLock();
    }
    catch (e) {
        // ignore
    }
}
