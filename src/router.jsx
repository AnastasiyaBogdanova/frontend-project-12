// src/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx'; // <-- Импорт

const getRouter = (socket) => createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <App socket={socket} />
      </PrivateRoute>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default getRouter;