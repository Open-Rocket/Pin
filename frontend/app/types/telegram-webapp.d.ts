interface Window {
  Telegram: {
    WebApp: {
      ready: () => void;
      requestLocation?: () => void;
      requestFullscreen?: () => void;
      disableVerticalSwipes?: () => void;
      onEvent?: (
        event:
          | 'locationChanged'
          | 'qrTextReceived'
          | 'scanQrPopupClosed'
          | 'mainButtonClicked',
        handler: (data?: Record<string, unknown>) => void,
      ) => void;
      offEvent?: (
        event:
          | 'locationChanged'
          | 'qrTextReceived'
          | 'scanQrPopupClosed'
          | 'mainButtonClicked',
        handler: (data?: Record<string, unknown>) => void,
      ) => void;
      expand: () => void;

      isFullscreen?: boolean;
      initDataUnsafe?: {
        user?: {
          photo_url?: string;
          id: number;
          first_name?: string;
          last_name?: string;
          username?: string;
          allows_write_to_pm?: boolean;
        };
      };
      DeviceStorage?: {
        setItem: (
          key: string,
          value: string,
          callback?: (err: string | null, success?: boolean) => void,
        ) => void;
        getItem: (
          key: string,
          callback: (err: string | null, value?: string) => void,
        ) => void;
        removeItem: (
          key: string,
          callback?: (err: string | null, success?: boolean) => void,
        ) => void;
        clear: (
          callback?: (err: string | null, success?: boolean) => void,
        ) => void;
      };
    };
  };
}
