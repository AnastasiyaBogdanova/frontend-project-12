// src/App.jsx
import { Container, Title, Text, Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './store/auth';

const App = ({ socket }) => {
  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.username);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container size="md" mt="xl">
      <Group justify="space-between">
        <Title order={1}>Hexlet Chat</Title>
        <Button variant="outline" color="red" onClick={handleLogout}>
          Выйти
        </Button>
      </Group>
      <Text mt="md">Привет, {username}! Здесь будет основной интерфейс чата.</Text>
    </Container>
  );
};

export default App;