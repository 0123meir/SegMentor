export const config = {
     API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
     MOCK_JWT: 'mock-jwt-token', // Remove this when implementing real auth
    } as const;
