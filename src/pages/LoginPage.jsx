// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Box, Title, Container, Alert } from '@mantine/core';
import { useNavigate, Navigate } from 'react-router-dom';
import useAuthStore from '../store/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);
  const [authError, setAuthError] = useState(null);

  if (token) {
    return <Navigate to="/" replace />;
  }

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

  const handleSubmit = async (values) => {
    setAuthError(null);

    try {
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Неверное имя пользователя или пароль');
      }

      const data = await response.json();

      login(data.token, data.username);

      navigate('/');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" mb="lg">Вход в Hexlet Chat</Title>

      {authError && (
        <Alert color="red" title="Ошибка авторизации" mb="md">
          {authError}
        </Alert>
      )}

      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Имя пользователя"
          placeholder="Ваш ник (admin)"
          withAsterisk
          key={form.key('username')}
          {...form.getInputProps('username')}
        />

        <PasswordInput
          label="Пароль"
          placeholder="Ваш пароль (admin)"
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