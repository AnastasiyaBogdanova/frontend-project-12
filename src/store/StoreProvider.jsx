import { createContext, useContext } from 'react';
import { useStore } from 'zustand';

const StoreContext = createContext();

export const StoreProvider = ({ children, authStore, uiStore }) => (
  <StoreContext.Provider value={{ authStore, uiStore }}>
    {children}
  </StoreContext.Provider>
);

export const useAuthStore = (selector) => {
  const { authStore } = useContext(StoreContext);
  return useStore(authStore, selector);
};

export const useUIStore = (selector) => {
  const { uiStore } = useContext(StoreContext);
  return useStore(uiStore, selector);
};