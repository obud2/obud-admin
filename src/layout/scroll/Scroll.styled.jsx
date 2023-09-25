import styled, { css } from 'styled-components';

/* ////////////////////////////////////////////
                Scroll Action
//////////////////////////////////////////// */
export const SScrollAction = styled.nav`
  position: fixed;
  bottom: 1.5%;
  right: 2%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 1000;
`;

export const SScrollTopBtn = styled.button`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin: 10px 0;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 0;
  visibility: hidden;
  transition: opacity 500ms, visibility 500ms;

  background-color: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 5px 1px;

  svg {
    width: 22px;
    height: 22px;
    color: #232323ba;
    pointer-events: none;
  }

  ${(props) =>
    props.active &&
    css`
      opacity: 1;
      visibility: unset;
      transition: opacity 500ms, visibility 500ms;
    `};
`;
