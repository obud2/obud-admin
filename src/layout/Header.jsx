import React from 'react';

import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import AvatarMenu from './AvatarMenu';

import { SOftadehAppBar } from './Header.styled';

const Header = () => {
  const navigator = useNavigate();

  const onClickGoMenuPage = () => {
    navigator('/mobile/menu');
  };

  return (
    <SOftadehAppBar>
      <Button
        type='text'
        onClick={onClickGoMenuPage}
      >
        <MenuOutlined style={{ fontSize: '18px' }} />
      </Button>

      <p className='header-title'>
        <img src='/img/obud_logo.png' />
      </p>

      <AvatarMenu />
    </SOftadehAppBar>
  );
};

export default Header;
