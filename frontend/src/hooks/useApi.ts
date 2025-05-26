import { useCallback } from 'react';

interface HttpError extends Error {
  status?: number;
}

import { config } from '../config/config';
import Cookies from 'js-cookie';

interface ApiError {
  message: string;
  status: number;
}

export const useApi = () => {
  const fetchWithAuth = useCallback(
    async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
      const contentType =
        options?.headers && (options.headers as Record<string, string>)['Content-Type']
          ? (options.headers as Record<string, string>)['Content-Type']
          : 'application/json';
      const headers = {
        'Content-Type': contentType,
        Authorization: `Bearer ${Cookies.get('authToken')}`,
        ...options?.headers,
      };

      try {
        const response = await fetch(`${config.API_URL}${endpoint}`, {
          ...options,
          headers,
        });

        if (!response.ok) {
          const error = new Error(`HTTP error! status: ${response.status}`);
          (error as HttpError).status = response.status;
          throw error;
        }

        return await response.json();
      } catch (error) {
        return Promise.reject({
          message:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
          status:
            error instanceof Error && 'status' in error
              ? (error as HttpError).status
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

export type UseApiType = ReturnType<typeof useApi>;
