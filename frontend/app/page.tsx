'use client'

import { useEffect } from 'react'
import { useTelegram } from '@/hooks/useTelegram'
import MapView from '@/components/MapView'

export default function Home() {
  const { ready, expand } = useTelegram()

  useEffect(() => {
    if (ready) {
      expand()
    }
  }, [ready, expand])

  return (
    <main className="tg-viewport">
      <MapView />
    </main>
  )
}
