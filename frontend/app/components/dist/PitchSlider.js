'use client';
"use strict";
exports.__esModule = true;
exports.PitchSlider = void 0;
var react_1 = require("react");
exports.PitchSlider = function (_a) {
    var mapRef = _a.mapRef, _b = _a.minPitch, minPitch = _b === void 0 ? 0 : _b, // сверху вид
    _c = _a.maxPitch, // сверху вид
    maxPitch = _c === void 0 ? 60 : _c;
    var _d = react_1.useState(minPitch), pitch = _d[0], setPitch = _d[1];
    var handleChange = function (e) {
        var value = Number(e.target.value);
        setPitch(value);
        if (mapRef.current) {
            mapRef.current.getMap().easeTo({
                pitch: value,
                duration: 300
            });
        }
    };
    return (React.createElement("div", { style: {
            position: 'fixed',
            right: '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 25,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8
        } },
        React.createElement("input", { type: "range", min: minPitch, max: maxPitch, value: pitch, onChange: handleChange, style: {
                writingMode: 'vertical-rl',
                WebkitAppearance: 'slider-vertical',
                width: 12,
                height: 220,
                borderRadius: 4,
                background: 'rgba(255,255,255,0.2)',
                accentColor: '#000',
                cursor: 'pointer'
            } }),
        React.createElement("span", { style: { color: '#fff', fontSize: 14 } },
            Math.round(pitch),
            "\u00B0")));
};
