'use client';
"use strict";
exports.__esModule = true;
exports.LocateButton = void 0;
var image_1 = require("next/image");
exports.LocateButton = function (_a) {
    var mapRef = _a.mapRef, userLocation = _a.userLocation;
    var handleClick = function () {
        if (!mapRef.current || !userLocation)
            return;
        mapRef.current.getMap().flyTo({
            center: userLocation,
            zoom: 15,
            essential: true
        });
    };
    return (React.createElement("button", { onClick: handleClick, style: {
            position: 'fixed',
            top: 'calc(var(--tg-content-safe-area-inset-top, 0px) + 7%)',
            right: 'calc(var(--tg-content-safe-area-inset-right, 0px) + 5%)',
            width: 60,
            height: 60,
            borderRadius: 14,
            border: '1px solid rgba(200,200,200,0.08)',
            background: 'rgba(200,200,200,0.35)',
            // background: '#fff',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
            color: '#fff'
        }, title: "\u0424\u043E\u043A\u0443\u0441 \u043D\u0430 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435" },
        React.createElement(image_1["default"], { src: "/fluent-color_location-ripple-24.svg", alt: "\u041B\u043E\u043A\u0430\u0446\u0438\u044F", style: { width: '80%', height: '80%' } })));
};
