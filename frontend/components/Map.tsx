'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import { Pin } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Фикс для иконок маркеров в Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapProps {
  pins: Pin[];
  onMapMove: (center: { lat: number; lng: number }) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onPinClick?: (pin: Pin) => void;
  onPinLocationChange?: (pinId: string, lat: number, lng: number) => void;
}

// Компонент для отслеживания перемещения карты
function MapMoveHandler({
  onMapMove,
}: {
  onMapMove: (center: { lat: number; lng: number }) => void;
}) {
  const map = useMap();
  const moveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleMoveEnd = () => {
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }

      // Небольшая задержка для оптимизации запросов
      moveTimeoutRef.current = setTimeout(() => {
        const center = map.getCenter();
        onMapMove({
          lat: center.lat,
          lng: center.lng,
        });
      }, 300);
    };

    map.on('moveend', handleMoveEnd);

    // Вызываем сразу при монтировании
    handleMoveEnd();

    return () => {
      map.off('moveend', handleMoveEnd);
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, [map, onMapMove]);

  return null;
}

// Компонент для обработки кликов по карте
function MapClickHandler({
  onMapClick,
}: {
  onMapClick?: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function MapComponent({
  pins,
  onMapMove,
  onMapClick,
  onPinClick,
  onPinLocationChange,
}: MapProps) {
  const [draggedPinId, setDraggedPinId] = useState<string | null>(null);

  return (
    <MapContainer
      center={[55.7558, 37.6173]} // Москва по умолчанию
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapMoveHandler onMapMove={onMapMove} />
      <MapClickHandler onMapClick={onMapClick} />

      {pins.map((pin) => {
        // Создаем кастомный маркер в стиле дизайна с заголовком сверху
        const titleText =
          pin.title.length > 20
            ? pin.title.substring(0, 20) + '...'
            : pin.title;

        // Цвет для собственного пина - черный, для чужого - зеленый
        const pinColor = pin.is_own ? '#000000' : '#1a5f3f';
        const pinTextColor = pin.is_own ? '#ffffff' : '#ffffff';

        const markerHtml = `
          <div style="position: relative; display: inline-block; text-align: center;">
            <!-- Заголовок сверху -->
            <div style="
              position: absolute;
              bottom: 100%;
              left: 50%;
              transform: translateX(-50%);
              margin-bottom: 4px;
              background: white;
              color: black;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              white-space: nowrap;
              max-width: 150px;
              overflow: hidden;
              text-overflow: ellipsis;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
              z-index: 10;
            ">${titleText}</div>
            
            <!-- Тег с ценой (если есть) -->
            ${
              pin.price
                ? `
              <div style="
                position: absolute;
                top: -8px;
                right: -8px;
                background: var(--pin-primary-light, #2d8a5f);
                color: white;
                padding: 2px 6px;
                border-radius: 6px;
                font-size: 10px;
                font-weight: bold;
                white-space: nowrap;
                z-index: 10;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
              ">${pin.price}₽</div>
            `
                : ''
            }
            
            <!-- Основной маркер -->
            <div style="
              background: ${pinColor};
              color: ${pinTextColor};
              padding: 6px 10px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              font-size: 20px;
              min-width: 40px;
              height: 40px;
              cursor: ${pin.is_own ? 'grab' : 'pointer'};
              ${pin.is_own ? 'border: 2px solid #FFD700;' : ''}
            ">📍</div>
          </div>
        `;

        return (
          <Marker
            key={pin.id}
            position={[pin.location.lat, pin.location.lng]}
            icon={L.divIcon({
              className: 'custom-pin-icon',
              html: markerHtml,
              iconSize: [40, 60],
              iconAnchor: [20, 60],
            })}
            draggable={pin.is_own}
            eventHandlers={{
              click: () => {
                if (onPinClick && draggedPinId !== pin.id) {
                  onPinClick(pin);
                }
              },
              dragstart: () => {
                if (pin.is_own) {
                  setDraggedPinId(pin.id);
                }
              },
              dragend: (event) => {
                if (pin.is_own && onPinLocationChange) {
                  const newLatLng = (event.target as any).getLatLng();
                  onPinLocationChange(pin.id, newLatLng.lat, newLatLng.lng);
                  setDraggedPinId(null);
                }
              },
            }}
          />
        );
      })}
    </MapContainer>
  );
}
