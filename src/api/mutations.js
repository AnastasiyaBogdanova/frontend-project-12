// src/api/mutations.js
import { useMutation } from '@tanstack/react-query';
import useAuthStore from '../store/auth';

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