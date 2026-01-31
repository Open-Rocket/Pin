'use client';

import { useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapRef } from 'react-map-gl/maplibre';

import { TouchInfo } from './TouchInfo';
import { UserLocation } from './UserLocation';
import { ZoomTo2Button } from './Zoom2Btn';
import { PitchSlider } from './PitchSlider';
import { CreatePinData } from '../types/index';
import PinForm from './PinForm';
import { db } from '../../lib/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

const Map = dynamic(
  () => import('react-map-gl/maplibre').then((mod) => mod.Map),
  { ssr: false },
);

export default function GlobeMap() {
  const mapRef = useRef<MapRef | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [mapLoaded, setMapLoaded] = useState(false);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [pinLocation, setPinLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [pins, setPins] = useState<(CreatePinData & { userPhoto?: string })[]>(
    [],
  );
  const [markers, setMarkers] = useState<maplibregl.Marker[]>([]);

  const handleMapLoad = () => setMapLoaded(true);

  // --- Firestore: подписка на пины ---
  useEffect(() => {
    const pinsCollection = collection(db, 'pins');
    const q = query(pinsCollection, orderBy('created_at', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date().toISOString();
      const fetchedPins: (CreatePinData & { userPhoto?: string })[] =
        snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              description: data.description,
              location: data.location,
              created_at: data.created_at,
              expires_at: data.expires_at,
              userId: data.userId,
              userPhoto: data.userPhoto,
            };
          })
          .filter((p) => !p.expires_at || p.expires_at > now); // пропускаем устаревшие
      setPins(fetchedPins);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (data: CreatePinData & { userPhoto?: string }) => {
    setSheetVisible(false);

    try {
      await addDoc(collection(db, 'pins'), data);
    } catch (err) {
      console.error('Ошибка при сохранении пина в Firestore:', err);
    }
  };

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return () => {};

    const map = mapRef.current.getMap();
    const handleClick = (e: maplibregl.MapMouseEvent) => {
      setPinLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      setSheetVisible(true);
    };

    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [mapLoaded]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !userLocation) return () => {};
    const map = mapRef.current.getMap();
    map.flyTo({ center: userLocation, zoom: 5, essential: true });

    if (!markerRef.current) {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = '60px';
      wrapper.style.height = '60px';
      wrapper.style.cursor = 'pointer';
      wrapper.style.zIndex = '5';

      const outer = document.createElement('div');
      outer.style.width = '32px';
      outer.style.height = '32px';
      outer.style.borderRadius = '50%';
      outer.style.background = 'rgba(0,0,0,0.2)';
      outer.style.position = 'absolute';
      outer.style.top = '50%';
      outer.style.left = '50%';
      outer.style.transform = 'translate(-50%, -50%)';

      const inner = document.createElement('div');
      inner.style.width = '24px';
      inner.style.height = '24px';
      inner.style.borderRadius = '50%';
      inner.style.background = '#000';
      inner.style.position = 'absolute';
      inner.style.top = '50%';
      inner.style.left = '50%';
      inner.style.transform = 'translate(-50%, -50%)';

      const text = document.createElement('div');
      text.innerText = 'Я';
      text.style.position = 'absolute';
      text.style.top = '50%';
      text.style.left = '50%';
      text.style.transform = 'translate(-50%, -50%)';
      text.style.color = '#fff';
      text.style.fontSize = '12px';
      text.style.fontWeight = 'bold';
      text.style.userSelect = 'none';
      text.style.pointerEvents = 'none';

      wrapper.appendChild(outer);
      wrapper.appendChild(inner);
      wrapper.appendChild(text);

      wrapper.onclick = (e) => {
        e.stopPropagation();
        map.flyTo({ center: userLocation, zoom: 12, essential: true });
      };

      markerRef.current = new maplibregl.Marker({
        element: wrapper,
        anchor: 'center',
      })
        .setLngLat(userLocation)
        .addTo(map);
    } else {
      markerRef.current.setLngLat(userLocation);
    }
  }, [mapLoaded, userLocation]);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const map = mapRef.current.getMap();
    if (!map) return;

    const updateMarkers = () => {
      setMarkers((prev) => {
        prev.forEach((m) => m.remove());
        return [];
      });

      const zoom = map.getZoom();
      if (pins.length === 0) return;

      const now = new Date().toISOString();
      const activePins = pins.filter(
        (p) => !p.expires_at || p.expires_at > now,
      );

      const newMarkers: maplibregl.Marker[] = [];

      if (zoom < 7) {
        // кластеризация
        const clusters: { lat: number; lng: number; count: number }[] = [];

        activePins.forEach((p) => {
          const cluster = clusters.find(
            (c) =>
              Math.abs(c.lat - p.location.lat) < 0.5 &&
              Math.abs(c.lng - p.location.lng) < 0.5,
          );
          if (cluster) cluster.count++;
          else
            clusters.push({
              lat: p.location.lat,
              lng: p.location.lng,
              count: 1,
            });
        });

        clusters.forEach((c) => {
          const el = document.createElement('div');
          el.style.width = '32px';
          el.style.height = '32px';
          el.style.borderRadius = '50%';
          el.style.background = 'white';
          el.style.border = '2px solid black';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.fontWeight = 'bold';
          el.style.color = '#000';
          el.innerText = String(c.count);

          const m = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat([c.lng, c.lat])
            .addTo(map);
          newMarkers.push(m);
        });
      } else {
        // отдельные пины
        activePins.forEach((p) => {
          const wrapper = document.createElement('div');
          wrapper.style.display = 'flex';
          wrapper.style.flexDirection = 'column';
          wrapper.style.alignItems = 'center';

          const el = document.createElement('div');
          el.style.cursor = 'pointer';
          el.style.display = 'inline-block';
          el.style.background = '#fff';
          el.style.border = '2px solid #000';
          el.style.borderRadius = '12px';
          el.style.padding = '8px';
          el.style.minWidth = '120px';
          el.style.maxWidth = '200px';
          el.style.textAlign = 'center';
          el.style.wordWrap = 'break-word';
          el.style.overflow = 'hidden';
          el.style.textOverflow = 'ellipsis';
          el.innerHTML = p.description;
          el.style.color = '#000';

          wrapper.appendChild(el);

          if (p.userPhoto) {
            const img = document.createElement('img');
            img.src = p.userPhoto;
            img.style.width = '32px';
            img.style.height = '32px';
            img.style.borderRadius = '50%';
            img.style.marginTop = '4px';
            wrapper.appendChild(img);
          }

          const m = new maplibregl.Marker({
            element: wrapper,
            anchor: 'bottom',
          })
            .setLngLat([p.location.lng, p.location.lat])
            .addTo(map);

          newMarkers.push(m);
        });
      }

      setMarkers(newMarkers);
    };

    updateMarkers();
    map.on('zoom', updateMarkers);

    // функция очистки — возвращаем void
    return () => {
      map.off('zoom', updateMarkers);
    };
  }, [mapLoaded, pins]);

  return (
    <div>
      <UserLocation onLocation={setUserLocation} />
      <PitchSlider mapRef={mapRef} minPitch={0} maxPitch={60} />
      <TouchInfo />
      <ZoomTo2Button mapRef={mapRef} />

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

      {pinLocation && (
        <PinForm
          location={pinLocation}
          sheetVisible={sheetVisible}
          onClose={() => setSheetVisible(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
