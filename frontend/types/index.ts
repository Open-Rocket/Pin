export interface Pin {
  id: string;
  title: string;
  description: string;
  price?: number;
  contact_info: {
    phone?: string;
    email?: string;
    telegram?: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  created_at: string;
  expires_at: string;
  is_active: boolean;
  views_count: number;
  owner_id?: string;
  is_own?: boolean;
}

export interface User {
  id: string;
  phone?: string;
  email?: string;
  telegram?: string;
  preferred_contact_method?: 'phone' | 'email' | 'telegram';
  language: string;
}

export interface CreatePinData {
  title: string;
  description: string;
  price?: number;
  contact_info: {
    phone?: string;
    email?: string;
    telegram?: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  created_at?: string;
  expires_at?: string;
  expires_in_hours?: number;
}
