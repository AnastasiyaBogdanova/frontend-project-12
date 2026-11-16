// src/pages/SignupPage.jsx
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Box, Title, Container, Alert, Anchor, Text } from '@mantine/core';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/auth';

const SignupPage = () => {
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
      confirmPassword: '',
    },
    validate: {
      username: (value) => {
        if (value.length < 3 || value.length > 20) return t('signup.errors.usernameLength');
        return null;
      },
      password: (value) => (value.length >= 6 ? null : t('signup.errors.passwordLength')),
      confirmPassword: (value, values) =>
        value === values.password ? null : t('signup.errors.passwordsMismatch'),
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
          throw new Error(t('signup.errors.userExists'));
        }
        throw new Error(t('signup.errors.general'));
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
      <Title ta="center" mb="lg">{t('signup.title')}</Title>

      {authError && (
        <Alert color="red" title={t('signup.errorTitle')} mb="md">
          {authError}
        </Alert>
      )}

      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={t('signup.username')}
          placeholder={t('signup.usernamePlaceholder')}
          withAsterisk
          key={form.key('username')}
          {...form.getInputProps('username')}
        />

        <PasswordInput
          label={t('signup.password')}
          placeholder={t('signup.passwordPlaceholder')}
          withAsterisk
          mt="md"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        <PasswordInput
          label={t('signup.confirmPassword')}
          placeholder={t('signup.confirmPasswordPlaceholder')}
          withAsterisk
          mt="md"
          key={form.key('confirmPassword')}
          {...form.getInputProps('confirmPassword')}
        />

        <Button type="submit" fullWidth mt="xl">
          {t('signup.submit')}
        </Button>

        <Text ta="center" mt="md">
          {t('signup.hasAccount')} <Anchor component={Link} to="/login">{t('signup.loginLink')}</Anchor>
        </Text>
      </Box>
    </Container>
  );
};

export default SignupPage;