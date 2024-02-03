import React, { useEffect, useLayoutEffect, useState } from 'react';

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../../../../aws-exports';

import { useNavigate } from 'react-router-dom';

import { APP_PREFIX, PROJECT_NAME, setJwt, setUserId } from '../../../constants/config';

import { PoweroffOutlined } from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';

import { SLoginPage } from './LoginPage.style';
import { loginCheck } from '../../../constants/config';

Amplify.configure(awsconfig);

const LoginPage = () => {
  const navigator = useNavigate();

  const [id, setId] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loginCheck()) {
      navigator('/');
    }
  }, []);

  useLayoutEffect(() => {
    const SAVE_ID = localStorage.getItem(`${APP_PREFIX}_save`);

    if (SAVE_ID) {
      setId(SAVE_ID);
    }
  }, [localStorage]);

  const handleInputChange = (type, e) => {
    if (type === 'id') setId(e.target.value);
    else setPassword(e.target.value);
  };

  const login = () => {
    if (!id) {
      alert('아이디를 입력해주세요.');
      return;
    }
    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    Auth.signIn(id, password)
      .then(async (user) => {
        const idToken = user.signInUserSession?.idToken || '';
        const getToken = idToken ? idToken?.getJwtToken() : '';

        // 아이디 저장
        localStorage.setItem(`${APP_PREFIX}_save`, id);

        setJwt(getToken);
        setUserId(user.username);

        window.location.reload();
      })
      .catch((err) => {
        alert('잘못된 아이디 또는 비밀번호입니다.');
        setLoading(false);
      });
  };

  const handleKeyPress = (e) => {
    const KEY = e.key;
    const ENTER = 'Enter';

    if (KEY === ENTER) {
      login();
    }
  };

  return (
    <SLoginPage>
      <div className="login-box">
        <Typography className="login-box-title" variant="h5" component="h1">
          Sign In
        </Typography>

        <Typography>Sign In to your account</Typography>

        <Input
          size="large"
          placeholder="아이디를 입력해주세요."
          style={{ margin: '15px 0 10px', height: 40 }}
          value={id}
          onChange={(e) => handleInputChange('id', e)}
          onKeyDown={handleKeyPress}
          disabled={loading}
        />

        <Input
          size="large"
          label="Password"
          placeholder="비밀번호를 입력해주세요."
          type="password"
          value={password}
          style={{ margin: '0 0 10px', height: 40 }}
          onChange={(e) => handleInputChange('password', e)}
          onKeyDown={handleKeyPress}
          disabled={loading}
        />

        <Button icon={<PoweroffOutlined />} type="primary" size={'large'} onClick={() => login()} loading={loading} disabled={loading}>
          로그인
        </Button>

        {/* <Button size={'large'} onClick={() => navigator('/pages/auth/register')} disabled={loading}>
          회원가입
        </Button> */}

        <Typography variant="caption">&copy; {PROJECT_NAME}</Typography>
      </div>
    </SLoginPage>
  );
};

export default LoginPage;
