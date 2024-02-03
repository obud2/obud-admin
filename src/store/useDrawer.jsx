import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useDrawer = create(
  devtools((set) => ({
    isDrawerOpen: false,

    onChangeDrawer: (boolean) => {
      set({ isDrawerOpen: boolean });
    },
  })),
);

export default useDrawer;
