'use client'

import { Pin } from '@/types'

interface PinMarkerProps {
  pin: Pin
}

export default function PinMarker({ pin }: PinMarkerProps) {
  return (
    <div className="relative cursor-pointer">
      <div className="w-8 h-8 bg-telegram-button rounded-full flex items-center justify-center shadow-lg border-2 border-white">
        <span className="text-white text-xs font-bold">📍</span>
      </div>
      {pin.price && (
        <div className="absolute -top-2 -right-2 bg-telegram-link text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
          {pin.price}₽
        </div>
      )}
    </div>
  )
}
