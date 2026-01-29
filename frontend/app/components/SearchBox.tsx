// SearchBox.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';

interface SearchBoxProps {
  mapRef: React.RefObject<MapRef | null>;
}

type Feature = {
  id: string;
  place_name: string;
  center: [number, number];
};

export function SearchBox({ mapRef }: SearchBoxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Feature[]>([]);
  const [resultsVisible, setResultsVisible] = useState(false);

  // ===== Search effect =====
  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([]);
      setResultsVisible(false);
      return;
    }

    const controller = new AbortController();

    const search = async () => {
      try {
        const res = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(
            query,
          )}.json?key=U0SQYQUL3hLC7BWkcwVL&limit=5`,
          { signal: controller.signal },
        );
        const data = await res.json();
        if (data.features?.length) {
          setResults(data.features);
          setResultsVisible(true);
        } else {
          setResults([]);
          setResultsVisible(false);
        }
      } catch (_) {}
    };

    search();

    return () => controller.abort();
  }, [query]);

  // ===== Handle select =====
  const handleSelect = (feature: Feature) => {
    setQuery(feature.place_name);
    setResultsVisible(false);

    mapRef.current?.getMap().flyTo({
      center: feature.center,
      zoom: 15,
      essential: true,
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={(e) => e.stopPropagation()} // предотвращаем всплытие в MapControls
      style={{ flex: 1, position: 'relative' }}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setResultsVisible(results.length > 0)}
        placeholder="Поиск адреса"
        style={{
          width: '100%',
          height: 52,
          padding: '0 16px',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(20,20,20,0.6)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          color: '#fff',
          outline: 'none',
          fontSize: 16,
        }}
      />

      {resultsVisible && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 0,
            right: 0,
            borderRadius: 16,
            overflowY: 'auto',
            background: 'rgba(20,20,20,0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column-reverse',
            maxHeight: 250,
            zIndex: 15,
            paddingBottom: 8,
          }}
        >
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                color: '#fff',
                borderTop: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {item.place_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
