'use client';

import { useEffect } from 'react';

export function UserLocation({
  onLocation,
}: {
  onLocation: (coords: [number, number]) => void;
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.longitude,
          pos.coords.latitude,
        ];

        onLocation(coords);
      },
      (err) => {
        console.error('Ошибка получения геолокации:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, [onLocation]);

  return null;
}
