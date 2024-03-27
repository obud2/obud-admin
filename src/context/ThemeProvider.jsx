import React, { useContext } from 'react';

import { ConfigProvider } from 'antd';
import { GlobalContext } from './GlobalContext';

import { ThemeProvider as Provider, createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

// Theme Styled
const GlobalStyle = createGlobalStyle`
  ${normalize}
 
  html {
    font-size: 62.5%;
  }
  
  body {
    position: relative;
  }

`;

const ThemeProvider = ({ children }) => {
  // 각 프로젝트 별 메인 컬러 지정
  const BasicColor = {
    mainColor: '#344235',

    subColor: '#555555',
    subColor2: '#8b8b8b',
    subColor3: '#ABABAB',
  };

  const darkTheme = {
    theme: 'dark',
    background: '#353535',
    textColor: 'rgba(255,255,255,0.7)',
    hoverColor: 'rgba(255,255,255,0.1)',
    lineColor: 'rgba(255, 255, 255, 0.1)',

    ...BasicColor,
  };

  const lightTheme = {
    theme: 'light',
    background: '#FFFFFF',
    textColor: 'rgba(0,0,0,0.7)',
    hoverColor: '#f3f5f9',
    lineColor: 'rgba(0, 0, 0, 0.1)',

    ...BasicColor,
  };

  const currentTheme = useContext(GlobalContext);
  let theme;
  switch (currentTheme.theme) {
    case 'dark':
      theme = darkTheme;
      break;
    case 'light':
      theme = lightTheme;
      break;
    default:
      theme = lightTheme;
  }

  return (
    <ConfigProvider // Antd 테마
      theme={{
        token: {
          colorPrimary: BasicColor?.mainColor,
        },
      }}
    >
      <Provider theme={theme}>
        <GlobalStyle />

        {children}
      </Provider>
    </ConfigProvider>
  );
};

export default ThemeProvider;
