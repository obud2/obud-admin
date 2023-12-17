import styled, { css } from "styled-components";

export const SNavCollapse = styled.div<{ active?: boolean; open?: boolean }>`
  width: 100%;
  display: flex;
  position: relative;
  box-sizing: border-box;
  text-align: left;

  align-items: center;
  justify-content: center;

  text-decoration: none;

  padding: 14px;

  color: ${(props) => props.theme.textColor};

  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }

  ${(props) =>
    props.open &&
    css`
      justify-content: space-between;
    `}

  ${(props) =>
    props.active &&
    css`
      font-weight: 500 !important;
      color: #009ef7 !important;

      .anticon {
        color: #009ef7 !important;
      }
    `}

  .nav-title {
    font-size: 1.3rem;

    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;

    white-space: nowrap;
    transition: width 180ms, opacity 180ms;

    ${(props) =>
      props.open &&
      css`
        width: auto;
        height: auto;
        opacity: 1;
        margin: 0 0 0 13px;
        flex: 1;
      `}
  }

  .nav-collapes-more {
    width: 0;
    height: 0;
    opacity: 0;
    border-top: 1px solid ${(props) => props.theme.textColor};
    border-right: 1px solid ${(props) => props.theme.textColor};

    top: -2px;

    transform: rotate(135deg);
    transition: transform 0.3s;

    position: relative;

    &.active {
      transform: rotate(315deg);
    }

    ${(props) =>
      props.open &&
      css`
        width: 7px;
        height: 7px;
        opacity: 1;
      `}
  }
`;

export const SNavChildren = styled.div<{ open?: boolean; height: number }>`
  width: 100%;
  height: 0px;

  opacity: 0;
  pointer-events: none;

  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  .nav-title {
    margin: 0 0 0 30px !important;
  }

  ${(props) =>
    props.height &&
    css`
      height: ${props.height}px;
    `};

  ${(props) =>
    props.open &&
    css`
      opacity: 1;
      pointer-events: auto;

      * {
        height: auto;
      }
    `}
`;
