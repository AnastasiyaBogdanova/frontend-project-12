// src/api/queries.js
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../store/auth';

const fetchChannels = async (token) => {
  const response = await fetch('/api/v1/channels', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Ошибка загрузки каналов');
  return response.json();
};

const fetchMessages = async (token) => {
  const response = await fetch('/api/v1/messages', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Ошибка загрузки сообщений');
  return response.json();
};

export const useChannels = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ['channels'],
    queryFn: () => fetchChannels(token),
    enabled: !!token,
  });
};

export const useMessages = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ['messages'],
    queryFn: () => fetchMessages(token),
    enabled: !!token,
  });
};