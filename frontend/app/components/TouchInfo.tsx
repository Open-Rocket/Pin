'use client';

import React from 'react';
import Image from 'next/image';

export const TouchInfo: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 'calc(var(--tg-content-safe-area-inset-top, 0px) + 5%)',
        left: 'calc(var(--tg-content-safe-area-inset-left, 0px) + 5%)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: 'fit-content',
        height: '60px',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <Image src="/touch.svg" alt="Touch" width={32} height={32} />
      <span
        style={{
          fontSize: '13px',
          lineHeight: '1',
          color: '#000',
        }}
      >
        Коснись карты и создай Pin
      </span>
    </div>
  );
};
