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
var dynamic_1 = require("next/dynamic");
var maplibre_gl_1 = require("maplibre-gl");
require("maplibre-gl/dist/maplibre-gl.css");
var TouchInfo_1 = require("./TouchInfo");
var UserLocation_1 = require("./UserLocation");
var Zoom2Btn_1 = require("./Zoom2Btn");
var PitchSlider_1 = require("./PitchSlider");
var PinForm_1 = require("./PinForm");
var firebase_1 = require("../../lib/firebase");
var firestore_1 = require("firebase/firestore");
var Map = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require('react-map-gl/maplibre'); }).then(function (mod) { return mod.Map; }); }, { ssr: false });
function GlobeMap() {
    var _this = this;
    var _a, _b;
    var mapRef = react_1.useRef(null);
    var markerRef = react_1.useRef(null);
    var _c = react_1.useState(null), userLocation = _c[0], setUserLocation = _c[1];
    var _d = react_1.useState(false), mapLoaded = _d[0], setMapLoaded = _d[1];
    var _e = react_1.useState(false), sheetVisible = _e[0], setSheetVisible = _e[1];
    var _f = react_1.useState(null), pinLocation = _f[0], setPinLocation = _f[1];
    var _g = react_1.useState([]), pins = _g[0], setPins = _g[1];
    var _h = react_1.useState([]), markers = _h[0], setMarkers = _h[1];
    var handleMapLoad = function () { return setMapLoaded(true); };
    // --- Firestore: подписка на пины ---
    react_1.useEffect(function () {
        var pinsCollection = firestore_1.collection(firebase_1.db, 'pins');
        var q = firestore_1.query(pinsCollection, firestore_1.orderBy('created_at', 'desc'));
        var unsubscribe = firestore_1.onSnapshot(q, function (snapshot) {
            var now = new Date().toISOString();
            var fetchedPins = snapshot.docs
                .map(function (doc) {
                var data = doc.data();
                return {
                    description: data.description,
                    location: data.location,
                    created_at: data.created_at,
                    expires_at: data.expires_at,
                    userId: data.userId,
                    userPhoto: data.userPhoto
                };
            })
                .filter(function (p) { return !p.expires_at || p.expires_at > now; }); // пропускаем устаревшие
            setPins(fetchedPins);
        });
        return function () { return unsubscribe(); };
    }, []);
    var handleSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSheetVisible(false);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, firestore_1.addDoc(firestore_1.collection(firebase_1.db, 'pins'), data)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error('Ошибка при сохранении пина в Firestore:', err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        if (!mapLoaded || !mapRef.current)
            return function () { };
        var map = mapRef.current.getMap();
        var handleClick = function (e) {
            setPinLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng });
            setSheetVisible(true);
        };
        map.on('click', handleClick);
        return function () { return map.off('click', handleClick); };
    }, [mapLoaded]);
    react_1.useEffect(function () {
        if (!mapLoaded || !mapRef.current || !userLocation)
            return function () { };
        var map = mapRef.current.getMap();
        map.flyTo({ center: userLocation, zoom: 5, essential: true });
        if (!markerRef.current) {
            var wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.width = '60px';
            wrapper.style.height = '60px';
            wrapper.style.cursor = 'pointer';
            wrapper.style.zIndex = '5';
            var outer = document.createElement('div');
            outer.style.width = '32px';
            outer.style.height = '32px';
            outer.style.borderRadius = '50%';
            outer.style.background = 'rgba(0,0,0,0.2)';
            outer.style.position = 'absolute';
            outer.style.top = '50%';
            outer.style.left = '50%';
            outer.style.transform = 'translate(-50%, -50%)';
            var inner = document.createElement('div');
            inner.style.width = '24px';
            inner.style.height = '24px';
            inner.style.borderRadius = '50%';
            inner.style.background = '#000';
            inner.style.position = 'absolute';
            inner.style.top = '50%';
            inner.style.left = '50%';
            inner.style.transform = 'translate(-50%, -50%)';
            var text = document.createElement('div');
            text.innerText = 'Я';
            text.style.position = 'absolute';
            text.style.top = '50%';
            text.style.left = '50%';
            text.style.transform = 'translate(-50%, -50%)';
            text.style.color = '#fff';
            text.style.fontSize = '12px';
            text.style.fontWeight = 'bold';
            text.style.userSelect = 'none';
            text.style.pointerEvents = 'none';
            wrapper.appendChild(outer);
            wrapper.appendChild(inner);
            wrapper.appendChild(text);
            wrapper.onclick = function (e) {
                e.stopPropagation();
                map.flyTo({ center: userLocation, zoom: 12, essential: true });
            };
            markerRef.current = new maplibre_gl_1["default"].Marker({
                element: wrapper,
                anchor: 'center'
            })
                .setLngLat(userLocation)
                .addTo(map);
        }
        else {
            markerRef.current.setLngLat(userLocation);
        }
    }, [mapLoaded, userLocation]);
    react_1.useEffect(function () {
        if (!mapRef.current || !mapLoaded)
            return;
        var map = mapRef.current.getMap();
        if (!map)
            return;
        var updateMarkers = function () {
            setMarkers(function (prev) {
                prev.forEach(function (m) { return m.remove(); });
                return [];
            });
            var zoom = map.getZoom();
            if (pins.length === 0)
                return;
            var now = new Date().toISOString();
            var activePins = pins.filter(function (p) { return !p.expires_at || p.expires_at > now; });
            var newMarkers = [];
            if (zoom < 7) {
                // кластеризация
                var clusters_1 = [];
                activePins.forEach(function (p) {
                    var cluster = clusters_1.find(function (c) {
                        return Math.abs(c.lat - p.location.lat) < 0.5 &&
                            Math.abs(c.lng - p.location.lng) < 0.5;
                    });
                    if (cluster)
                        cluster.count++;
                    else
                        clusters_1.push({
                            lat: p.location.lat,
                            lng: p.location.lng,
                            count: 1
                        });
                });
                clusters_1.forEach(function (c) {
                    var el = document.createElement('div');
                    el.style.width = '32px';
                    el.style.height = '32px';
                    el.style.borderRadius = '50%';
                    el.style.background = 'white';
                    el.style.border = '2px solid black';
                    el.style.display = 'flex';
                    el.style.alignItems = 'center';
                    el.style.justifyContent = 'center';
                    el.style.fontWeight = 'bold';
                    el.style.color = '#000';
                    el.innerText = String(c.count);
                    var m = new maplibre_gl_1["default"].Marker({ element: el, anchor: 'center' })
                        .setLngLat([c.lng, c.lat])
                        .addTo(map);
                    newMarkers.push(m);
                });
            }
            else {
                // отдельные пины
                activePins.forEach(function (p) {
                    var wrapper = document.createElement('div');
                    wrapper.style.display = 'flex';
                    wrapper.style.flexDirection = 'column';
                    wrapper.style.alignItems = 'center';
                    var el = document.createElement('div');
                    el.style.cursor = 'pointer';
                    el.style.display = 'inline-block';
                    el.style.background = '#fff';
                    el.style.border = '2px solid #000';
                    el.style.borderRadius = '12px';
                    el.style.padding = '8px';
                    el.style.minWidth = '120px';
                    el.style.maxWidth = '200px';
                    el.style.textAlign = 'center';
                    el.style.wordWrap = 'break-word';
                    el.style.overflow = 'hidden';
                    el.style.textOverflow = 'ellipsis';
                    el.innerHTML = p.description;
                    el.style.color = '#000';
                    wrapper.appendChild(el);
                    if (p.userPhoto) {
                        var img = document.createElement('img');
                        img.src = p.userPhoto;
                        img.style.width = '32px';
                        img.style.height = '32px';
                        img.style.borderRadius = '50%';
                        img.style.marginTop = '4px';
                        wrapper.appendChild(img);
                    }
                    var m = new maplibre_gl_1["default"].Marker({
                        element: wrapper,
                        anchor: 'bottom'
                    })
                        .setLngLat([p.location.lng, p.location.lat])
                        .addTo(map);
                    newMarkers.push(m);
                });
            }
            setMarkers(newMarkers);
        };
        updateMarkers();
        map.on('zoom', updateMarkers);
        // функция очистки — возвращаем void
        return function () {
            map.off('zoom', updateMarkers);
        };
    }, [mapLoaded, pins]);
    return (React.createElement("div", null,
        React.createElement(UserLocation_1.UserLocation, { onLocation: setUserLocation }),
        React.createElement(PitchSlider_1.PitchSlider, { mapRef: mapRef, minPitch: 0, maxPitch: 60 }),
        React.createElement(TouchInfo_1.TouchInfo, null),
        React.createElement(Zoom2Btn_1.ZoomTo2Button, { mapRef: mapRef }),
        React.createElement(Map, { ref: mapRef, initialViewState: {
                latitude: (_a = userLocation === null || userLocation === void 0 ? void 0 : userLocation[1]) !== null && _a !== void 0 ? _a : 0,
                longitude: (_b = userLocation === null || userLocation === void 0 ? void 0 : userLocation[0]) !== null && _b !== void 0 ? _b : 0,
                zoom: 2
            }, mapStyle: "https://api.maptiler.com/maps/streets-v4/style.json?key=U0SQYQUL3hLC7BWkcwVL", projection: "globe", onLoad: handleMapLoad, style: { width: '100%', height: '100vh' }, attributionControl: false }),
        pinLocation && (React.createElement(PinForm_1["default"], { location: pinLocation, sheetVisible: sheetVisible, onClose: function () { return setSheetVisible(false); }, onSubmit: handleSubmit }))));
}
exports["default"] = GlobeMap;
