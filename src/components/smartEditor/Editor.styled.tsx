import styled, { keyframes } from 'styled-components';

const Spin = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }

`;

export const SEditor = styled.div`
  width: 100%;
  height: 100%;

  position: relative;

  .disabled-loading {
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 0;

    opacity: 0;
    pointer-events: none;

    background-color: rgba(0, 0, 0, 0.1);
    cursor: not-allowed;

    transition: opacity 0.3s;

    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      opacity: 1;
      pointer-events: auto;
    }

    &::after {
      content: '';
      width: 25px;
      height: 25px;

      display: block;

      border: 2px solid #b6b6b6;
      border-top: 2px solid #f7009b;
      border-radius: 50%;

      animation: ${Spin} 1s infinite;
    }
  }

  .editor-textarea {
    border: none;
    outline: none;

    visibility: hidden;
  }

  .save-editor-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    margin-bottom: 5px;
  }

  .save-editor {
    width: 70px;
    height: 35px;

    border: 1px solid;
  }

  iframe {
    width: 100%;
    height: 628px !important;
  }
`;
