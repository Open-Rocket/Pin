'use client';

import { useTelegram } from '@/hooks/useTelegram';

export default function MapInstruction() {
  const { isTelegram } = useTelegram();

  // На мобилке (Telegram) не показываем инструкцию
  if (isTelegram) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-2 pb-8 px-4 pointer-events-none"
      style={{
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }}
    >
      <span
        className="text-3xl animate-bounce"
        style={{ animationDelay: '0s' }}
      >
        👆
      </span>
      <div className="text-center bg-white bg-opacity-90 px-4 py-2 rounded-lg">
        <p className="text-sm font-medium text-gray-900">
          Коснитесь точки на экране чтобы создать Pin с задачей в этом месте,
          например: (Подвезти до вокзала, Купить продукты, Сходить за посылкой и
          т.д)
        </p>
      </div>
    </div>
  );
}
