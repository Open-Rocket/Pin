'use client';

import { useRef } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';
import { LocateButton } from './FocusUserButton';
import { SearchBox } from './SearchBox';

interface MapControlsProps {
  mapRef: React.RefObject<MapRef | null>;
  userLocation: [number, number] | null;
}

export function MapControls({ mapRef, userLocation }: MapControlsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: '5%',
        left: 0,
        right: 0,
        zIndex: 15,
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        padding: '0 12px',
        pointerEvents: 'auto', // пропускаем клики
      }}
    >
      {/* SearchBox */}
      <div style={{ flex: 1 }}>
        <SearchBox mapRef={mapRef} />
      </div>

      {/* Locate button */}
      <div>
        <LocateButton mapRef={mapRef} userLocation={userLocation} />
      </div>
    </div>
  );
}
