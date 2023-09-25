import React from 'react';

import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { SError500Page } from './Error500Page.style';

const Error500Page = (props) => {
  const navigator = useNavigate();

  return (
    <SError500Page>
      <h3 className="error-title">
        Oops! <span>500</span>
      </h3>

      <p className="error-text">페이지를 일시적으로 사용할 수 없습니다.</p>

      <Button variant="contained" color="primary" onClick={() => navigator(-1)}>
        새로고침
      </Button>
    </SError500Page>
  );
};

export default Error500Page;
