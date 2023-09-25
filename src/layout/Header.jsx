import React from 'react';

import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

import { PROJECT_NAME } from '../constants';

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
      <Button type="text" onClick={onClickGoMenuPage}>
        <MenuOutlined style={{ fontSize: '18px' }} />
      </Button>

      <p className="header-title">{PROJECT_NAME}</p>

      <AvatarMenu />
    </SOftadehAppBar>
  );
};

export default Header;
