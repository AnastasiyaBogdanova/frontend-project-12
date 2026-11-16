// src/api/mutations.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../store/auth';
import useUIStore from '../store/ui';

const postMessage = async ({ token, body, channelId }) => {
  const response = await fetch('/api/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ body, channelId }),
  });
  if (!response.ok) throw new Error('Не удалось отправить сообщение');
  return response.json();
};

export const useSendMessage = () => {
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (data) => postMessage({ token, ...data }),
  });
};

const fetchWithAuth = async (url, options = {}) => {
  const token = useAuthStore.getState().token;
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
  const setCurrentChannelId = useUIStore((state) => state.setCurrentChannelId);

  return useMutation({
    mutationFn: (name) => fetchWithAuth('/api/v1/channels', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
    onSuccess: (newChannel) => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      setCurrentChannelId(newChannel.id); // Переходим в созданный канал
    },
  });
};

export const useRenameChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }) => fetchWithAuth(`/api/v1/channels/${id}`, {
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
  const setCurrentChannelId = useUIStore((state) => state.setCurrentChannelId);

  return useMutation({
    mutationFn: (id) => fetchWithAuth(`/api/v1/channels/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      setCurrentChannelId(null);
    },
  });
};