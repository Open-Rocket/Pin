'use client';

import { FC } from 'react';
import Image from 'next/image';
import { MapRef } from 'react-map-gl/maplibre';

interface LocateButtonProps {
  mapRef: React.RefObject<MapRef | null>;
  userLocation: [number, number] | null;
}

export const LocateButton: FC<LocateButtonProps> = ({
  mapRef,
  userLocation,
}) => {
  const handleClick = () => {
    if (!mapRef.current || !userLocation) return;

    mapRef.current.getMap().flyTo({
      center: userLocation,
      zoom: 15,
      essential: true,
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
        boxShadow:
          '0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
        color: '#fff',
      }}
      title="Фокус на пользователе"
    >
      <Image
        src="/fluent-color_location-ripple-24.svg"
        alt="Локация"
        style={{ width: '80%', height: '80%' }}
      />
    </button>
  );
};
