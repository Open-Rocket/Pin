'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var dynamic_1 = require("next/dynamic");
var CreatePinForm_1 = require("./CreatePinForm");
var ContactModal_1 = require("./ContactModal");
var PinCard_1 = require("./PinCard");
var MapInstruction_1 = require("./MapInstruction");
var useTelegram_1 = require("@/hooks/useTelegram");
var api_1 = require("@/lib/api");
// Динамический импорт карты для избежания SSR проблем
var Map = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require('./Map'); }); }, {
    ssr: false,
    loading: function () { return (React.createElement("div", { className: "w-full h-full flex items-center justify-center bg-telegram-secondary-bg" },
        React.createElement("span", { className: "text-telegram-text" }, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043A\u0430\u0440\u0442\u044B..."))); }
});
function MapView() {
    var _this = this;
    var _a = useTelegram_1.useTelegram(), expand = _a.expand, isTelegram = _a.isTelegram;
    var _b = react_1.useState([]), pins = _b[0], setPins = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState(false), showCreateForm = _d[0], setShowCreateForm = _d[1];
    var _e = react_1.useState(false), showContactModal = _e[0], setShowContactModal = _e[1];
    var _f = react_1.useState(null), selectedLocation = _f[0], setSelectedLocation = _f[1];
    var _g = react_1.useState(null), selectedPin = _g[0], setSelectedPin = _g[1];
    var _h = react_1.useState('+7 976 888 76 55'), userContact = _h[0], setUserContact = _h[1];
    // Загружаем пины при монтировании
    react_1.useEffect(function () {
        loadPins();
    }, []);
    // Загрузка пинов с API
    var loadPins = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, pinsArray, pinsWithOwner, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    console.log('Loading pins from:', '/pins');
                    return [4 /*yield*/, api_1.api.get('/pins')];
                case 1:
                    data = _a.sent();
                    console.log('Raw data received:', data);
                    pinsArray = Array.isArray(data) ? data : [];
                    console.log('Pins array:', pinsArray);
                    pinsWithOwner = pinsArray.map(function (pin, index) {
                        var pinWithOwner = __assign(__assign({}, pin), { is_own: index === 0 });
                        console.log('Pin with owner:', pinWithOwner);
                        return pinWithOwner;
                    });
                    console.log('Setting pins:', pinsWithOwner);
                    setPins(pinsWithOwner);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error loading pins:', error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Вызываем expand() только при явных действиях пользователя с модальными окнами
    // НЕ вызываем при скролле - это вызывает сворачивание приложения в Telegram
    react_1.useEffect(function () {
        if (isTelegram && (selectedPin || showCreateForm || showContactModal)) {
            expand();
        }
    }, [selectedPin, showCreateForm, showContactModal, expand, isTelegram]);
    var handleMapMove = react_1.useCallback(function (center) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    }); }, []);
    var handleMapClick = react_1.useCallback(function (lat, lng) {
        // Если открыта карточка Pin, закрываем её
        if (selectedPin) {
            setSelectedPin(null);
            return;
        }
        // Иначе открываем форму создания Pin
        setSelectedLocation({ lat: lat, lng: lng });
        setShowCreateForm(true);
    }, [selectedPin]);
    var handlePinClick = react_1.useCallback(function (pin) {
        setSelectedPin(pin);
        // Закрываем форму создания, если она открыта
        setShowCreateForm(false);
        setSelectedLocation(null);
        // Вызываем expand() при открытии карточки
        if (isTelegram) {
            expand();
        }
    }, [expand, isTelegram]);
    var handleCreatePin = react_1.useCallback(function (data) { return __awaiter(_this, void 0, void 0, function () {
        var newPin, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, api_1.api.post('/pins', __assign(__assign({}, data), { owner_id: 'user-' + Date.now(), is_own: true, views_count: 0, is_active: true }))];
                case 1:
                    newPin = _a.sent();
                    // Добавляем новый Pin в список
                    setPins(__spreadArrays(pins, [newPin]));
                    setShowCreateForm(false);
                    setSelectedLocation(null);
                    // Показываем уведомление об успехе
                    if (typeof alert !== 'undefined') {
                        alert('Pin успешно создан!');
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error creating pin:', error_2);
                    if (typeof alert !== 'undefined') {
                        alert('Ошибка при создании Pin');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [pins]);
    var handleSaveContact = react_1.useCallback(function (contact) {
        setUserContact(contact);
        console.log('Saving contact:', contact);
    }, []);
    var handleDeletePin = react_1.useCallback(function (pinId) { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    // Удаляем с API
                    return [4 /*yield*/, api_1.api["delete"]("/pins/" + pinId)];
                case 1:
                    // Удаляем с API
                    _a.sent();
                    // Удаляем из локального списка
                    setPins(pins.filter(function (pin) { return pin.id !== pinId; }));
                    return [3 /*break*/, 4];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error deleting pin:', error_3);
                    alert('Ошибка при удалении Pin');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [pins]);
    var handleUpdatePinLocation = react_1.useCallback(function (pinId, lat, lng) { return __awaiter(_this, void 0, void 0, function () {
        var updatedPin, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, api_1.api.patch("/pins/" + pinId, {
                            location: { lat: lat, lng: lng }
                        })];
                case 1:
                    updatedPin = _a.sent();
                    // Обновляем в локальном списке
                    setPins(pins.map(function (pin) {
                        return pin.id === pinId ? __assign(__assign({}, pin), { location: { lat: lat, lng: lng } }) : pin;
                    }));
                    return [3 /*break*/, 4];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error updating pin location:', error_4);
                    alert('Ошибка при обновлении локации');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [pins]);
    return (React.createElement("div", { className: "w-full h-screen relative" },
        React.createElement(Map, { pins: pins, onMapMove: handleMapMove, onMapClick: handleMapClick, onPinClick: handlePinClick, onPinLocationChange: handleUpdatePinLocation }),
        React.createElement(MapInstruction_1["default"], null),
        loading && (React.createElement("div", { className: "absolute top-4 left-1/2 transform -translate-x-1/2 z-10" },
            React.createElement("div", { className: "bg-telegram-bg px-4 py-2 rounded-lg shadow-lg" },
                React.createElement("span", { className: "text-telegram-text" }, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...")))),
        showCreateForm && selectedLocation && (React.createElement(CreatePinForm_1["default"], { location: selectedLocation, onClose: function () {
                setShowCreateForm(false);
                setSelectedLocation(null);
            }, onSubmit: handleCreatePin })),
        React.createElement(ContactModal_1["default"], { isOpen: showContactModal, onClose: function () { return setShowContactModal(false); }, onSave: handleSaveContact, initialContact: userContact }),
        selectedPin && (React.createElement(PinCard_1["default"], { pin: selectedPin, onClose: function () { return setSelectedPin(null); }, onDelete: handleDeletePin }))));
}
exports["default"] = MapView;
