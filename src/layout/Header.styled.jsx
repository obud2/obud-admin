import styled from 'styled-components';

import { smLayout } from '../styles/VariablesStyles';

export const SOftadehAppBar = styled.header`
  width: 100%;
  height: 64px;

  margin-top: 0 !important;
  margin-left: 0;

  display: none;
  justify-content: space-between;
  align-items: center;

  position: fixed;
  top: 0;
  left: 0;
  padding: 10px;

  background-color: ${(props) => props.theme.background};

  transition:
    margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;

  border-bottom: 0.5px solid rgba(171, 182, 165, 0.2);

  z-index: 1000;

  .header-title {
    font-size: 1.5rem;

    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    img {
      width: 50px;
    }
  }

  button {
    color: ${(props) => props.theme.textColor} !important;
  }

  ${smLayout} {
    display: flex;
  }
`;
