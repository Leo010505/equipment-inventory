// Cambia esto:
// const API_URL = 'http://localhost:3000/api';

// Déjalo exactamente así (sin el '/api'):
const API_URL = 'http://localhost:3000';

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
    }

    return response.json();
};