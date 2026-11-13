// src/pages/NotFoundPage.jsx
import { Container, Title, Text, Button } from '@mantine/core';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <Container ta="center" mt="xl">
    <Title order={1}>404</Title>
    <Text size="lg" mt="md">Страница не найдена</Text>
    <Button component={Link} to="/" mt="xl">
      Вернуться на главную
    </Button>
  </Container>
);

export default NotFoundPage;