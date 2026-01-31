'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PinFormProps {
  location: { lat: number; lng: number };
  sheetVisible: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    description: string;
    location: { lat: number; lng: number };
    userId?: string;
    userPhoto?: string;
    created_at: string;
    expires_at: string;
  }) => void | Promise<void>;
}

export default function PinForm({
  location,
  sheetVisible,
  onClose,
  onSubmit,
}: PinFormProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    if (onSubmit) {
      await onSubmit({
        description: description.trim(),
        location,
        userId: tgUser?.id?.toString() ?? 'anonymous',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        userPhoto: tgUser?.photo_url,
      });
    }

    setDescription('');
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = sheetVisible ? 'hidden' : '';
    document.body.style.touchAction = sheetVisible ? 'none' : '';
  }, [sheetVisible]);

  const isValid = description.trim() !== '';

  return (
    <AnimatePresence>
      {sheetVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ zIndex: 999 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-0 left-0 w-full bg-white rounded-t-[24px] px-6 pt-3 pb-6 max-h-[80vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Pin</h2>
                <div className="text-right text-xs text-gray-500">
                  {description.length}/60
                </div>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Оставь мысль, статус или сообщение"
                rows={3}
                maxLength={60}
                className="w-full px-4 py-3 border bg-white border-gray-300 rounded-[24px] text-black resize-none caret-black focus:outline-none focus:ring-2 focus:ring-pin-primary"
              />

              <button
                type="submit"
                disabled={!isValid}
                className={`w-full h-16 mt-[10px] rounded-full transition-colors border ${
                  isValid
                    ? 'bg-black text-white border-black'
                    : 'bg-transparent text-black border-black'
                }`}
              >
                Создать
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
