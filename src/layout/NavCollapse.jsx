import React, { useState, useEffect, useRef, useContext } from 'react';

import { NavigationContext } from '../context/NavigationContext';
import { useLocation } from 'react-router-dom';

import CustomIcon from './CustomIcon';
import { SNavChildren, SNavCollapse } from './NavCollapse.styled';

import NavItem from './NavItem';
import useDrawer from '../store/useDrawer';

const NavCollapse = ({ item }) => {
  const location = useLocation();

  const { open } = useContext(NavigationContext);
  const { isDrawerOpen } = useDrawer((state) => ({
    isDrawerOpen: state.isDrawerOpen,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
  }, [location]);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const onActiveCheck = (e) => {
    if (e) {
      setActive(e);
    }
  };

  return (
    item?.isShow && (
      <React.Fragment>
        <SNavCollapse onClick={handleClick} open={open || isDrawerOpen} active={isActive}>
          {item.icon && <CustomIcon type={item.icon} style={{ fontSize: '18px' }} theme="Outlined" />}
          <p className="nav-title">{item.title}</p>
          <div className={`nav-collapes-more ${isOpen ? 'active' : ''}`} />
        </SNavCollapse>

        <NavChildren open={(open || isDrawerOpen) && isOpen && item?.children} item={item} onActiveCheck={onActiveCheck} />
      </React.Fragment>
    )
  );
};

const NavChildren = ({ open, item, onActiveCheck }) => {
  const navChildrenRef = useRef();

  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (navChildrenRef?.current?.children) {
      let eleHeight = 0;

      for (let i = 0; navChildrenRef.current.children?.length > i; i++) {
        eleHeight += navChildrenRef.current.children[i].clientHeight;
      }

      setHeight(eleHeight);
    }
  }, [navChildrenRef, item, open]);

  return (
    <SNavChildren ref={navChildrenRef} height={height} open={open}>
      {item?.children?.map(
        (item, i) =>
          (item.type === 'item' || item.type === 'link') && (
            <NavItem key={`navCollapse_${i}_${item.id}`} item={item} activeCheck={onActiveCheck} />
          ),
      )}
    </SNavChildren>
  );
};

export default NavCollapse;
