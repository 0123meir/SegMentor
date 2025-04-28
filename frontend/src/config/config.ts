export const config = {
     API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
     MOCK_JWT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGY2MGQ1MDRmZmY4NmY1NmM4M2VkZSIsInVzZXJuYW1lIjoibWVpciIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQ1ODM4NDYyLCJleHAiOjE3NDU4NDIwNjJ9.o803ks9ynNRKYQummVofFg3HytEEguOgViUAGnVeiiQ', // Remove this when implementing real auth
    } as const;
