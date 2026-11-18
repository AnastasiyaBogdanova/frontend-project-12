// src/components/MessageForm.jsx
import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Loader } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useSendMessage } from '../api/mutations';
import { useUIStore } from '../store/StoreProvider';
import filter from '../utils/profanity';

const MessageForm = () => {
  const { t } = useTranslation();
  const currentChannelId = useUIStore((state) => state.currentChannelId);
  const { mutate, isPending } = useSendMessage();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { body: '' },
    validate: {
      body: (value) => (value.trim().length > 0 ? null : t('messages.emptyError')),
    },
  });

  const handleSubmit = (values) => {
    if (!currentChannelId) return;

    const cleanedBody = filter.clean(values.body);

    mutate(
      { body: cleanedBody, channelId: currentChannelId },
      {
        onSuccess: () => form.reset(),
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
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group align="flex-end" gap="sm">
        <TextInput
          aria-label={t('messages.newMessageLabel')}
          placeholder={t('messages.placeholder')}
          style={{ flex: 1 }}
          key={form.key('body')}
          {...form.getInputProps('body')}
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader size="xs" color="white" /> : t('messages.submit')}
        </Button>
      </Group>
    </form>
  );
};

export default MessageForm;