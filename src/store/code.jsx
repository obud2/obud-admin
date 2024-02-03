import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import CodeService from '../services/CodeService';

const useCode = create(
  devtools((set, get) => ({
    code: '',

    fetchCode: async () => {
      try {
        if (!get()?.code) {
          const res = await CodeService.getList();

          set({ code: res?.value || '' });
        }
      } catch (error) {
        console.log(error);
      }
    },

    reFetch: async () => {
      try {
        const res = await CodeService.getList();

        set({ code: res?.value || '' });
      } catch (error) {
        console.log(error);
      }
    },
  })),
);

useCode.getState().fetchCode();

export default useCode;
