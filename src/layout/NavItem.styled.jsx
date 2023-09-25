import styled, { css } from 'styled-components';

export const SNavItem = styled.div`
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
    props.active &&
    css`
      font-weight: 500 !important;
      color: #009ef7 !important;

      .anticon {
        color: #009ef7 !important;
      }
    `}

  ${(props) =>
    props.open &&
    css`
      justify-content: flex-start;
    `}

  .nav-title {
    font-size: 1.3rem;

    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;

    white-space: nowrap;
    transition: all 180ms;

    ${(props) =>
      props.open &&
      css`
        width: auto;
        height: auto;
        opacity: 1;
        margin: 0 0 0 13px;
      `}
  }
`;
