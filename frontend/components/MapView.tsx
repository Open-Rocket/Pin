'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Pin, CreatePinData } from '@/types';
import CreatePinForm from './CreatePinForm';
import ContactModal from './ContactModal';
import PinCard from './PinCard';
import MapInstruction from './MapInstruction';
import { useTelegram } from '@/hooks/useTelegram';
import { api } from '@/lib/api';

// Динамический импорт карты для избежания SSR проблем
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-telegram-secondary-bg">
      <span className="text-telegram-text">Загрузка карты...</span>
    </div>
  ),
});

export default function MapView() {
  const { expand, isTelegram } = useTelegram();
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [userContact, setUserContact] = useState<string>('+7 976 888 76 55');

  // Загружаем пины при монтировании
  useEffect(() => {
    loadPins();
  }, []);

  // Загрузка пинов с API
  const loadPins = async () => {
    try {
      setLoading(true);
      console.log('Loading pins from:', '/pins');
      const data = await api.get<Pin[]>('/pins');
      console.log('Raw data received:', data);

      const pinsArray = Array.isArray(data) ? data : [];
      console.log('Pins array:', pinsArray);

      // Устанавливаем флаг is_own для каждого пина (для демонстрации)
      const pinsWithOwner = pinsArray.map((pin, index) => {
        const pinWithOwner = {
          ...pin,
          is_own: index === 0, // Первый пин будет "своим" для демонстрации
        };
        console.log('Pin with owner:', pinWithOwner);
        return pinWithOwner;
      });

      console.log('Setting pins:', pinsWithOwner);
      setPins(pinsWithOwner);
    } catch (error) {
      console.error('Error loading pins:', error);
      // На ошибку просто продолжаем работу с пустым списком
    } finally {
      setLoading(false);
    }
  };

  // Вызываем expand() только при явных действиях пользователя с модальными окнами
  // НЕ вызываем при скролле - это вызывает сворачивание приложения в Telegram
  useEffect(() => {
    if (isTelegram && (selectedPin || showCreateForm || showContactModal)) {
      expand();
    }
  }, [selectedPin, showCreateForm, showContactModal, expand, isTelegram]);

  const handleMapMove = useCallback(
    async (center: { lat: number; lng: number }) => {
      // TODO: Загрузка Pins с API для конкретного региона
    },
    []
  );

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      // Если открыта карточка Pin, закрываем её
      if (selectedPin) {
        setSelectedPin(null);
        return;
      }
      // Иначе открываем форму создания Pin
      setSelectedLocation({ lat, lng });
      setShowCreateForm(true);
    },
    [selectedPin]
  );

  const handlePinClick = useCallback(
    (pin: Pin) => {
      setSelectedPin(pin);
      // Закрываем форму создания, если она открыта
      setShowCreateForm(false);
      setSelectedLocation(null);
      // Вызываем expand() при открытии карточки
      if (isTelegram) {
        expand();
      }
    },
    [expand, isTelegram]
  );

  const handleCreatePin = useCallback(
    async (data: CreatePinData) => {
      try {
        setLoading(true);

        // Отправляем на API
        const newPin = await api.post<Pin>('/pins', {
          ...data,
          owner_id: 'user-' + Date.now(),
          is_own: true,
          views_count: 0,
          is_active: true,
        });

        // Добавляем новый Pin в список
        setPins([...pins, newPin]);
        setShowCreateForm(false);
        setSelectedLocation(null);

        // Показываем уведомление об успехе
        if (typeof alert !== 'undefined') {
          alert('Pin успешно создан!');
        }
      } catch (error) {
        console.error('Error creating pin:', error);
        if (typeof alert !== 'undefined') {
          alert('Ошибка при создании Pin');
        }
      } finally {
        setLoading(false);
      }
    },
    [pins]
  );

  const handleSaveContact = useCallback((contact: string) => {
    setUserContact(contact);
    console.log('Saving contact:', contact);
  }, []);

  const handleDeletePin = useCallback(
    async (pinId: string) => {
      try {
        setLoading(true);
        // Удаляем с API
        await api.delete(`/pins/${pinId}`);
        // Удаляем из локального списка
        setPins(pins.filter((pin) => pin.id !== pinId));
      } catch (error) {
        console.error('Error deleting pin:', error);
        alert('Ошибка при удалении Pin');
      } finally {
        setLoading(false);
      }
    },
    [pins]
  );

  const handleUpdatePinLocation = useCallback(
    async (pinId: string, lat: number, lng: number) => {
      try {
        setLoading(true);
        // Обновляем на API
        const updatedPin = await api.patch<Pin>(`/pins/${pinId}`, {
          location: { lat, lng },
        });
        // Обновляем в локальном списке
        setPins(
          pins.map((pin) =>
            pin.id === pinId ? { ...pin, location: { lat, lng } } : pin
          )
        );
      } catch (error) {
        console.error('Error updating pin location:', error);
        alert('Ошибка при обновлении локации');
      } finally {
        setLoading(false);
      }
    },
    [pins]
  );

  return (
    <div className="w-full h-screen relative">
      <Map
        pins={pins}
        onMapMove={handleMapMove}
        onMapClick={handleMapClick}
        onPinClick={handlePinClick}
        onPinLocationChange={handleUpdatePinLocation}
      />

      {/* Инструкция на браузере */}
      <MapInstruction />

      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-telegram-bg px-4 py-2 rounded-lg shadow-lg">
            <span className="text-telegram-text">Загрузка...</span>
          </div>
        </div>
      )}

      {/* Форма создания Pin */}
      {showCreateForm && selectedLocation && (
        <CreatePinForm
          location={selectedLocation}
          onClose={() => {
            setShowCreateForm(false);
            setSelectedLocation(null);
          }}
          onSubmit={handleCreatePin}
        />
      )}

      {/* Модальное окно контакта */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSave={handleSaveContact}
        initialContact={userContact}
      />

      {/* Карточка Pin снизу экрана */}
      {selectedPin && (
        <PinCard
          pin={selectedPin}
          onClose={() => setSelectedPin(null)}
          onDelete={handleDeletePin}
        />
      )}
    </div>
  );
}
