// src/init.jsx
import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
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
  const router = getRouter(socket);

  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider defaultColorScheme="auto">
        <Notifications position="top-right" zIndex={1000} />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </MantineProvider>
    </I18nextProvider>
  );
};

export default init;