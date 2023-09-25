import styled, { css } from 'styled-components';

export const SDataDetail = styled.div`
  width: 100%;
  position: relative;

  .detail-body-background {
    width: 100vw;
    height: 100vh;

    top: 0;
    left: 0;
    position: fixed;

    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1000;

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
    border-radius: 5px;

    overflow: hidden;

    opacity: 0;
    pointer-events: none;

    transition: all 0.3s;

    &.active {
      width: 95%;
      height: 95%;

      opacity: 1;
      pointer-events: auto;
    }
  }
`;
