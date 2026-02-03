'use client';

import React from 'react';
import Image from 'next/image';
import type { MapRef } from 'react-map-gl/maplibre';

interface ZoomButtonProps {
  mapRef: React.RefObject<MapRef | null>;
}

export const ZoomTo2Button: React.FC<ZoomButtonProps> = ({ mapRef }) => {
  const handleClick = () => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    map.flyTo({
      zoom: 1,
      essential: true,
      duration: 1000,
    });
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: 'calc(var(--tg-content-safe-area-inset-top, 0px) + 7%)',
        right: 'calc(var(--tg-content-safe-area-inset-right, 0px) + 5%)',
        width: 60,
        height: 60,
        borderRadius: 14,
        border: '1px solid rgba(240,240,240,0.08)',
        background: 'rgba(240,240,240,0.35)',
        // background: '#fff',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(px)',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 20,
        boxShadow:
          '0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
        color: '#fff',
      }}
      title="Zoom2"
    >
      <Image
        src="/zoom2.svg"
        alt="zoom2"
        style={{ width: '90%', height: '90%' }}
      />
    </button>
  );
};
