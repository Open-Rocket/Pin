'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
function ContactModal(_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onSave = _a.onSave, _b = _a.initialContact, initialContact = _b === void 0 ? '+7 976 888 76 55' : _b;
    var _c = react_1.useState(initialContact), contact = _c[0], setContact = _c[1];
    if (!isOpen)
        return null;
    var handleSave = function () {
        if (contact.trim()) {
            onSave(contact.trim());
            onClose();
        }
    };
    return (React.createElement("div", { className: "fixed inset-0 z-50 flex items-end bg-black bg-opacity-50", onClick: onClose },
        React.createElement("div", { "data-allow-scroll": true, className: "w-full bg-white rounded-t-3xl p-6 modal-slide-up", onClick: function (e) { return e.stopPropagation(); } },
            React.createElement("h3", { className: "text-lg font-semibold text-gray-900 mb-4" }, "\u041A\u043E\u043D\u0442\u0430\u043A\u0442 \u0434\u043B\u044F \u0441\u0432\u044F\u0437\u0438 \u0441 \u0432\u0430\u043C\u0438"),
            React.createElement("input", { type: "tel", value: contact, onChange: function (e) { return setContact(e.target.value); }, placeholder: "+7 999 999 99 99", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pin-primary mb-4" }),
            React.createElement("div", { className: "flex gap-3" },
                React.createElement("button", { onClick: onClose, className: "flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50" }, "\u041E\u0442\u043C\u0435\u043D\u0430"),
                React.createElement("button", { onClick: handleSave, className: "flex-1 py-3 bg-pin-primary text-white rounded-lg font-medium hover:bg-opacity-90" }, "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C")))));
}
exports["default"] = ContactModal;
