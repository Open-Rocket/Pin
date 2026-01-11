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
exports.__esModule = true;
var react_1 = require("react");
var useTelegram_1 = require("@/hooks/useTelegram");
function CreatePinForm(_a) {
    var location = _a.location, onClose = _a.onClose, onSubmit = _a.onSubmit;
    var _b = useTelegram_1.useTelegram(), expand = _b.expand, isTelegram = _b.isTelegram;
    var formRef = react_1.useRef(null);
    var _c = react_1.useState(''), title = _c[0], setTitle = _c[1];
    var _d = react_1.useState(''), description = _d[0], setDescription = _d[1];
    var _e = react_1.useState(''), price = _e[0], setPrice = _e[1];
    var _f = react_1.useState('+7 999 999 99 99'), contact = _f[0], setContact = _f[1];
    var _g = react_1.useState({}), errors = _g[0], setErrors = _g[1];
    // Вызываем expand() при открытии формы
    react_1.useEffect(function () {
        if (isTelegram) {
            expand();
            var timeout_1 = setTimeout(function () {
                expand();
            }, 100);
            return function () { return clearTimeout(timeout_1); };
        }
    }, [expand, isTelegram]);
    // Обработчик скролла в форме с debounce
    react_1.useEffect(function () {
        var formElement = formRef.current;
        if (!formElement || !isTelegram)
            return;
        var scrollTimeout;
        var handleScroll = function () {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function () {
                expand();
            }, 50); // Debounce 50ms
        };
        formElement.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('touchmove', handleScroll, { passive: true });
        return function () {
            clearTimeout(scrollTimeout);
            formElement.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('touchmove', handleScroll);
        };
    }, [expand, isTelegram]);
    var handleSubmit = function (e) {
        e.preventDefault();
        var newErrors = {};
        if (!title.trim()) {
            newErrors.title = 'Заголовок обязателен';
        }
        if (!description.trim()) {
            newErrors.description = 'Описание обязательно';
        }
        if (description.length > 500) {
            newErrors.description = 'Описание не должно превышать 500 символов';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        var now = new Date();
        var expiresAt = new Date(now.getTime() + 1 * 60 * 60 * 1000); // 1 hour from now
        onSubmit({
            title: title.trim(),
            description: description.trim(),
            price: price ? parseFloat(price) : undefined,
            contact_info: {
                phone: contact.trim() || undefined
            },
            location: location,
            created_at: now.toISOString(),
            expires_at: expiresAt.toISOString()
        });
    };
    return (React.createElement("div", { className: "fixed inset-0 z-50 flex items-end bg-black bg-opacity-50", onClick: onClose },
        React.createElement("div", { ref: formRef, "data-allow-scroll": true, className: "w-full bg-white rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto modal-slide-up modal-content", onClick: function (e) { return e.stopPropagation(); }, onTouchStart: function () {
                if (isTelegram) {
                    expand();
                }
            }, onTouchMove: function () {
                if (isTelegram) {
                    expand();
                }
            } },
            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("h2", { className: "text-xl font-bold text-gray-900" }, "\u0421\u043E\u0437\u0434\u0430\u0442\u044C Pin"),
                React.createElement("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 text-2xl" }, "\u00D7")),
            React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A Pin-\u0430"),
                    React.createElement("input", { type: "text", value: title, onChange: function (e) {
                            setTitle(e.target.value);
                            setErrors(__assign(__assign({}, errors), { title: '' }));
                        }, placeholder: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A", className: "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 " + (errors.title
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-pin-primary') }),
                    errors.title && (React.createElement("p", { className: "mt-1 text-sm text-red-500" }, errors.title))),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "\u041E\u043F\u0438\u0448\u0438\u0442\u0435 \u0432\u0430\u0448 Pin"),
                    React.createElement("textarea", { value: description, onChange: function (e) {
                            setDescription(e.target.value);
                            setErrors(__assign(__assign({}, errors), { description: '' }));
                        }, placeholder: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435", rows: 4, maxLength: 500, className: "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none " + (errors.description
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-pin-primary') }),
                    React.createElement("div", { className: "flex justify-end mt-1" },
                        React.createElement("span", { className: "text-xs " + (description.length > 450 ? 'text-red-500' : 'text-gray-500') },
                            description.length,
                            "/500")),
                    errors.description && (React.createElement("p", { className: "mt-1 text-sm text-red-500" }, errors.description))),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0432\u044B \u043F\u0440\u0435\u0434\u043B\u0430\u0433\u0430\u0435\u0442\u0435 \u0432 \u20BD?"),
                    React.createElement("input", { type: "number", value: price, onChange: function (e) { return setPrice(e.target.value); }, placeholder: "100\u20BD", min: "0", step: "1", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pin-primary" })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "\u041A\u043E\u043D\u0442\u0430\u043A\u0442 \u0434\u043B\u044F \u0441\u0432\u044F\u0437\u0438 \u0441 \u0432\u0430\u043C\u0438"),
                    React.createElement("input", { type: "tel", value: contact, onChange: function (e) { return setContact(e.target.value); }, placeholder: "+7 999 999 99 99", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pin-primary" })),
                React.createElement("button", { type: "submit", className: "w-full bg-pin-primary text-white py-4 rounded-lg font-medium text-lg hover:bg-opacity-90 transition-colors" }, "\u0420\u0430\u0437\u043C\u0435\u0441\u0442\u0438\u0442\u044C")))));
}
exports["default"] = CreatePinForm;
