// src/store/ui.js
import { create } from 'zustand';

const useUIStore = create((set) => ({
  currentChannelId: null,
  setCurrentChannelId: (id) => set({ currentChannelId: id }),

  isCreateChannelModalOpen: false,
  openCreateChannelModal: () => set({ isCreateChannelModalOpen: true }),
  closeCreateChannelModal: () => set({ isCreateChannelModalOpen: false }),
}));

export default useUIStore;