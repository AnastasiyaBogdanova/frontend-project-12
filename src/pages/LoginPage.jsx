// src/pages/LoginPage.jsx
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Box, Title, Container } from '@mantine/core';

const LoginPage = () => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length > 0 ? null : 'Введите имя пользователя'),
      password: (value) => (value.length > 0 ? null : 'Введите пароль'),
    },
  });

  const handleSubmit = (values) => {
    console.log('Форма отправлена:', values);
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" mb="lg">Вход в Hexlet Chat</Title>

      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Имя пользователя"
          placeholder="Ваш ник"
          withAsterisk
          key={form.key('username')}
          {...form.getInputProps('username')}
        />

        <PasswordInput
          label="Пароль"
          placeholder="Ваш пароль"
          withAsterisk
          mt="md"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        <Button type="submit" fullWidth mt="xl">
          Войти
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;