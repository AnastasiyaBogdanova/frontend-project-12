// src/components/MessageForm.jsx
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import { TextInput, Button, Group, Loader } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import * as Yup from 'yup';
import { useSendMessage } from '../api/mutations';
import { useUIStore } from '../store/StoreProvider';
import filter from '../utils/profanity';

const MessageForm = () => {
  const { t } = useTranslation();
  const currentChannelId = useUIStore((state) => state.currentChannelId);
  const { mutate, isPending } = useSendMessage();

  const schema = Yup.object().shape({
    body: Yup.string().trim().required(t('messages.emptyError', 'Сообщение не может быть пустым')),
  });

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { body: '' },
    validate: yupResolver(schema),
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