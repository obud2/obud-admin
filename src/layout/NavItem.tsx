import React, { useContext, useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { NavigationContext } from '../context/NavigationContext';

import CustomIcon from './CustomIcon';
import { SNavItem } from './NavItem.styled';
import useDrawer from '../store/useDrawer';

type Props = {
  item: any; // TODO: type
  activeCheck?: (isActive: boolean) => void;
};

const NavItem = ({ item, activeCheck }: Props) => {
  const location = useLocation();
  const navigator = useNavigate();

  const { open } = useContext(NavigationContext);
  const { isDrawerOpen } = useDrawer((state) => ({
    isDrawerOpen: state.isDrawerOpen,
  }));

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const url = item?.url?.split('/');
    const path = location?.pathname?.split('/');

    if (url[0] === path[0] && url[1] === path[1] && url[2] === path[2]) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [location]);

  useEffect(() => {
    if (activeCheck) {
      activeCheck(isActive);
    }
  }, [isActive]);

  const onRouter = () => {
    if (item?.type === 'link') {
      window.open(item?.url);
    } else {
      navigator(item?.url);
    }
  };

  return (
    item.isShow && (
      <SNavItem active={isActive} onClick={onRouter} open={open || isDrawerOpen}>
        {item.icon && <CustomIcon type={item.icon} style={{ fontSize: '18px' }} theme="Outlined" />}
        <p className="nav-title">{item.title}</p>
      </SNavItem>
    )
  );
};

export default NavItem;
