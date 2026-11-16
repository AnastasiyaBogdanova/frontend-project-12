// src/components/modals/CreateChannelModal.jsx
import { Modal, TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCreateChannel } from '../../api/mutations';
import useUIStore from '../../store/ui';
import { useChannels } from '../../api/queries';

const CreateChannelModal = () => {
  const { modal, closeModal } = useUIStore();
  const { data: channels = [] } = useChannels();
  const { mutate, isPending, error } = useCreateChannel();

  const form = useForm({
    initialValues: { name: '' },
    validate: {
      name: (value) => {
        if (value.length < 3) return 'От 3 до 20 символов';
        if (value.length > 20) return 'От 3 до 20 символов';
        if (channels.some((ch) => ch.name === value)) return 'Канал с таким именем уже существует';
        return null;
      },
    },
  });

  const handleSubmit = (values) => {
    mutate(values.name, {
      onSuccess: () => {
        form.reset();
        closeModal();
      },
    });
  };

  return (
    <Modal
      opened={modal.type === 'create'}
      onClose={closeModal}
      title="Создать канал"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Имя канала"
          placeholder="Название канала"
          data-autofocus
          key={form.key('name')}
          {...form.getInputProps('name')}
          error={form.errors.name || error?.message}
          disabled={isPending}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeModal} disabled={isPending}>Отмена</Button>
          <Button type="submit" loading={isPending}>Создать</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;