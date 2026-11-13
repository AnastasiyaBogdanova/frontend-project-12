// src/init.jsx
import App from './App.jsx';

const init = async (socket) => {
  // На этом шаге socket ещё не используется,
  // но позже сюда добавятся i18n, клиент запросов и хранилища.
  // Параметр socket сохраняется, чтобы соответствовать контракту.
  return <App socket={socket} />;
};

export default init;