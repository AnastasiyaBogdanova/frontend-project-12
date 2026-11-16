// src/pages/SignupPage.jsx
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Box, Title, Container, Alert, Anchor, Text } from '@mantine/core';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import useAuthStore from '../store/auth';

const SignupPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);
  const [authError, setAuthError] = useState(null);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: (value) => {
        if (value.length < 3 || value.length > 20) return 'Имя пользователя должно быть от 3 до 20 символов';
        return null;
      },
      password: (value) => (value.length >= 6 ? null : 'Пароль должен быть не менее 6 символов'),
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Пароли не совпадают',
    },
  });

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (values) => {
    setAuthError(null);

    try {
      const response = await fetch('/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: values.username, password: values.password }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Пользователь с таким именем уже существует');
        }
        throw new Error('Ошибка при регистрации');
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
      <Title ta="center" mb="lg">Регистрация в Hexlet Chat</Title>

      {authError && (
        <Alert color="red" title="Ошибка" mb="md">
          {authError}
        </Alert>
      )}

      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Имя пользователя"
          placeholder="От 3 до 20 символов"
          withAsterisk
          key={form.key('username')}
          {...form.getInputProps('username')}
        />

        <PasswordInput
          label="Пароль"
          placeholder="Не менее 6 символов"
          withAsterisk
          mt="md"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        <PasswordInput
          label="Подтверждение пароля"
          placeholder="Повторите пароль"
          withAsterisk
          mt="md"
          key={form.key('confirmPassword')}
          {...form.getInputProps('confirmPassword')}
        />

        <Button type="submit" fullWidth mt="xl">
          Зарегистрироваться
        </Button>

        <Text ta="center" mt="md">
          Уже есть аккаунт? <Anchor component={Link} to="/login">Войти</Anchor>
        </Text>
      </Box>
    </Container>
  );
};

export default SignupPage;