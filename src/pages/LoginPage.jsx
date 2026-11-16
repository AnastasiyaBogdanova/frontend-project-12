// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Box, Title, Container, Alert, Anchor, Text } from '@mantine/core';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/auth';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);
  const [authError, setAuthError] = useState(null);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length > 0 ? null : t('login.errors.usernameRequired')),
      password: (value) => (value.length > 0 ? null : t('login.errors.passwordRequired')),
    },
  });

  if (token) {
    return <Navigate to="/" replace />;
  }

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
        throw new Error(t('login.errors.invalidCredentials'));
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
      <Title ta="center" mb="lg">{t('login.title')}</Title>

      {authError && (
        <Alert color="red" title={t('login.errorTitle', 'Ошибка авторизации')} mb="md">
          {authError}
        </Alert>
      )}

      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={t('login.username')}
          placeholder={t('login.username')}
          withAsterisk
          key={form.key('username')}
          {...form.getInputProps('username')}
        />

        <PasswordInput
          label={t('login.password')}
          placeholder={t('login.password')}
          withAsterisk
          mt="md"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        <Button type="submit" fullWidth mt="xl">
          {t('login.submit')}
        </Button>
        <Text ta="center" mt="md">
          {t('login.noAccount')} <Anchor component={Link} to="/signup">{t('login.signupLink')}</Anchor>
        </Text>
      </Box>
    </Container>
  );
};

export default LoginPage;