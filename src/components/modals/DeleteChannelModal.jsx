// src/components/modals/DeleteChannelModal.jsx
import { Modal, Text, Button, Group } from '@mantine/core';
import { useDeleteChannel } from '../../api/mutations';
import useUIStore from '../../store/ui';
import { useChannels } from '../../api/queries';

const DeleteChannelModal = () => {
  const { modal, closeModal } = useUIStore();
  const { data: channels = [] } = useChannels();
  const { mutate, isPending } = useDeleteChannel();

  const currentChannel = channels.find((ch) => ch.id === modal.channelId);

  const handleDelete = () => {
    mutate(modal.channelId, {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <Modal
      opened={modal.type === 'delete'}
      onClose={closeModal}
      title="Удалить канал?"
      centered
    >
      <Text mb="md">
        Вы уверены, что хотите удалить канал <b># {currentChannel?.name}</b>?
        Все сообщения в этом канале будут безвозвратно утеряны.
      </Text>
      <Group justify="flex-end">
        <Button variant="default" onClick={closeModal} disabled={isPending}>Отмена</Button>
        <Button color="red" onClick={handleDelete} loading={isPending}>Удалить</Button>
      </Group>
    </Modal>
  );
};

export default DeleteChannelModal;