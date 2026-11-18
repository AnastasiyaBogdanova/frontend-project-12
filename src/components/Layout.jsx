// src/components/Layout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Container, Group, Title, Button, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/StoreProvider';

const Layout = () => {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const username = useAuthStore((state) => state.username);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Container size="xl" mt="md" mb="xl">
        <Group justify="space-between">
          <Title
            order={2}
            component={Link}
            to="/"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {t('header.title', 'Hexlet Chat')}
          </Title>

          {token && (
            <Group>
              <Text size="sm">{t('header.user', { username })}</Text>
              <Button variant="outline" color="red" size="xs" onClick={handleLogout}>
                {t('header.logout', 'Выйти')}
              </Button>
            </Group>
          )}
        </Group>
      </Container>

      <Container size="xl">
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;