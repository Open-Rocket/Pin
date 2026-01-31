"use strict";
exports.__esModule = true;
exports.usePinMarker = void 0;
// hooks/usePinMarkers.ts
var react_1 = require("react");
var maplibre_gl_1 = require("maplibre-gl");
function usePinMarker(map, pins) {
    var markersRef = react_1.useRef([]);
    react_1.useEffect(function () {
        if (!map)
            return;
        var updateMarkers = function () {
            // удаляем старые маркеры
            markersRef.current.forEach(function (m) { return m.remove(); });
            markersRef.current = [];
            var zoom = map.getZoom();
            var now = new Date().toISOString();
            var activePins = pins.filter(function (p) { return !p.expires_at || p.expires_at > now; });
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
                    el.className = 'cluster-marker';
                    el.innerText = String(c.count);
                    var marker = new maplibre_gl_1["default"].Marker({
                        element: el,
                        anchor: 'center'
                    })
                        .setLngLat([c.lng, c.lat])
                        .addTo(map);
                    markersRef.current.push(marker);
                });
            }
            else {
                // отдельные пины
                activePins.forEach(function (p) {
                    var wrapper = document.createElement('div');
                    wrapper.className = 'pin-marker';
                    var el = document.createElement('div');
                    el.innerHTML = p.description;
                    el.className = 'pin-description';
                    wrapper.appendChild(el);
                    if (p.userPhoto) {
                        var img = document.createElement('img');
                        img.src = p.userPhoto;
                        img.className = 'pin-user-photo';
                        wrapper.appendChild(img);
                    }
                    var marker = new maplibre_gl_1["default"].Marker({
                        element: wrapper,
                        anchor: 'bottom'
                    })
                        .setLngLat([p.location.lng, p.location.lat])
                        .addTo(map);
                    markersRef.current.push(marker);
                });
            }
        };
        // первый рендер
        updateMarkers();
        // обновление при zoom
        map.on('zoom', updateMarkers);
        // очистка при размонтировании или изменении map/pins
        return function () {
            map.off('zoom', updateMarkers);
            markersRef.current.forEach(function (m) { return m.remove(); });
            markersRef.current = [];
        };
    }, [map, pins]);
    // возвращаем сам ref, а не markersRef.current
    return markersRef;
}
exports.usePinMarker = usePinMarker;
