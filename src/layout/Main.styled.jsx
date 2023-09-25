import styled, { css } from 'styled-components';

import { DRAWER_WIDTH, DRAWER_CLOSE_WIDTH, smLayout } from '../styles/VariablesStyles';

export const SMain = styled.main`
  width: calc(100vw - ${DRAWER_CLOSE_WIDTH});
  height: auto;

  margin-left: ${DRAWER_CLOSE_WIDTH};
  padding-right: 0;

  transition: margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms, width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;

  padding: 20px;

  ${(props) =>
    props.open &&
    css`
      width: calc(100vw - ${DRAWER_WIDTH});
      margin-left: ${DRAWER_WIDTH};
    `}

  ${smLayout} {
    width: 100% !important;
    margin-top: 64px !important;
    margin-left: 0 !important;

    padding: 24px 5% !important;

    transition: none;
  }
`;
