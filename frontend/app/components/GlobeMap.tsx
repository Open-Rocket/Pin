'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapRef } from 'react-map-gl/maplibre';

import { UserLocation } from './UserLocation';
import { PitchSlider } from './PitchSlider';

const Map = dynamic(
  () => import('react-map-gl/maplibre').then((mod) => mod.Map),
  { ssr: false },
);

const STORAGE_KEY = 'userThought'; // ключ для DeviceStorage

export default function GlobeMap() {
  const mapRef = useRef<MapRef | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [thought, setThought] = useState('hello'); // мысль над головой

  const handleMapLoad = () => setMapLoaded(true);

  // ===== Загрузка мысли из DeviceStorage при инициализации =====
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.DeviceStorage?.getItem) return;

    tg.DeviceStorage.getItem(STORAGE_KEY, (err, value) => {
      if (!err && value) {
        setThought(value);
      }
    });
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !userLocation) return;

    const map = mapRef.current.getMap();

    // Фокус при входе в апку
    map.flyTo({
      center: userLocation,
      zoom: 1,
      essential: true,
    });

    // Удаляем предыдущий маркер
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    const tg = window.Telegram?.WebApp;
    const photoUrl = tg?.initDataUnsafe?.user?.photo_url;

    if (!photoUrl) return;

    // === Основной маркер пользователя ===
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = '52px';
    wrapper.style.height = '52px';
    wrapper.style.padding = '2px';
    wrapper.style.borderRadius = '50%';
    wrapper.style.background = '#000';
    wrapper.style.boxShadow = '0 4px 10px rgba(0,0,0,0.35)';
    wrapper.style.cursor = 'pointer';

    wrapper.onclick = () => {
      map.flyTo({
        center: userLocation,
        zoom: 10,
        essential: true,
      });
    };

    const img = document.createElement('img');
    img.src = photoUrl;
    img.style.width = '48px';
    img.style.height = '48px';
    img.style.borderRadius = '50%';
    img.style.objectFit = 'cover';
    img.style.display = 'block';
    wrapper.appendChild(img);

    // === Облачко с мыслью ===
    const bubble = document.createElement('div');
    bubble.textContent = thought || '...';
    bubble.style.position = 'absolute';
    bubble.style.bottom = '90%';
    bubble.style.left = '50%';
    bubble.style.transform = 'translateX(-50%) translateY(-10px)';
    bubble.style.padding = '6px 10px';
    bubble.style.borderRadius = '20px';
    bubble.style.background = 'rgba(0,0,0,0.80)';
    bubble.style.color = '#fff';
    bubble.style.fontSize = '12px';
    bubble.style.textAlign = 'center';
    bubble.style.cursor = 'pointer';
    bubble.style.userSelect = 'none';
    bubble.style.minWidth = '100px';
    bubble.style.maxWidth = '180px';
    bubble.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

    bubble.onclick = (e) => {
      e.stopPropagation();
      const newThought = prompt('Ваша мысль (до 30 символов)', thought);
      if (newThought !== null) {
        const trimmed = newThought.slice(0, 30);
        const finalThought = newThought.trim() ? trimmed : thought;
        bubble.textContent = finalThought;
        setThought(finalThought);

        // ===== Сохраняем в DeviceStorage =====
        tg?.DeviceStorage?.setItem(STORAGE_KEY, finalThought, (err, _) => {
          if (err) console.error('Ошибка сохранения мысли:', err);
        });
      }
    };

    wrapper.appendChild(bubble);

    markerRef.current = new maplibregl.Marker({
      element: wrapper,
      anchor: 'center',
    })
      .setLngLat(userLocation)
      .addTo(map);
  }, [mapLoaded, userLocation, thought]);

  return (
    <>
      <UserLocation onLocation={setUserLocation} />
      <PitchSlider mapRef={mapRef} minPitch={0} maxPitch={60} />

      <Map
        ref={mapRef}
        initialViewState={{
          latitude: userLocation?.[1] ?? 0,
          longitude: userLocation?.[0] ?? 0,
          zoom: 2,
        }}
        mapStyle="https://api.maptiler.com/maps/streets-v4/style.json?key=U0SQYQUL3hLC7BWkcwVL"
        projection="globe"
        onLoad={handleMapLoad}
        style={{ width: '100%', height: '100vh' }}
        attributionControl={false}
      />
    </>
  );
}
