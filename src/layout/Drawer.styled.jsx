import styled, { css } from 'styled-components';

import { DRAWER_WIDTH, DRAWER_CLOSE_WIDTH, smLayout } from '../styles/VariablesStyles';

export const SDrawer = styled.nav`
  width: ${DRAWER_CLOSE_WIDTH};
  height: 100%;

  display: flex;
  outline: 0;
  z-index: 900;

  top: 0;
  position: fixed;
  flex-direction: column;

  background-color: ${(props) => props.theme.background};

  overflow-y: auto;
  overflow-x: hidden;

  transition: width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;

  transform: translateX(0);
  box-shadow: 2px 0px 4px -1px #f5f7f9, 4px 0px 5px 0px #f5f7f9, 1px 0px 10px 0px #f5f7f9;

  border-right: 1px solid rgba(0, 0, 0, 0.1);

  ${smLayout} {
    display: none;
  }

  ${(props) =>
    props.open &&
    css`
      width: ${DRAWER_WIDTH};
      transform: translateX(0);
    `}
`;
