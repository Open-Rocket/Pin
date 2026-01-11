'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_leaflet_1 = require("react-leaflet");
var leaflet_1 = require("leaflet");
require("leaflet/dist/leaflet.css");
// Фикс для иконок маркеров в Next.js
delete leaflet_1["default"].Icon.Default.prototype._getIconUrl;
leaflet_1["default"].Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});
// Компонент для отслеживания перемещения карты
function MapMoveHandler(_a) {
    var onMapMove = _a.onMapMove;
    var map = react_leaflet_1.useMap();
    var moveTimeoutRef = react_1.useRef();
    react_1.useEffect(function () {
        var handleMoveEnd = function () {
            if (moveTimeoutRef.current) {
                clearTimeout(moveTimeoutRef.current);
            }
            // Небольшая задержка для оптимизации запросов
            moveTimeoutRef.current = setTimeout(function () {
                var center = map.getCenter();
                onMapMove({
                    lat: center.lat,
                    lng: center.lng
                });
            }, 300);
        };
        map.on('moveend', handleMoveEnd);
        // Вызываем сразу при монтировании
        handleMoveEnd();
        return function () {
            map.off('moveend', handleMoveEnd);
            if (moveTimeoutRef.current) {
                clearTimeout(moveTimeoutRef.current);
            }
        };
    }, [map, onMapMove]);
    return null;
}
// Компонент для обработки кликов по карте
function MapClickHandler(_a) {
    var onMapClick = _a.onMapClick;
    react_leaflet_1.useMapEvents({
        click: function (e) {
            if (onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        }
    });
    return null;
}
function MapComponent(_a) {
    var pins = _a.pins, onMapMove = _a.onMapMove, onMapClick = _a.onMapClick, onPinClick = _a.onPinClick, onPinLocationChange = _a.onPinLocationChange;
    var _b = react_1.useState(null), draggedPinId = _b[0], setDraggedPinId = _b[1];
    var mapContainerRef = react_1.useRef(null);
    react_1.useEffect(function () {
        var el = mapContainerRef.current;
        if (!el)
            return;
        var startX = 0;
        var startY = 0;
        var onStart = function (e) {
            var _a, _b;
            startX = ((_a = e.touches[0]) === null || _a === void 0 ? void 0 : _a.clientX) || 0;
            startY = ((_b = e.touches[0]) === null || _b === void 0 ? void 0 : _b.clientY) || 0;
        };
        var onMove = function (e) {
            var _a, _b;
            var curX = ((_a = e.touches[0]) === null || _a === void 0 ? void 0 : _a.clientX) || 0;
            var curY = ((_b = e.touches[0]) === null || _b === void 0 ? void 0 : _b.clientY) || 0;
            var dx = Math.abs(curX - startX);
            var dy = Math.abs(curY - startY);
            if (dy > dx && dy > 10) {
                e.preventDefault();
            }
        };
        el.addEventListener('touchstart', onStart, { passive: true });
        el.addEventListener('touchmove', onMove, { passive: false });
        return function () {
            el.removeEventListener('touchstart', onStart);
            el.removeEventListener('touchmove', onMove);
        };
    }, []);
    return (React.createElement("div", { ref: mapContainerRef, "data-allow-scroll": true, style: { width: '100%', height: '100%', touchAction: 'pan-x pinch-zoom' } },
        React.createElement(react_leaflet_1.MapContainer, { center: [55.7558, 37.6173], zoom: 12, style: { width: '100%', height: '100%' }, scrollWheelZoom: true, zoomControl: false, attributionControl: false },
            React.createElement(react_leaflet_1.TileLayer, { attribution: '\u00A9 <a href="https://carto.com/attributions">CARTO</a> & <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }),
            React.createElement(MapMoveHandler, { onMapMove: onMapMove }),
            React.createElement(MapClickHandler, { onMapClick: onMapClick }),
            pins.map(function (pin) {
                // Создаем кастомный маркер в стиле дизайна с заголовком сверху
                var titleText = pin.title.length > 20
                    ? pin.title.substring(0, 20) + '...'
                    : pin.title;
                // Цвет для собственного пина - черный, для чужого - зеленый
                var pinColor = pin.is_own ? '#000000' : '#1a5f3f';
                var pinTextColor = pin.is_own ? '#ffffff' : '#ffffff';
                var markerHtml = "\n          <div style=\"position: relative; display: inline-block; text-align: center;\">\n            <!-- \u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0441\u0432\u0435\u0440\u0445\u0443 -->\n            <div style=\"\n              position: absolute;\n              bottom: 100%;\n              left: 50%;\n              transform: translateX(-50%);\n              margin-bottom: 4px;\n              background: white;\n              color: black;\n              padding: 4px 8px;\n              border-radius: 6px;\n              font-size: 11px;\n              font-weight: 600;\n              white-space: nowrap;\n              max-width: 150px;\n              overflow: hidden;\n              text-overflow: ellipsis;\n              box-shadow: 0 2px 6px rgba(0,0,0,0.2);\n              z-index: 10;\n            \">" + titleText + "</div>\n            \n            <!-- \u0422\u0435\u0433 \u0441 \u0446\u0435\u043D\u043E\u0439 (\u0435\u0441\u043B\u0438 \u0435\u0441\u0442\u044C) -->\n            " + (pin.price
                    ? "\n              <div style=\"\n                position: absolute;\n                top: -8px;\n                right: -8px;\n                background: var(--pin-primary-light, #2d8a5f);\n                color: white;\n                padding: 2px 6px;\n                border-radius: 6px;\n                font-size: 10px;\n                font-weight: bold;\n                white-space: nowrap;\n                z-index: 10;\n                box-shadow: 0 1px 3px rgba(0,0,0,0.2);\n              \">" + pin.price + "\u20BD</div>\n            "
                    : '') + "\n            \n            <!-- \u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u043C\u0430\u0440\u043A\u0435\u0440 -->\n            <div style=\"\n              background: " + pinColor + ";\n              color: " + pinTextColor + ";\n              padding: 6px 10px;\n              border-radius: 8px;\n              display: flex;\n              align-items: center;\n              justify-content: center;\n              box-shadow: 0 2px 8px rgba(0,0,0,0.3);\n              font-size: 20px;\n              min-width: 40px;\n              height: 40px;\n              cursor: " + (pin.is_own ? 'grab' : 'pointer') + ";\n              " + (pin.is_own ? 'border: 2px solid #FFD700;' : '') + "\n            \">\uD83D\uDCCD</div>\n          </div>\n        ";
                return (React.createElement(react_leaflet_1.Marker, { key: pin.id, position: [pin.location.lat, pin.location.lng], icon: leaflet_1["default"].divIcon({
                        className: 'custom-pin-icon',
                        html: markerHtml,
                        iconSize: [40, 60],
                        iconAnchor: [20, 60]
                    }), draggable: pin.is_own, eventHandlers: {
                        click: function () {
                            if (onPinClick && draggedPinId !== pin.id) {
                                onPinClick(pin);
                            }
                        },
                        dragstart: function () {
                            if (pin.is_own) {
                                setDraggedPinId(pin.id);
                            }
                        },
                        dragend: function (event) {
                            if (pin.is_own && onPinLocationChange) {
                                var newLatLng = event.target.getLatLng();
                                onPinLocationChange(pin.id, newLatLng.lat, newLatLng.lng);
                                setDraggedPinId(null);
                            }
                        }
                    } }));
            }))));
}
exports["default"] = MapComponent;
