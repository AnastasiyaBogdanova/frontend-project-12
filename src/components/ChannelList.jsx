// src/components/ChannelList.jsx
import { NavLink, Stack, Text } from '@mantine/core';
import { useChannels } from '../api/queries';
import useUIStore from '../store/ui';

const ChannelList = () => {
  const { data: channels, isLoading, isError } = useChannels();
  const currentChannelId = useUIStore((state) => state.currentChannelId);
  const setCurrentChannelId = useUIStore((state) => state.setCurrentChannelId);

  if (isLoading) return <Text>Загрузка каналов...</Text>;
  if (isError) return <Text c="red">Не удалось загрузить каналы</Text>;

  return (
    <Stack gap="xs">
      {channels.map((channel) => (
        <NavLink
          key={channel.id}
          label={channel.name}
          active={channel.id === currentChannelId}
          onClick={() => setCurrentChannelId(channel.id)}
        />
      ))}
    </Stack>
  );
};

export default ChannelList;