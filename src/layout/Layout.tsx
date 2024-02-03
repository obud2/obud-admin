import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';

import Amplify, { Auth } from 'aws-amplify';
import awsmobile from '../../aws-exports';

import Drawer from './Drawer';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';

import jwtDecode from 'jwt-decode';
import moment from 'moment';

import { useLocation, useNavigate } from 'react-router-dom';
import { getJwt, loginCheck, userLogout } from '../constants/config';

import { NavigationContext } from '../context/NavigationContext';

import { tokenRefresh } from '../constants/axiosInstance';
import ErrorBoundary from './ErrorBoundary';

Amplify.configure(awsmobile);

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
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
      const decoded = jwtDecode(USER_TOKEN);

      if (decoded) {
        const exp = moment((decoded as any).exp * 1000);

        if (delay) clearInterval(delay);

        const interval = setInterval(() => {
          const now = moment();
          const diff = exp.diff(now, 'minutes');

          if (diff < 10) {
            tokenRefresh().then(() => {
              window.location.reload();
            });
          }
        }, 7000);

        setDelay(interval as any);
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

      <Footer />
    </React.Fragment>
  );
};

export default Layout;
