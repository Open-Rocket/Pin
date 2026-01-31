'use client';

import GlobeMap from './components/GlobeMap';
import { TelegramInit } from './components/TelegramInit';

export default function Home() {
  return (
    <div>
      <TelegramInit />
      <GlobeMap />
    </div>
  );
}
