// src/components/ChannelList.jsx
import { NavLink, Stack, Text, Group, ActionIcon, Menu } from '@mantine/core';
import { IconPlus, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useChannels } from '../api/queries';
import { useUIStore } from '../store/StoreProvider';

const ChannelList = () => {
  const { t } = useTranslation();
  const { data: channels, isLoading, isError } = useChannels();
  const currentChannelId = useUIStore((state) => state.currentChannelId);
  const setCurrentChannelId = useUIStore((state) => state.setCurrentChannelId);
  const openModal = useUIStore((state) => state.openModal);

  if (isLoading) return <Text>{t('channels.loading')}</Text>;
  if (isError) return <Text c="red">{t('errors.network')}</Text>;

  return (
    <Stack gap="xs">
      <Group justify="space-between" mb="sm">
        <Text fw={500}>{t('channels.title')}</Text>
        <ActionIcon
          variant="light"
          color="blue"
          onClick={() => openModal('create')}
          aria-label="+"
        >
          <IconPlus size={16} />
        </ActionIcon>
      </Group>

      {channels.map((channel) => {
        const isRemovable = channel.removable;

        return (
          <Group key={channel.id} wrap="nowrap" gap={0} justify="space-between">
            <NavLink
              component="button"
              label={`# ${channel.name}`}
              active={channel.id === currentChannelId}
              onClick={() => setCurrentChannelId(channel.id)}
              style={{ flex: 1, overflow: 'hidden' }}
              rightSection={null}
            />

            {isRemovable && (
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray" aria-label={t('channels.channelManagement')}>
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>{t('channels.channelManagement')}</Menu.Label>
                  <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => openModal('rename', channel.id)}>
                    {t('channels.rename')}
                  </Menu.Item>
                  <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={() => openModal('delete', channel.id)}>
                    {t('channels.delete')}
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