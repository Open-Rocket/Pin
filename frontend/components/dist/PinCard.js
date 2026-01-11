'use client';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var useTelegram_1 = require("@/hooks/useTelegram");
function PinCard(_a) {
    var _this = this;
    var _b;
    var pin = _a.pin, onClose = _a.onClose, onDelete = _a.onDelete;
    var _c = useTelegram_1.useTelegram(), expand = _c.expand, isTelegram = _c.isTelegram;
    var cardRef = react_1.useRef(null);
    // Вызываем expand() при открытии карточки
    react_1.useEffect(function () {
        if (isTelegram) {
            expand();
        }
    }, [expand, isTelegram]);
    // Обработчик скролла внутри карточки с debounce
    react_1.useEffect(function () {
        var cardElement = cardRef.current;
        if (!cardElement || !isTelegram)
            return;
        var scrollTimeout;
        var handleScroll = function () {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function () {
                expand();
            }, 50); // Debounce 50ms
        };
        // Слушаем скролл только внутри карточки, не на window
        cardElement.addEventListener('scroll', handleScroll, { passive: true });
        return function () {
            clearTimeout(scrollTimeout);
            cardElement.removeEventListener('scroll', handleScroll);
        };
    }, [expand, isTelegram]);
    var handleDeletePin = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (window.confirm('Вы уверены, что хотите удалить этот Pin?')) {
                try {
                    if (onDelete) {
                        onDelete(pin.id);
                    }
                    onClose();
                }
                catch (error) {
                    console.error('Error deleting pin:', error);
                    alert('Ошибка при удалении Pin');
                }
            }
            return [2 /*return*/];
        });
    }); };
    return (React.createElement("div", { ref: cardRef, "data-allow-scroll": true, className: "fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl modal-slide-up max-h-[80vh] overflow-y-auto", onClick: function (e) {
            // Закрываем при клике на фон (не на контент)
            if (e.target === e.currentTarget) {
                onClose();
            }
        }, onTouchStart: function () {
            // Вызываем expand() при начале касания
            if (isTelegram) {
                expand();
            }
        }, onTouchMove: function () {
            // Вызываем expand() при движении (скролле)
            if (isTelegram) {
                expand();
            }
        } },
        React.createElement("div", { className: "p-6", onClick: function (e) { return e.stopPropagation(); } },
            React.createElement("div", { className: "flex justify-end mb-4" },
                React.createElement("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 text-2xl font-light w-8 h-8 flex items-center justify-center" }, "\u00D7")),
            React.createElement("h2", { className: "text-xl font-bold text-gray-900 mb-3" }, pin.title),
            React.createElement("p", { className: "text-gray-700 mb-4 leading-relaxed" }, pin.description),
            pin.price && (React.createElement("div", { className: "mb-4" },
                React.createElement("span", { className: "text-2xl font-bold text-pin-primary" },
                    pin.price,
                    "\u20BD"))),
            ((_b = pin.contact_info) === null || _b === void 0 ? void 0 : _b.phone) && !pin.is_own && (React.createElement("div", { className: "mb-6" },
                React.createElement("p", { className: "text-sm text-gray-500 mb-3" }, "\u041A\u043E\u043D\u0442\u0430\u043A\u0442:"),
                React.createElement("button", { onClick: function () {
                        var _a;
                        // Предлагаем звонок
                        var phoneNumber = (_a = pin.contact_info.phone) === null || _a === void 0 ? void 0 : _a.replace(/\D/g, '');
                        if (phoneNumber) {
                            // Попытка открыть приложение телефонии
                            window.location.href = "tel:" + phoneNumber;
                        }
                    }, className: "w-full bg-pin-primary text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2" },
                    React.createElement("span", null, "\uD83D\uDCDE"),
                    React.createElement("span", null, "\u0421\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F")))),
            pin.is_own && (React.createElement("button", { onClick: handleDeletePin, className: "w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors" }, "\u0423\u0434\u0430\u043B\u0438\u0442\u044C Pin")),
            React.createElement("div", { className: "text-xs text-gray-400 mt-4" },
                "\u0421\u043E\u0437\u0434\u0430\u043D:",
                ' ',
                (function () {
                    try {
                        var date = new Date(pin.created_at);
                        // Проверяем валидность даты
                        if (isNaN(date.getTime())) {
                            console.warn('Invalid date:', pin.created_at);
                            return 'Дата неизвестна';
                        }
                        return date.toLocaleString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    }
                    catch (e) {
                        console.error('Date parsing error:', e, pin.created_at);
                        return 'Ошибка даты';
                    }
                })()))));
}
exports["default"] = PinCard;
