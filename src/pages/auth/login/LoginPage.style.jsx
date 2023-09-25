import styled from 'styled-components';

import { smLayout } from '../../../styles/VariablesStyles';

export const SLoginPage = styled.div`
  width: 100%;
  height: 100vh;

  top: 0;
  left: 0;
  position: fixed;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  background: #f3f5f9;

  ${smLayout} {
    align-items: flex-start;
  }

  .login-box {
    width: 500px;
    padding: 65px 50px;

    background: #ffffff;

    border: 1px solid #eeeeee;
    border-radius: 10px;

    display: flex;
    flex-direction: column;

    box-shadow: 0px 0px 4px -1px #eeeeee, 0px 0px 5px 0px #eeeeee, 0px 0px 10px 0px #eeeeee;

    ${smLayout} {
      width: 100%;

      padding: 0 5%;
      margin-top: 150px;

      gap: 5px;
      border: none;
      box-shadow: none;

      background: #f3f5f9;
    }
  }

  .login-box-title {
    margin: 10px 0 5px;
  }

  button {
    width: 100%;
    margin: 5px 0;
    border-radius: 0;
    background-color: ${(props) => props.theme.mainColor};
  }
`;
