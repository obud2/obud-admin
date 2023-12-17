import React, { useState } from "react";

import Amplify, { Auth } from "aws-amplify";
import awsconfig from "../../../../aws-exports";
import swal from "@sweetalert/with-react";

import { v4 as uuidv4 } from "uuid";

import { Button, Input, Typography } from "antd";

import { PROJECT_NAME } from "../../../constants/config";
import { useNavigate } from "react-router-dom";

import { SRegisterPage } from "./RegisterPage.style";

Amplify.configure(awsconfig);

const RegisterPage = () => {
  const navigator = useNavigate();

  const [username, setUserName] = useState();
  const [id, setId] = useState();
  const [password, setPassword] = useState();

  const join = () => {
    Auth.signUp({
      username: uuidv4(),
      password: password,
      attributes: {
        email: id,
        name: username,
        "custom:role": "ADMIN",
        "custom:group": "GR0100",
      },
    }).then((user) => {
      swal("등록되었습니다.", {
        icon: "success",
      });
      navigator("/pages/auth/login");
    });
  };

  return (
    <SRegisterPage>
      <div className="join-box">
        <Typography variant="h5" component="h1">
          Register
        </Typography>
        <Typography variant="body1">Create your account</Typography>

        <Input
          size="large"
          label="이름"
          variant="outlined"
          margin="dense"
          placeholder="이름"
          style={{ margin: "15px 0 10px" }}
          onChange={(e) => setUserName(e.target.value)}
        />
        <Input
          size="large"
          label="아이디"
          variant="outlined"
          margin="dense"
          placeholder="아이디"
          style={{ margin: "10px 0" }}
          onChange={(e) => setId(e.target.value)}
        />
        <Input
          size="large"
          label="비밀번호"
          type="password"
          variant="outlined"
          margin="dense"
          placeholder="비밀번호"
          style={{ margin: "10px 0" }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          size={"large"}
          type="primary"
          onClick={join}
        >
          회원가입
        </Button>
        <Button
          variant="outlined"
          size={"large"}
          onClick={() => navigator("/pages/auth/login")}
        >
          로그인 하러가기
        </Button>

        <Typography variant="caption">&copy; {PROJECT_NAME}</Typography>
      </div>
    </SRegisterPage>
  );
};

export default RegisterPage;
