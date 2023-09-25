import React from 'react';

import Navigation from './Navigation';
import useDrawer from '../store/useDrawer';

import { SDrawer } from './Drawer.styled';

const Drawer = ({ open, handleDrawerToggle }) => {
  const { isDrawerOpen } = useDrawer((state) => ({
    isDrawerOpen: state.isDrawerOpen,
  }));

  return (
    <SDrawer open={open || isDrawerOpen}>
      <Navigation open={open} handleDrawerToggle={handleDrawerToggle} />
    </SDrawer>
  );
};

export default Drawer;
