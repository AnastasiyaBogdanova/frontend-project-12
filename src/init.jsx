// src/init.jsx
import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import * as Sentry from '@sentry/react';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import i18n from './i18n.js';
import getRouter from './router.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      notifications.show({
        title: i18n.t('notifications.errorTitle'),
        message: error.message || i18n.t('errors.network'),
        color: 'red',
      });
    },
  }),
});

const init = async (socket) => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [],
      tracesSampleRate: 0,
    });
  }

  const router = getRouter(socket);

  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider defaultColorScheme="auto">
        <Notifications position="top-right" zIndex={1000} />
        <QueryClientProvider client={queryClient}>
          <Sentry.ErrorBoundary fallback={<p>Произошла непредвиденная ошибка.</p>}>
            <RouterProvider router={router} />
          </Sentry.ErrorBoundary>
        </QueryClientProvider>
      </MantineProvider>
    </I18nextProvider>
  );
};

export default init;