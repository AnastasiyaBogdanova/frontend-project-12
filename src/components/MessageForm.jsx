// src/components/MessageForm.jsx
import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Loader } from '@mantine/core';
import { useSendMessage } from '../api/mutations';
import useUIStore from '../store/ui';

const MessageForm = () => {
  const currentChannelId = useUIStore((state) => state.currentChannelId);
  const { mutate, isPending, isError, error } = useSendMessage();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { body: '' },
    validate: {
      body: (value) => (value.trim().length > 0 ? null : 'Сообщение не может быть пустым'),
    },
  });

  const handleSubmit = (values) => {
    if (!currentChannelId) return;
    mutate(
      { body: values.body, channelId: currentChannelId },
      {
        onSuccess: () => form.reset(),
      }
    );
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group align="flex-end" gap="sm">
        <TextInput
          placeholder="Введите сообщение..."
          style={{ flex: 1 }}
          key={form.key('body')}
          {...form.getInputProps('body')}
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader size="xs" color="white" /> : 'Отправить'}
        </Button>
      </Group>
      {isError && <Text c="red" size="sm" mt="xs">{error.message}</Text>}
    </form>
  );
};

export default MessageForm;