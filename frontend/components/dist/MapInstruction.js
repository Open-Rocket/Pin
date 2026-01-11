'use client';
"use strict";
exports.__esModule = true;
var useTelegram_1 = require("@/hooks/useTelegram");
function MapInstruction() {
    var isTelegram = useTelegram_1.useTelegram().isTelegram;
    // На мобилке (Telegram) не показываем инструкцию
    if (isTelegram) {
        return null;
    }
    return (React.createElement("div", { className: "fixed bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-2 pb-8 px-4 pointer-events-none", style: {
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        } },
        React.createElement("span", { className: "text-3xl animate-bounce", style: { animationDelay: '0s' } }, "\uD83D\uDC46"),
        React.createElement("div", { className: "text-center bg-white bg-opacity-90 px-4 py-2 rounded-lg" },
            React.createElement("p", { className: "text-sm font-medium text-gray-900" }, "\u041A\u043E\u0441\u043D\u0438\u0442\u0435\u0441\u044C \u0442\u043E\u0447\u043A\u0438 \u043D\u0430 \u044D\u043A\u0440\u0430\u043D\u0435 \u0447\u0442\u043E\u0431\u044B \u0441\u043E\u0437\u0434\u0430\u0442\u044C Pin \u0441 \u0437\u0430\u0434\u0430\u0447\u0435\u0439 \u0432 \u044D\u0442\u043E\u043C \u043C\u0435\u0441\u0442\u0435, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: (\u041F\u043E\u0434\u0432\u0435\u0437\u0442\u0438 \u0434\u043E \u0432\u043E\u043A\u0437\u0430\u043B\u0430, \u041A\u0443\u043F\u0438\u0442\u044C \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u044B, \u0421\u0445\u043E\u0434\u0438\u0442\u044C \u0437\u0430 \u043F\u043E\u0441\u044B\u043B\u043A\u043E\u0439 \u0438 \u0442.\u0434)"))));
}
exports["default"] = MapInstruction;
