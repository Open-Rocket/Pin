'use client';

interface BottomBarProps {
  onShowSettings?: () => void;
}

export default function BottomBar({ onShowSettings }: BottomBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 px-4 py-3 flex items-center justify-center">
      {/* Кнопка настроек */}
      <button
        onClick={onShowSettings}
        className="w-12 h-12 bg-black rounded-full flex items-center justify-center"
      >
        <span className="text-white text-xl">⚙️</span>
      </button>
    </div>
  );
}
