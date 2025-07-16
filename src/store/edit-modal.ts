// src/store/edit-modal-store.ts
import { create } from "zustand";

type EditModalStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useEditModalStore = create<EditModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
