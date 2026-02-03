'use client';

import { FC, useState } from 'react';
import { MapRef } from 'react-map-gl/maplibre';

interface PitchSliderProps {
  mapRef: React.RefObject<MapRef | null>;
  minPitch?: number;
  maxPitch?: number;
}

export const PitchSlider: FC<PitchSliderProps> = ({
  mapRef,
  minPitch = 0,
  maxPitch = 60,
}) => {
  const [pitch, setPitch] = useState(minPitch);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPitch(value);

    if (mapRef.current) {
      mapRef.current.getMap().easeTo({
        pitch: value,
        duration: 300,
      });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '5%',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <input
        type="range"
        min={minPitch}
        max={maxPitch}
        value={pitch}
        onChange={handleChange}
        style={{
          writingMode: 'vertical-rl',
          WebkitAppearance: 'slider-vertical',
          width: 12,
          height: 220,
          borderRadius: 4,
          background: 'rgba(255,255,255,0.2)',
          accentColor: '#000',
          cursor: 'pointer',
        }}
      />
      <span style={{ color: '#fff', fontSize: 14 }}>{Math.round(pitch)}°</span>
    </div>
  );
};
