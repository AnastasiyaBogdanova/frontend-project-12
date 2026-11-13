// src/App.jsx
import { Container, Title, Text } from '@mantine/core';

const App = ({ socket }) => {

  return (
    <Container size="md" mt="xl">
      <Title order={1}>Hexlet Chat</Title>
      <Text mt="md">Здесь будет основной интерфейс чата.</Text>
      {/* Кнопка для перехода на страницу логина, чтобы проверить роутинг */}
      <Text mt="lg">
        <a href="/login">Перейти на страницу входа (тест)</a>
      </Text>
    </Container>
  );
};

export default App;