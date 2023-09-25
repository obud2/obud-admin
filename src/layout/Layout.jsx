import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';

import awsmobile from '../../aws-exports';
import Amplify, { Auth } from 'aws-amplify';

import Header from './Header';
import Drawer from './Drawer';
import Main from './Main';
import Footer from './Footer';

import moment from 'moment';
import jwt_decode from 'jwt-decode';

import { getJwt, loginCheck, userLogout } from '../constants';
import { useLocation, useNavigate } from 'react-router-dom';

import { NavigationContext } from '../context/NavigationContext';

import ErrorBoundary from './ErrorBoundary';
import { Spin } from 'antd';

import { tokenRefresh } from '../constants/axiosInstance';

Amplify.configure(awsmobile);

const Layout = ({ isLoading, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const USER_TOKEN = getJwt();

  const { open, handleDrawerToggle } = useContext(NavigationContext);

  const [delay, setDelay] = useState('');
  const [isLayoutHide, setIsLayoutHide] = useState(false);

  const [isDelay, setIsDelay] = useState(true);

  useLayoutEffect(() => {
    switch (location?.pathname) {
      case '/mobile/menu':
        setIsLayoutHide(true);
        break;
      case '/pages/auth/login':
        setIsLayoutHide(true);
        break;
      case '/pages/auth/register':
        setIsLayoutHide(true);
        break;
      case '/pages/auth/forgot-password':
        setIsLayoutHide(true);
        break;
      default:
        setIsLayoutHide(false);
        break;
    }

    setIsDelay(false);
  }, [location]);

  useEffect(() => {
    if (!isDelay) {
      if (!loginCheck() && !isLayoutHide) {
        userLogout();

        Auth.signOut().then(() => {
          goLogin();
        });
      }
    }
  }, [isLayoutHide, isDelay]);

  useEffect(() => {
    if (USER_TOKEN) {
      const decoded = jwt_decode(USER_TOKEN, { complete: true });

      if (decoded) {
        const exp = moment(decoded.exp * 1000);

        if (delay) clearInterval(delay);

        const interval = setInterval(() => {
          const now = moment();
          const diff = exp.diff(now, 'minutes');

          console.log(`토큰 만료 : ${diff}분`);

          if (diff < 10) {
            tokenRefresh().then(() => {
              window.location.reload();
            });
          }
        }, [7000]);

        setDelay(interval);
      }
    }
  }, []);

  const goLogin = () => {
    navigate('/pages/auth/login');
  };

  if (isLayoutHide) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  return (
    <React.Fragment>
      <Header />
      <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />

      <Main open={open}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </Main>

      {isLoading && <Fallback />}

      <Footer />
    </React.Fragment>
  );
};

const Fallback = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}
    >
      <Spin spinning={true} />
    </div>
  );
};

export default Layout;
