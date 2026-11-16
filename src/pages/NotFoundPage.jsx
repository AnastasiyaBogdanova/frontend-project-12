// src/pages/NotFoundPage.jsx
import { Container, Title, Text, Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Container ta="center" mt="xl">
      <Title order={1}>{t('notFound.title')}</Title>
      <Text size="lg" mt="md">{t('notFound.message')}</Text>
      <Button component={Link} to="/" mt="xl">
        {t('notFound.back')}
      </Button>
    </Container>
  );
};

export default NotFoundPage;