"use strict";
exports.__esModule = true;
exports.viewport = exports.metadata = void 0;
var script_1 = require("next/script");
require("./globals.css");
var TelegramProvider_1 = require("@/components/TelegramProvider");
exports.metadata = {
    title: 'Pin - Городские задачи на карте',
    description: 'Сервис городских задач на карте'
};
exports.viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "ru" },
        React.createElement("head", null),
        React.createElement("body", null,
            React.createElement("div", { style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                } },
                React.createElement(script_1["default"], { src: "https://telegram.org/js/telegram-web-app.js", strategy: "afterInteractive" }),
                React.createElement(TelegramProvider_1.TelegramProvider, null, children)))));
}
exports["default"] = RootLayout;
