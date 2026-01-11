const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

console.log('API_BASE_URL:', API_BASE_URL);

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('GET request to:', fullUrl);
    const response = await fetch(fullUrl);
    console.log('Response status:', response.status, response.statusText);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('POST request to:', fullUrl, data);
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('PATCH request to:', fullUrl, data);
    const response = await fetch(fullUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(endpoint: string): Promise<void> {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('DELETE request to:', fullUrl);
    const response = await fetch(fullUrl, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
  },
};
