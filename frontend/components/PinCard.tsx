'use client';

import { useEffect, useRef } from 'react';
import { Pin } from '@/types';
import { useTelegram } from '@/hooks/useTelegram';

interface PinCardProps {
  pin: Pin;
  onClose: () => void;
  onDelete?: (pinId: string) => void;
}

export default function PinCard({ pin, onClose, onDelete }: PinCardProps) {
  const { expand, isTelegram } = useTelegram();
  const cardRef = useRef<HTMLDivElement>(null);

  // Вызываем expand() при открытии карточки
  useEffect(() => {
    if (isTelegram) {
      expand();
    }
  }, [expand, isTelegram]);

  // Обработчик скролла внутри карточки с debounce
  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement || !isTelegram) return;

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        expand();
      }, 50); // Debounce 50ms
    };

    // Слушаем скролл только внутри карточки, не на window
    cardElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      cardElement.removeEventListener('scroll', handleScroll);
    };
  }, [expand, isTelegram]);

  const handleDeletePin = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот Pin?')) {
      try {
        if (onDelete) {
          onDelete(pin.id);
        }
        onClose();
      } catch (error) {
        console.error('Error deleting pin:', error);
        alert('Ошибка при удалении Pin');
      }
    }
  };

  return (
    <div
      ref={cardRef}
      data-allow-scroll
      className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl modal-slide-up max-h-[80vh] overflow-y-auto"
      onClick={(e) => {
        // Закрываем при клике на фон (не на контент)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onTouchStart={() => {
        // Вызываем expand() при начале касания
        if (isTelegram) {
          expand();
        }
      }}
      onTouchMove={() => {
        // Вызываем expand() при движении (скролле)
        if (isTelegram) {
          expand();
        }
      }}
    >
      <div className="p-6" onClick={(e) => e.stopPropagation()}>
        {/* Крестик справа сверху */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Заголовок */}
        <h2 className="text-xl font-bold text-gray-900 mb-3">{pin.title}</h2>

        {/* Описание */}
        <p className="text-gray-700 mb-4 leading-relaxed">{pin.description}</p>

        {/* Цена */}
        {pin.price && (
          <div className="mb-4">
            <span className="text-2xl font-bold text-pin-primary">
              {pin.price}₽
            </span>
          </div>
        )}

        {/* Контакт - показываем только для чужих пинов */}
        {pin.contact_info?.phone && !pin.is_own && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">Контакт:</p>
            <button
              onClick={() => {
                // Предлагаем звонок
                const phoneNumber = pin.contact_info.phone?.replace(/\D/g, '');
                if (phoneNumber) {
                  // Попытка открыть приложение телефонии
                  window.location.href = `tel:${phoneNumber}`;
                }
              }}
              className="w-full bg-pin-primary text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
            >
              <span>📞</span>
              <span>Связаться</span>
            </button>
          </div>
        )}

        {/* Кнопка удаления для своих пинов */}
        {pin.is_own && (
          <button
            onClick={handleDeletePin}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Удалить Pin
          </button>
        )}

        {/* Время создания */}
        <div className="text-xs text-gray-400 mt-4">
          Создан:{' '}
          {(() => {
            try {
              const date = new Date(pin.created_at);
              // Проверяем валидность даты
              if (isNaN(date.getTime())) {
                console.warn('Invalid date:', pin.created_at);
                return 'Дата неизвестна';
              }
              return date.toLocaleString('ru-RU', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });
            } catch (e) {
              console.error('Date parsing error:', e, pin.created_at);
              return 'Ошибка даты';
            }
          })()}
        </div>
      </div>
    </div>
  );
}
