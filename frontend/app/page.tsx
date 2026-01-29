'use client';

import StreetMap from './components/Map';
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
