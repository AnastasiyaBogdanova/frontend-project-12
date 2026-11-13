// src/components/MessageList.jsx
import { ScrollArea, Text, Stack, Paper } from '@mantine/core';
import { useMessages } from '../api/queries';
import useUIStore from '../store/ui';

const MessageList = () => {
  const { data: messages, isLoading, isError } = useMessages();
  const currentChannelId = useUIStore((state) => state.currentChannelId);

  if (isLoading) return <Text>Загрузка сообщений...</Text>;
  if (isError) return <Text c="red">Не удалось загрузить сообщения</Text>;

  const filteredMessages = currentChannelId
    ? messages.filter((msg) => msg.channelId === currentChannelId)
    : messages;

  return (
    <ScrollArea h={500} offsetScrollbars>
      <Stack gap="sm">
        {filteredMessages.map((msg) => (
          <Paper key={msg.id} withBorder p="xs">
            <Text size="xs" c="dimmed">{msg.username}</Text>
            <Text>{msg.body}</Text>
          </Paper>
        ))}
      </Stack>
    </ScrollArea>
  );
};

export default MessageList;