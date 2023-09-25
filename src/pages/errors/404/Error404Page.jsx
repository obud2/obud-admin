import React from 'react';

import { Button, Typography } from 'antd';

import { useNavigate } from 'react-router-dom';
import { SError404Page } from './Error404Page.style';

const Error404Page = () => {
  const navigator = useNavigate();

  return (
    <SError404Page>
      <h3 className="error-title">
        Oops! <span>404</span>
      </h3>

      <p className="error-text">페이지를 찾을 수 없습니다.</p>

      <Button variant="contained" color="primary" onClick={() => navigator(-1)}>
        이전 페이지
      </Button>
    </SError404Page>
  );
};

export default Error404Page;
