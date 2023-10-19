import styled, { css, keyframes } from "styled-components";
import { smLayout } from "../styles/VariablesStyles";

const ArrawAnimationLeft = keyframes`
  0% {
    transform: translateY(0) rotate(315deg);
  }
  50% {
    transform: translateY(3px) rotate(315deg);
  }
  100% {
    transform: translateY(0) rotate(315deg);
  }
`;

const ArrawAnimationRight = keyframes`
  0% {
    transform: translateY(0) rotate(135deg);
  }
  50% {
    transform: translateY(3px) rotate(135deg);
  }
  100% {
    transform: translateY(0) rotate(135deg);
  }
`;

export const SNavigation = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;

  overflow-x: hidden;
  overflow-y: auto;

  .navigation-topbar {
    width: 100%;
    height: 55px;

    font-size: 1.2rem;
    font-weight: 600;

    color: ${(props) => props.theme.textColor};
    border-bottom: 1.5px solid ${(props) => props.theme.lineColor};
    background-color: transparent;

    margin-bottom: 10px;

    display: flex;
    justify-content: center;
    align-items: center;

    transition: font-size 0.22s;

    .navigation-title {
      width: 100%;

      text-align: center;
      white-space: nowrap;

      text-overflow: ellipsis;
      overflow: hidden;

      img {
        width: 25%;
        max-width: 80px;
      }
    }

    ${(props) =>
      props.open &&
      css`
        font-size: 1.4rem;
      `}
  }

  .navigation-menu-container {
    width: 100%;

    flex: 1;

    display: flex;
    flex-direction: column;

    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .navigation-avatar-container {
    width: 100%;

    display: flex;
    align-items: flex-end;
    border-top: 1px solid ${(props) => props.theme.lineColor};
  }

  .navigation-footer-container {
    width: 100%;

    ${smLayout} {
      display: none;
    }

    .navition-drawer-toggle-container {
      width: 100%;
      height: 45px;

      display: flex;
      align-items: center;
      justify-content: center;

      background-color: ${(props) => props.theme.hoverColor};
      border-top: 1px solid ${(props) => props.theme.lineColor};

      cursor: pointer;

      ${(props) =>
        props.open &&
        css`
          background-color: transparent;
        `}

      &:hover {
        background-color: ${(props) => props.theme.hoverColor};
      }

      .arrow-icons {
        width: 8px;
        height: 8px;

        display: inline-block;
        border-top: 2px solid #eeeeee;
        border-left: 2px solid #eeeeee;

        animation-name: ${ArrawAnimationRight};
        animation-duration: 2s;
        animation-iteration-count: infinite;

        ${(props) =>
          props.open &&
          css`
            animation-name: ${ArrawAnimationLeft};
          `}

        &:nth-child(1) {
          animation-duration: 2s;
          border-color: ${(props) =>
            props.theme.theme === "light" ? "#404368c2" : "#fefeffc2"};
        }

        &:nth-child(2) {
          animation-duration: 1.9s;
          border-color: ${(props) =>
            props.theme.theme === "light" ? "#23233763" : "#ffffff63"};
        }

        &:nth-child(3) {
          animation-duration: 1.8s;
          border-color: ${(props) =>
            props.theme.theme === "light" ? "#23233729" : "#ffffff29"};
        }
      }
    }
  }
`;
