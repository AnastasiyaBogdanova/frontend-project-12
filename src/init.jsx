// src/init.jsx
import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import '@mantine/core/styles.css';
import i18n from './i18n.js';
import getRouter from './router.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const init = async (socket) => {
  const router = getRouter(socket);

  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider defaultColorScheme="auto">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </MantineProvider>
    </I18nextProvider>
  );
};

export default init;