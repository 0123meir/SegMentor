/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';

import { config } from '../config/config';

interface ApiError {
  message: string;
  status: number;
}

export const useApi = () => {
  const fetchWithAuth = useCallback(
    async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.MOCK_JWT}`, //TODO: replace with real JWT token
        ...options?.headers,
      };

      try {
        const response = await fetch(`${config.API_URL}${endpoint}`, {
          ...options,
          headers,
        });

        if (!response.ok) {
          const error = new Error(`HTTP error! status: ${response.status}`);
          (error as any).status = response.status;
          throw error;
        }

        return await response.json();
      } catch (error) {
        // Instead of throwing a new object, return a rejected promise
        return Promise.reject({
          message:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
          status:
            error instanceof Error && 'status' in error
              ? (error as any).status
              : 500,
        } as ApiError);
      }
    },
    []
  );

  const get = useCallback(
    <T>(endpoint: string) => fetchWithAuth<T>(endpoint),
    [fetchWithAuth]
  );

  const post = useCallback(
    <T>(endpoint: string, data: unknown) =>
      fetchWithAuth<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    [fetchWithAuth]
  );

  const put = useCallback(
    <T>(endpoint: string, data: unknown) =>
      fetchWithAuth<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    [fetchWithAuth]
  );

  const delete_ = useCallback(
    <T>(endpoint: string) =>
      fetchWithAuth<T>(endpoint, {
        method: 'DELETE',
      }),
    [fetchWithAuth]
  );

  return {
    get,
    post,
    put,
    delete: delete_,
  };
};
