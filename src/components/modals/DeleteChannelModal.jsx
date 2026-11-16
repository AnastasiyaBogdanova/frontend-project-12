// src/components/modals/DeleteChannelModal.jsx
import { Modal, Text, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useDeleteChannel } from '../../api/mutations';
import useUIStore from '../../store/ui';
import { useChannels } from '../../api/queries';

const DeleteChannelModal = () => {
  const { t } = useTranslation();
  const { modal, closeModal } = useUIStore();
  const { data: channels = [] } = useChannels();
  const { mutate, isPending } = useDeleteChannel();

  const currentChannel = channels.find((ch) => ch.id === modal.channelId);

  const handleDelete = () => {
    mutate(modal.channelId, {
      onSuccess: () => {
        closeModal();
        notifications.show({
          title: t('notifications.successTitle'),
          message: t('channels.deleteSuccess'),
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      },
      onError: () => {
        notifications.show({
          title: t('notifications.errorTitle'),
          message: t('channels.actionError'),
          color: 'red',
          icon: <IconX size={16} />,
        });
      },
    });
  };

  return (
    <Modal
      opened={modal.type === 'delete'}
      onClose={closeModal}
      title={t('channels.modal.deleteTitle')}
      centered
    >
      <Text mb="md">
        {t('channels.modal.deleteConfirm', { name: currentChannel?.name })}
      </Text>
      <Group justify="flex-end">
        <Button variant="default" onClick={closeModal} disabled={isPending}>
          {t('channels.modal.cancel')}
        </Button>
        <Button color="red" onClick={handleDelete} loading={isPending}>
          {t('channels.modal.deleteSubmit')}
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteChannelModal;