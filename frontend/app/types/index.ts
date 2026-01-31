export interface CreatePinData {
  description: string;
  location: { lat: number; lng: number };
  created_at: string;
  expires_at: string;
  tgUsername?: string;
}
