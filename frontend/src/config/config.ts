export const config = {
     API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
     MOCK_JWT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGY2MGQ1MDRmZmY4NmY1NmM4M2VkZSIsInVzZXJuYW1lIjoibWVpciIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQ2MDg5MTAxLCJleHAiOjE3NDYwOTI3MDF9.Z56ZH53kYmF2faRAEQReAmx7CQXMCsTGMakGwadG1FE', // Remove this when implementing real auth
    } as const;