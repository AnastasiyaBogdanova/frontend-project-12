// src/api/mutations.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useUIStore } from '../store/StoreProvider';

const postMessage = async ({ token, body, channelId }) => {
  const response = await fetch('/api/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ body, channelId }),
  });
  if (!response.ok) throw new Error('Ошибка отправки сообщения');
  return response.json();
};

export const useSendMessage = () => {
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (data) => postMessage({ token, ...data }),
  });
};

const fetchWithAuth = async (url, token, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка запроса');
  }
  if (response.status === 204) return null;
  return response.json();
};

export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const setCurrentChannelId = useUIStore((state) => state.setCurrentChannelId);

  return useMutation({
    mutationFn: (name) => fetchWithAuth('/api/v1/channels', token, {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
    onSuccess: (newChannel) => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      setCurrentChannelId(newChannel.id);
    },
  });
};

export const useRenameChannel = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: ({ id, name }) => fetchWithAuth(`/api/v1/channels/${id}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });
};

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const setCurrentChannelId = useUIStore((state) => state.setCurrentChannelId);

  return useMutation({
    mutationFn: (id) => fetchWithAuth(`/api/v1/channels/${id}`, token, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      setCurrentChannelId(null);
    },
  });
};