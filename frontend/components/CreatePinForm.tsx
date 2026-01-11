'use client';

import { useState, useEffect, useRef } from 'react';
import { CreatePinData } from '@/types';
import { useTelegram } from '@/hooks/useTelegram';

interface CreatePinFormProps {
  location: { lat: number; lng: number };
  onClose: () => void;
  onSubmit: (data: CreatePinData) => void;
}

export default function CreatePinForm({
  location,
  onClose,
  onSubmit,
}: CreatePinFormProps) {
  const { expand, isTelegram } = useTelegram();
  const formRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('+7 999 999 99 99');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Вызываем expand() при открытии формы
  useEffect(() => {
    if (isTelegram) {
      expand();
      const timeout = setTimeout(() => {
        expand();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [expand, isTelegram]);

  // Обработчик скролла в форме с debounce
  useEffect(() => {
    const formElement = formRef.current;
    if (!formElement || !isTelegram) return;

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        expand();
      }, 50); // Debounce 50ms
    };

    formElement.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      formElement.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, [expand, isTelegram]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Заголовок обязателен';
    }

    if (!description.trim()) {
      newErrors.description = 'Описание обязательно';
    }

    if (description.length > 500) {
      newErrors.description = 'Описание не должно превышать 500 символов';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 1 * 60 * 60 * 1000); // 1 hour from now

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      price: price ? parseFloat(price) : undefined,
      contact_info: {
        phone: contact.trim() || undefined,
      },
      location,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        ref={formRef}
        data-allow-scroll
        className="w-full bg-white rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto modal-slide-up modal-content"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={() => {
          if (isTelegram) {
            expand();
          }
        }}
        onTouchMove={() => {
          if (isTelegram) {
            expand();
          }
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Создать Pin</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Заголовок */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Введите заголовок Pin-а
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors({ ...errors, title: '' });
              }}
              placeholder="Заголовок"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-pin-primary'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Опишите ваш Pin
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors({ ...errors, description: '' });
              }}
              placeholder="Описание"
              rows={4}
              maxLength={500}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-pin-primary'
              }`}
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${
                  description.length > 450 ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {description.length}/500
              </span>
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Цена */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сколько вы предлагаете в ₽?
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="100₽"
              min="0"
              step="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pin-primary"
            />
          </div>

          {/* Контакт */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Контакт для связи с вами
            </label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+7 999 999 99 99"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pin-primary"
            />
          </div>

          {/* Кнопка разместить */}
          <button
            type="submit"
            className="w-full bg-pin-primary text-white py-4 rounded-lg font-medium text-lg hover:bg-opacity-90 transition-colors"
          >
            Разместить
          </button>
        </form>
      </div>
    </div>
  );
}
