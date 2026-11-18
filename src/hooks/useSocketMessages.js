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
        const exists = oldMessages.some((msg) => String(msg.id) === String(newMessage.id));
        if (exists) return oldMessages;
        return [...oldMessages, newMessage];
      });
    };

    const handleChannelChange = () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('newChannel', handleChannelChange);
    socket.on('renameChannel', handleChannelChange);
    socket.on('removeChannel', handleChannelChange);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newChannel', handleChannelChange);
      socket.off('renameChannel', handleChannelChange);
      socket.off('removeChannel', handleChannelChange);
    };
  }, [socket, queryClient]);
};