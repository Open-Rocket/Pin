'use client';

import { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: string) => void;
  initialContact?: string;
}

export default function ContactModal({
  isOpen,
  onClose,
  onSave,
  initialContact = '+7 976 888 76 55',
}: ContactModalProps) {
  const [contact, setContact] = useState(initialContact);

  if (!isOpen) return null;

  const handleSave = () => {
    if (contact.trim()) {
      onSave(contact.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        data-allow-scroll
        className="w-full bg-white rounded-t-3xl p-6 modal-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Контакт для связи с вами
        </h3>
        <input
          type="tel"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="+7 999 999 99 99"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pin-primary mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-pin-primary text-white rounded-lg font-medium hover:bg-opacity-90"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
