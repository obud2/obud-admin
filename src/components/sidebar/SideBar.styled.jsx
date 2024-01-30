import styled, { css } from 'styled-components';

export const SSideBar = styled.div`
  .detail-body-background {
    width: 100vw;
    height: 100vh;

    top: 0;
    left: 0;
    position: fixed;

    background-color: rgba(0, 0, 0, 0.3);
    z-index: 999;

    opacity: 0;
    pointer-events: none;

    transition: all 0.3s;

    overflow-x: hidden;
    overflow-y: auto;

    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .detail-body-container {
    width: 0;
    height: 0;

    background-color: #ffffff;

    padding: 15px;

    overflow: hidden;

    opacity: 0;
    pointer-events: none;

    transition: all 0.3s;

    &.active {
      top: 0;
      right: 0;
      position: fixed;

      width: 95%;
      max-width: 500px;
      height: 100%;

      overflow-y: auto;

      opacity: 1;
      pointer-events: auto;
      z-index: 1000;
    }
  }
`;
