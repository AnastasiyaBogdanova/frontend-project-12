// src/components/ChannelList.jsx
import { NavLink, Stack, Text, Group, ActionIcon, Menu, Button, Box } from '@mantine/core';
import { IconPlus, IconDots, IconEdit, IconTrash } from '@tabler/icons-react'; // Понадобится установить @tabler/icons-react
import { useChannels } from '../api/queries';
import useUIStore from '../store/ui';

const ChannelList = () => {
  const { data: channels, isLoading, isError } = useChannels();
  const currentChannelId = useUIStore((state) => state.currentChannelId);
  const setCurrentChannelId = useUIStore((state) => state.setCurrentChannelId);
  const openModal = useUIStore((state) => state.openModal);

  if (isLoading) return <Text>Загрузка каналов...</Text>;
  if (isError) return <Text c="red">Не удалось загрузить каналы</Text>;

  return (
    <Stack gap="xs">
      <Group justify="space-between" mb="sm">
        <Text fw={500}>Каналы</Text>
        <ActionIcon
          variant="light"
          color="blue"
          onClick={() => openModal('create')}
          title="Создать канал"
        >
          <IconPlus size={16} />
        </ActionIcon>
      </Group>

      {channels.map((channel) => {
        const isRemovable = channel.removable;

        return (
          <Group key={channel.id} wrap="nowrap" gap={0} justify="space-between">
            <NavLink
              label={`# ${channel.name}`}
              active={channel.id === currentChannelId}
              onClick={() => setCurrentChannelId(channel.id)}
              style={{ flex: 1, overflow: 'hidden' }}
              rightSection={null}
            />

            {isRemovable && (
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={() => openModal('rename', channel.id)}
                  >
                    Переименовать
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    leftSection={<IconTrash size={14} />}
                    onClick={() => openModal('delete', channel.id)}
                  >
                    Удалить
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        );
      })}
    </Stack>
  );
};

export default ChannelList;