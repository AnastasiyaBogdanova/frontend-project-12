// src/components/modals/RenameChannelModal.jsx
import { Modal, TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import * as Yup from 'yup';
import { useRenameChannel } from '../../api/mutations';
import { useUIStore } from '../../store/StoreProvider';
import { useChannels } from '../../api/queries';

const RenameChannelModal = () => {
  const { t } = useTranslation();
  const { modal, closeModal } = useUIStore();
  const { data: channels = [] } = useChannels();
  const { mutate, isPending, error } = useRenameChannel();

  const currentChannel = channels.find((ch) => ch.id === modal.channelId);

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('channels.modal.errors.nameLength'))
      .max(20, t('channels.modal.errors.nameLength'))
      .required(t('channels.modal.errors.nameLength'))
      .test(
        'unique-name',
        t('channels.modal.errors.nameExists'),
        (value) => !channels.some((ch) => ch.name === value && ch.id !== modal.channelId)
      ),
  });

  const form = useForm({
    initialValues: { name: currentChannel?.name || '' },
    validate: yupResolver(schema),
  });

  const handleSubmit = (values) => {
    mutate(
      { id: modal.channelId, name: values.name },
      {
        onSuccess: () => {
          closeModal();
          notifications.show({
            title: t('notifications.successTitle'),
            message: t('channels.renamed'),
            color: 'green',
            icon: <IconCheck size={16} />,
          });
        },
        onError: () => {
          notifications.show({
            title: t('notifications.errorTitle'),
            message: t('messages.sendError'),
            color: 'red',
            icon: <IconX size={16} />,
          });
        },
      }
    );
  };

  return (
    <Modal opened={modal.type === 'rename'} onClose={closeModal} title={t('channels.modal.renameTitle')} centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={t('channels.modal.nameLabel')}
          placeholder={t('channels.modal.namePlaceholder')}
          data-autofocus
          key={form.key('name')}
          {...form.getInputProps('name')}
          error={form.errors.name || error?.message}
          disabled={isPending}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeModal} disabled={isPending}>
            {t('channels.modal.cancel')}
          </Button>
          <Button type="submit" loading={isPending}>
            {t('channels.modal.renameSubmit')}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default RenameChannelModal;