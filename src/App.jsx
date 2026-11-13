// src/App.jsx
import { Container, Grid, Title, Group, Button, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/auth';
import useUIStore from './store/ui';
import { useChannels } from './api/queries';
import ChannelList from './components/ChannelList';
import MessageList from './components/MessageList';

const App = ({ socket }) => {
  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.username);
  const navigate = useNavigate();

  const { data: channels } = useChannels();
  const currentChannelId = useUIStore((state) => state.currentChannelId);
  const setCurrentChannelId = useUIStore((state) => state.setCurrentChannelId);

  // Автоматически выбираем первый канал, если ни один не выбран
  useEffect(() => {
    if (channels?.length && !currentChannelId) {
      setCurrentChannelId(channels[0].id);
    }
  }, [channels, currentChannelId, setCurrentChannelId]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container size="xl" mt="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Hexlet Chat</Title>
        <Group>
          <Text size="sm">Пользователь: {username}</Text>
          <Button variant="outline" color="red" size="xs" onClick={handleLogout}>
            Выйти
          </Button>
        </Group>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Title order={4} mb="sm">Каналы</Title>
          <ChannelList />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <MessageList />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default App;