'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapRef } from 'react-map-gl/maplibre';

import { UserLocation } from './UserLocation';
import { MapControls } from './SearchContainer';

const Map = dynamic(() => import('react-map-gl/maplibre').then((m) => m.Map), {
  ssr: false,
});

export default function StreetMap() {
  const mapRef = useRef<MapRef | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const sheetRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  // ===== map loaded =====
  const handleMapLoad = () => setMapLoaded(true);

  // ===== user marker =====
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !userLocation) return;

    const map = mapRef.current.getMap();

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    const tg = window.Telegram?.WebApp;
    const photoUrl = tg.initDataUnsafe?.user?.photo_url;
    if (!photoUrl) return;

    const wrapper = document.createElement('div');
    wrapper.style.width = '52px';
    wrapper.style.height = '52px';
    wrapper.style.padding = '2px';
    wrapper.style.borderRadius = '50%';
    wrapper.style.background =
      'linear-gradient(135deg, #8BFC52 0%, #52D4FC 100%)';
    wrapper.style.boxShadow = '0 4px 10px rgba(0,0,0,0.35)';
    wrapper.style.cursor = 'pointer';

    wrapper.onclick = () => setSheetOpen(true);

    const img = document.createElement('img');
    img.src = photoUrl;
    img.style.width = '48px';
    img.style.height = '48px';
    img.style.borderRadius = '50%';
    img.style.objectFit = 'cover';
    img.style.display = 'block';

    wrapper.appendChild(img);

    markerRef.current = new maplibregl.Marker({
      element: wrapper,
      anchor: 'center',
    })
      .setLngLat(userLocation)
      .addTo(map);
  }, [mapLoaded, userLocation]);

  // ===== sheet drag =====
  const onPointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY;
    currentY.current = 0;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !sheetRef.current) return;

    const delta = e.clientY - startY.current;
    if (delta < 0) return;

    currentY.current = delta;
    sheetRef.current.style.transform = `translateY(${delta}px)`;
  };

  const onPointerUp = () => {
    if (!sheetRef.current) return;

    setDragging(false);

    if (currentY.current > 120) {
      setSheetOpen(false);
    } else {
      sheetRef.current.style.transform = 'translateY(0)';
    }
  };

  return (
    <>
      <UserLocation onLocation={setUserLocation} />

      <Map
        ref={mapRef}
        onLoad={handleMapLoad}
        initialViewState={{
          latitude: userLocation?.[1] ?? 0,
          longitude: userLocation?.[0] ?? 0,
          zoom: 14,
        }}
        style={{ width: '100%', height: '100vh' }}
        mapStyle="https://api.maptiler.com/maps/streets-v4/style.json?key=U0SQYQUL3hLC7BWkcwVL"
        attributionControl={false}
      />

      <MapControls mapRef={mapRef} userLocation={userLocation} />

      {/* ===== BACKDROP ===== */}
      <div
        onClick={() => setSheetOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: sheetOpen ? 'rgba(0,0,0,0.35)' : 'transparent',
          transition: 'background 0.3s ease',
          pointerEvents: sheetOpen ? 'auto' : 'none',
          zIndex: 20,
        }}
      >
        {/* ===== SHEET ===== */}
        <div
          ref={sheetRef}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: '#fff',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
            transform: sheetOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: dragging
              ? 'none'
              : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
            touchAction: 'none',
          }}
        >
          <div
            style={{
              width: 40,
              height: 4,
              background: '#ccc',
              borderRadius: 2,
              margin: '0 auto 12px',
            }}
          />

          <h3>Профиль пользователя</h3>
          <p>Любой контент тут</p>
        </div>
      </div>
    </>
  );
}
