// src/hooks/useSocketMessages.js
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useSocketMessages = (socket) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      queryClient.setQueryData(['messages'], (oldMessages) => {
        if (!oldMessages) return [newMessage];

        const exists = oldMessages.some(
          (msg) => String(msg.id) === String(newMessage.id)
        );

        if (exists) {
          return oldMessages;
        }

        return [...oldMessages, newMessage];
      });
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, queryClient]);
};