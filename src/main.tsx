import './index.css';
// import 'antd/dist/reset.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import ThemeProvider from './context/ThemeProvider';
import LayoutContextProvider from './context/LayoutContext';
import UserContextProvider from './context/UserContext';
import GlobalContextProvider from './context/GlobalContext';
import NavigationContextProvider from './context/NavigationContext';
import MenuContextProvider from './context/MenuContext';

import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 50000,
      cacheTime: 50000,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      suspense: false,
      retry: 2,
    },
  },
});

const container = document.getElementById('root');

ReactDOM.createRoot(container!).render(
  <GlobalContextProvider>
    <ThemeProvider>
      <LayoutContextProvider>
        <NavigationContextProvider>
          <UserContextProvider>
            <MenuContextProvider>
              <QueryClientProvider client={queryClient}>
                <App />
              </QueryClientProvider>
            </MenuContextProvider>
          </UserContextProvider>
        </NavigationContextProvider>
      </LayoutContextProvider>
    </ThemeProvider>
  </GlobalContextProvider>,
);
