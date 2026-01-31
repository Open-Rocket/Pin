interface SkyLayer {
  id: string;
  type: 'sky';
  paint: {
    'sky-type': 'gradient' | 'atmosphere';
    'sky-gradient'?: any; // массив для interpolate
    'sky-gradient-center'?: [number, number];
    'sky-opacity'?: number;
    'sky-atmosphere-sun'?: [number, number, number];
    'sky-atmosphere-sun-intensity'?: number;
  };
}
