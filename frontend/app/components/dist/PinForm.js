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
var framer_motion_1 = require("framer-motion");
function PinForm(_a) {
    var _this = this;
    var location = _a.location, sheetVisible = _a.sheetVisible, onClose = _a.onClose, onSubmit = _a.onSubmit;
    var _b = react_1.useState(''), description = _b[0], setDescription = _b[1];
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var tgUser;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    e.preventDefault();
                    if (!description.trim())
                        return [2 /*return*/];
                    tgUser = (_c = (_b = (_a = window.Telegram) === null || _a === void 0 ? void 0 : _a.WebApp) === null || _b === void 0 ? void 0 : _b.initDataUnsafe) === null || _c === void 0 ? void 0 : _c.user;
                    if (!onSubmit) return [3 /*break*/, 2];
                    return [4 /*yield*/, onSubmit({
                            description: description.trim(),
                            location: location,
                            userId: (_e = (_d = tgUser === null || tgUser === void 0 ? void 0 : tgUser.id) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : 'anonymous',
                            created_at: new Date().toISOString(),
                            expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
                            userPhoto: tgUser === null || tgUser === void 0 ? void 0 : tgUser.photo_url
                        })];
                case 1:
                    _f.sent();
                    _f.label = 2;
                case 2:
                    setDescription('');
                    onClose();
                    return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        document.body.style.overflow = sheetVisible ? 'hidden' : '';
        document.body.style.touchAction = sheetVisible ? 'none' : '';
    }, [sheetVisible]);
    var isValid = description.trim() !== '';
    return (React.createElement(framer_motion_1.AnimatePresence, null, sheetVisible && (React.createElement(framer_motion_1.motion.div, { className: "fixed inset-0 z-50 bg-black/30", onClick: function (e) { return e.target === e.currentTarget && onClose(); }, initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0.2 }, style: { zIndex: 999 } },
        React.createElement(framer_motion_1.motion.div, { onClick: function (e) { return e.stopPropagation(); }, className: "fixed bottom-0 left-0 w-full bg-white rounded-t-[24px] px-6 pt-3 pb-6 max-h-[80vh] overflow-y-auto", initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' }, transition: { duration: 0.2 } },
            React.createElement("form", { onSubmit: handleSubmit, className: "space-y-2" },
                React.createElement("div", { className: "flex justify-between items-center mb-6" },
                    React.createElement("h2", { className: "text-xl font-bold text-gray-900" }, "Pin"),
                    React.createElement("div", { className: "text-right text-xs text-gray-500" },
                        description.length,
                        "/60")),
                React.createElement("textarea", { value: description, onChange: function (e) { return setDescription(e.target.value); }, placeholder: "\u041E\u0441\u0442\u0430\u0432\u044C \u043C\u044B\u0441\u043B\u044C, \u0441\u0442\u0430\u0442\u0443\u0441 \u0438\u043B\u0438 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435", rows: 3, maxLength: 60, className: "w-full px-4 py-3 border bg-white border-gray-300 rounded-[24px] text-black resize-none caret-black focus:outline-none focus:ring-2 focus:ring-pin-primary" }),
                React.createElement("button", { type: "submit", disabled: !isValid, className: "w-full h-16 mt-[10px] rounded-full transition-colors border " + (isValid
                        ? 'bg-black text-white border-black'
                        : 'bg-transparent text-black border-black') }, "\u0421\u043E\u0437\u0434\u0430\u0442\u044C")))))));
}
exports["default"] = PinForm;
