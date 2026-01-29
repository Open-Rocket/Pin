'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var dynamic_1 = require("next/dynamic");
var maplibre_gl_1 = require("maplibre-gl");
require("maplibre-gl/dist/maplibre-gl.css");
var UserLocation_1 = require("./UserLocation");
var PitchSlider_1 = require("./PitchSlider");
var Map = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require('react-map-gl/maplibre'); }).then(function (mod) { return mod.Map; }); }, { ssr: false });
var STORAGE_KEY = 'userThought'; // ключ для DeviceStorage
function GlobeMap() {
    var _a, _b;
    var mapRef = react_1.useRef(null);
    var markerRef = react_1.useRef(null);
    var _c = react_1.useState(null), userLocation = _c[0], setUserLocation = _c[1];
    var _d = react_1.useState(false), mapLoaded = _d[0], setMapLoaded = _d[1];
    var _e = react_1.useState('hello'), thought = _e[0], setThought = _e[1]; // мысль над головой
    var handleMapLoad = function () { return setMapLoaded(true); };
    // ===== Загрузка мысли из DeviceStorage при инициализации =====
    react_1.useEffect(function () {
        var _a, _b;
        var tg = (_a = window.Telegram) === null || _a === void 0 ? void 0 : _a.WebApp;
        if (!((_b = tg === null || tg === void 0 ? void 0 : tg.DeviceStorage) === null || _b === void 0 ? void 0 : _b.getItem))
            return;
        tg.DeviceStorage.getItem(STORAGE_KEY, function (err, value) {
            if (!err && value) {
                setThought(value);
            }
        });
    }, []);
    react_1.useEffect(function () {
        var _a, _b, _c;
        if (!mapLoaded || !mapRef.current || !userLocation)
            return;
        var map = mapRef.current.getMap();
        // Фокус при входе в апку
        map.flyTo({
            center: userLocation,
            zoom: 1,
            essential: true
        });
        // Удаляем предыдущий маркер
        if (markerRef.current) {
            markerRef.current.remove();
            markerRef.current = null;
        }
        var tg = (_a = window.Telegram) === null || _a === void 0 ? void 0 : _a.WebApp;
        var photoUrl = (_c = (_b = tg === null || tg === void 0 ? void 0 : tg.initDataUnsafe) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.photo_url;
        if (!photoUrl)
            return;
        // === Основной маркер пользователя ===
        var wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '52px';
        wrapper.style.height = '52px';
        wrapper.style.padding = '2px';
        wrapper.style.borderRadius = '50%';
        wrapper.style.background = '#000';
        wrapper.style.boxShadow = '0 4px 10px rgba(0,0,0,0.35)';
        wrapper.style.cursor = 'pointer';
        wrapper.onclick = function () {
            map.flyTo({
                center: userLocation,
                zoom: 10,
                essential: true
            });
        };
        var img = document.createElement('img');
        img.src = photoUrl;
        img.style.width = '48px';
        img.style.height = '48px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        img.style.display = 'block';
        wrapper.appendChild(img);
        // === Облачко с мыслью ===
        var bubble = document.createElement('div');
        bubble.textContent = thought || '...';
        bubble.style.position = 'absolute';
        bubble.style.bottom = '90%';
        bubble.style.left = '50%';
        bubble.style.transform = 'translateX(-50%) translateY(-10px)';
        bubble.style.padding = '6px 10px';
        bubble.style.borderRadius = '20px';
        bubble.style.background = 'rgba(0,0,0,0.80)';
        bubble.style.color = '#fff';
        bubble.style.fontSize = '12px';
        bubble.style.textAlign = 'center';
        bubble.style.cursor = 'pointer';
        bubble.style.userSelect = 'none';
        bubble.style.minWidth = '100px';
        bubble.style.maxWidth = '180px';
        bubble.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        bubble.onclick = function (e) {
            var _a;
            e.stopPropagation();
            var newThought = prompt('Ваша мысль (до 30 символов)', thought);
            if (newThought !== null) {
                var trimmed = newThought.slice(0, 30);
                var finalThought = newThought.trim() ? trimmed : thought;
                bubble.textContent = finalThought;
                setThought(finalThought);
                // ===== Сохраняем в DeviceStorage =====
                (_a = tg === null || tg === void 0 ? void 0 : tg.DeviceStorage) === null || _a === void 0 ? void 0 : _a.setItem(STORAGE_KEY, finalThought, function (err, _) {
                    if (err)
                        console.error('Ошибка сохранения мысли:', err);
                });
            }
        };
        wrapper.appendChild(bubble);
        markerRef.current = new maplibre_gl_1["default"].Marker({
            element: wrapper,
            anchor: 'center'
        })
            .setLngLat(userLocation)
            .addTo(map);
    }, [mapLoaded, userLocation, thought]);
    return (React.createElement(React.Fragment, null,
        React.createElement(UserLocation_1.UserLocation, { onLocation: setUserLocation }),
        React.createElement(PitchSlider_1.PitchSlider, { mapRef: mapRef, minPitch: 0, maxPitch: 60 }),
        React.createElement(Map, { ref: mapRef, initialViewState: {
                latitude: (_a = userLocation === null || userLocation === void 0 ? void 0 : userLocation[1]) !== null && _a !== void 0 ? _a : 0,
                longitude: (_b = userLocation === null || userLocation === void 0 ? void 0 : userLocation[0]) !== null && _b !== void 0 ? _b : 0,
                zoom: 2
            }, mapStyle: "https://api.maptiler.com/maps/streets-v4/style.json?key=U0SQYQUL3hLC7BWkcwVL", projection: "globe", onLoad: handleMapLoad, style: { width: '100%', height: '100vh' }, attributionControl: false })));
}
exports["default"] = GlobeMap;
