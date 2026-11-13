// src/init.jsx
import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; // Импорт базовых стилей Mantine
import getRouter from './router.jsx';

const init = async (socket) => {
  const router = getRouter(socket);

  return (
    <MantineProvider defaultColorScheme="auto">
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default init;