"use strict";
exports.__esModule = true;
exports.getTelegramUser = exports.initTelegram = void 0;
require("@twa-dev/sdk");
exports.initTelegram = function () {
    var _a;
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        var webApp = ((_a = window.Telegram) === null || _a === void 0 ? void 0 : _a.WebApp) || window.WebApp || null;
        if (webApp && typeof webApp.ready === 'function') {
            try {
                webApp.ready();
            }
            catch (e) {
                console.warn('webApp.ready() failed:', e);
            }
            return webApp;
        }
    }
    catch (error) {
        console.log('Telegram WebApp not available:', error);
    }
    return null;
};
exports.getTelegramUser = function () {
    var _a, _b;
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        var webApp = window.WebApp || ((_a = window.Telegram) === null || _a === void 0 ? void 0 : _a.WebApp) || null;
        if ((_b = webApp === null || webApp === void 0 ? void 0 : webApp.initDataUnsafe) === null || _b === void 0 ? void 0 : _b.user) {
            return webApp.initDataUnsafe.user;
        }
    }
    catch (error) {
        console.log('Telegram WebApp not available:', error);
    }
    return null;
};
