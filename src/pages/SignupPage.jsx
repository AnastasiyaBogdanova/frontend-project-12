// src/pages/SignupPage.jsx
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import { TextInput, PasswordInput, Button, Box, Title, Container, Alert, Anchor, Text } from '@mantine/core';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useAuthStore } from '../store/StoreProvider';

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);
  const [authError, setAuthError] = useState(null);

  const schema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('signup.errors.usernameLength', 'От 3 до 20 символов'))
      .max(20, t('signup.errors.usernameLength', 'От 3 до 20 символов'))
      .required(t('signup.errors.usernameLength', 'От 3 до 20 символов')),
    password: Yup.string()
      .min(6, t('signup.errors.passwordLength', 'Не менее 6 символов'))
      .required(t('signup.errors.passwordLength', 'Не менее 6 символов')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('signup.errors.passwordsMismatch', 'Пароли должны совпадать'))
      .required(t('signup.errors.passwordsMismatch', 'Пароли должны совпадать')),
  });

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate: yupResolver(schema),
  });

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (values) => {
    setAuthError(null);

    try {
      const response = await fetch('/api/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: values.username, password: values.password }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(t('signup.errors.userExists', 'Такой пользователь уже существует'));
        }
        throw new Error(t('signup.errors.general', 'Ошибка при регистрации'));
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
      <Title ta="center" mb="lg">{t('signup.title', 'Регистрация')}</Title>

      {authError && (
        <Alert color="red" title={t('signup.errorTitle', 'Ошибка')} mb="md">
          {authError}
        </Alert>
      )}

      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={t('signup.usernameLabel', 'Имя пользователя')}
          placeholder={t('signup.usernamePlaceholder', 'От 3 до 20 символов')}
          key={form.key('username')}
          {...form.getInputProps('username')}
        />

        <PasswordInput
          label={t('signup.passwordLabel', 'Пароль')}
          placeholder={t('signup.passwordPlaceholder', 'Не менее 6 символов')}
          mt="md"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        <PasswordInput
          label={t('signup.confirmPasswordLabel', 'Подтвердите пароль')}
          placeholder={t('signup.confirmPasswordPlaceholder', 'Пароли должны совпадать')}
          mt="md"
          key={form.key('confirmPassword')}
          {...form.getInputProps('confirmPassword')}
        />

        <Button type="submit" fullWidth mt="xl">
          {t('signup.submit', 'Зарегистрироваться')}
        </Button>

        <Text ta="center" mt="md">
          {t('signup.hasAccount', 'Уже есть аккаунт?')} <Anchor component={Link} to="/login">{t('signup.loginLink', 'Войти')}</Anchor>
        </Text>
      </Box>
    </Container>
  );
};

export default SignupPage;