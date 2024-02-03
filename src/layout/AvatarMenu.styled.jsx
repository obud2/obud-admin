import styled, { css } from 'styled-components';

import { smLayout } from '../styles/VariablesStyles';

export const SAvatarMenu = styled.div`
  width: 100%;
  position: relative;

  ${smLayout} {
    width: auto;
  }

  .avatar-user-data-container {
    width: 100%;

    border-radius: 10px;
    background-color: transparent;
    border: none;

    padding: 16px;

    cursor: pointer;
    color: ${(props) => props.theme.textColor};
    outline: none;

    display: flex;
    align-items: center;
    justify-content: center;

    .ant-avatar {
      width: 28px;
      height: 28px;
      background-color: #afb4ffb3;
    }

    .user-info {
      width: calc(100% - 28px);

      font-size: 1.4rem;

      width: 0;
      height: 0;
      opacity: 0;
      margin: 0;

      white-space: nowrap;
      transition: all 180ms;

      text-align: left;

      color: #009ef7;
      flex: 1;
    }

    ${(props) =>
      props.open &&
      css`
        justify-content: flex-start;

        .user-info {
          width: auto;
          height: auto;
          opacity: 1;
          margin: 0 0 0 8px;
        }
      `}

    &:hover {
      background-color: rgba(155, 155, 155, 0.1);
    }
  }

  .avatar-option-background {
    width: 100vw;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.2);

    z-index: 1000;
    position: fixed;
    top: 0%;
    left: 0;
  }

  .avatar-option-container {
    width: 270px;
    height: auto;

    position: fixed;
    background-color: ${(props) => props.theme.background};

    border-radius: 5px;

    padding: 12px 16px;

    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    box-shadow:
      0px 2px 1px -1px rgb(0 0 0 / 20%),
      0px 1px 1px 0px rgb(0 0 0 / 14%),
      0px 1px 3px 0px rgb(0 0 0 / 12%);

    z-index: 1000;
    outline: none;

    ${smLayout} {
      width: 80%;
    }

    .user-info-container {
      width: 100%;
      min-height: 50px;
      border-bottom: 1px solid #eeeeee;

      padding: 9px 0;
      margin-bottom: 5px;

      .user-email {
        font-size: 1.45rem;
        font-weight: bold;
        color: #50cd89;
        margin: 0 0 5px;
      }

      .user-name {
        font-size: 1.2rem;
        color: ${(props) => props.theme.textColor};
      }
    }

    .button {
      width: 100%;
      height: 45px;
      background-color: transparent;
      border: none;

      text-align: left;
      font-size: 1.4rem;

      padding: 0 15px;
      border-radius: 3px;

      display: flex;
      justify-content: flex-start;
      align-items: center;

      gap: 5px;

      cursor: pointer;
      color: ${(props) => props.theme.textColor};

      &:hover {
        background-color: ${(props) => props.theme.hoverColor};
      }
    }
  }
`;
