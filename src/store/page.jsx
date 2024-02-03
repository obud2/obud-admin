import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const usePage = create(
  devtools((set, get) => ({
    uPage: 0,

    pageChange: (_page) => {
      set({ uPage: _page });
    },

    clearPage: () => {
      set({ uPage: 0 });
    },
  })),
);

export default usePage;
