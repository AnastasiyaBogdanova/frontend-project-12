// src/components/modals/RenameChannelModal.jsx
import { Modal, TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRenameChannel } from '../../api/mutations';
import useUIStore from '../../store/ui';
import { useChannels } from '../../api/queries';

const RenameChannelModal = () => {
  const { modal, closeModal } = useUIStore();
  const { data: channels = [] } = useChannels();
  const { mutate, isPending, error } = useRenameChannel();

  const currentChannel = channels.find((ch) => ch.id === modal.channelId);

  const form = useForm({
    initialValues: { name: currentChannel?.name || '' },
    validate: {
      name: (value) => {
        if (value.length < 3 || value.length > 20) return 'От 3 до 20 символов';
        if (channels.some((ch) => ch.name === value && ch.id !== modal.channelId)) {
          return 'Канал с таким именем уже существует';
        }
        return null;
      },
    },
  });

  const handleSubmit = (values) => {
    mutate({ id: modal.channelId, name: values.name }, {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <Modal
      opened={modal.type === 'rename'}
      onClose={closeModal}
      title="Переименовать канал"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Новое имя"
          placeholder="Название канала"
          data-autofocus
          key={form.key('name')}
          {...form.getInputProps('name')}
          error={form.errors.name || error?.message}
          disabled={isPending}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeModal} disabled={isPending}>Отмена</Button>
          <Button type="submit" loading={isPending}>Сохранить</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default RenameChannelModal;