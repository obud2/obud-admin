import React from 'react';

import { PROJECT_NAME } from '../../../constants';

import { Button, Input, Typography } from 'antd';

import { SForgotPasswordPage } from './ForgotPasswordPage.style';

const ForgotPasswordPage = (props) => {
  const { history } = props;

  return (
    <SForgotPasswordPage>
      <div className="forgot-box">
        <Typography variant="h5" component="h1">
          Forgot Password
        </Typography>
        <Typography variant="body1">Enter your email</Typography>

        <Input size="small" label="Email" variant="outlined" margin="dense" fullWidth />

        <Button variant="contained" color="primary" fullWidth onClick={() => history.push('/')}>
          send
        </Button>

        <Typography variant="caption">&copy; {PROJECT_NAME}</Typography>
      </div>
    </SForgotPasswordPage>
  );
};

export default ForgotPasswordPage;
