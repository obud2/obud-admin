import styled, { css, keyframes } from 'styled-components';

export const SFileUploading = styled.div`
  top: 0;
  left: 0;
  position: fixed;

  width: 100vw;
  height: 100vh;

  z-index: 10101010;

  display: none;

  ${(props) =>
    props.isOpen &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
    `}

  .uploading-item-background {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);

    position: fixed;
    top: 0;
    left: 0;
  }

  .uploading-item-option-container {
    max-width: 90vw;
    min-width: 370px;

    max-height: 90vh;
    min-height: 130px;

    z-index: 10;

    border-radius: 12px;
    background-color: rgb(38, 38, 38);

    box-shadow:
      rgb(0 0 0 / 20%) 0px 2px 1px -1px,
      rgb(0 0 0 / 14%) 0px 1px 1px 0px,
      rgb(0 0 0 / 12%) 0px 1px 3px 0px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    transition: all 0.3s;

    overflow: hidden;

    position: relative;

    .uploading-isLoading {
      width: 100%;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: center;

      top: 0;
      left: 0;
      position: absolute;

      z-index: 10;

      background-color: rgba(155, 155, 155, 0.6);
    }

    .uploading-item-option-header {
      width: 100%;
      height: 50px;

      display: flex;
      justify-content: space-between;
      align-items: center;

      border-bottom: 1px solid rgba(54, 54, 54);
      background-color: rgb(38, 38, 38);

      padding: 0 10px;

      .uploading-item-close {
        width: 24px;
        height: 24px;
        position: relative;

        padding: 0;
        line-height: 0;
        border: none;

        cursor: pointer;
        background-color: transparent;

        &::after,
        &::before {
          content: ' ';

          position: absolute;

          top: 3px;
          left: 12px;

          width: 1px;
          height: 20px;

          background-color: #ffffff;
        }

        &::after {
          transform: rotate(-45deg);
        }

        &::before {
          transform: rotate(45deg);
        }
      }

      .uploading-item-upload {
        display: block;

        font-size: 14px;
        font-weight: bold;

        color: rgb(0, 149, 246);
        background-color: transparent;
        outline: none;
        border: none;

        cursor: pointer;
      }
    }

    .uploading-item-option-main {
      width: 100%;
      background-color: rgb(38, 38, 38);
    }

    .uploading-option-box {
      width: 35px;
      height: 35px;
      position: absolute;

      cursor: pointer;
      background-color: rgba(26, 26, 26, 0.8);
      border-radius: 50%;

      display: flex;
      justify-content: center;
      align-items: center;

      z-index: 3;

      svg {
        color: #ffffff;
      }

      &:hover {
        background-color: rgba(26, 26, 26, 0.6);
      }

      &.active {
        background-color: rgba(26, 26, 26, 0.2);
      }

      &.hide {
        display: none;
      }

      &.size {
        bottom: 15px;
        left: 10px;

        &.active {
          background-color: #ffffff;
          box-shadow: 1px 1px 3px 2px rgba(0, 0, 0, 0.2);
        }
        svg {
          width: 15px;
          height: 15px;
        }
      }
    }

    .uploading-option-size-select-box {
      display: none;
      position: absolute;
      left: 10px;
      bottom: 55px;
      background-color: rgba(26, 26, 26, 0.6);

      border-radius: 8px;
      z-index: 3;

      &.open {
        display: block;
        min-width: 110px;

        .uploading-option-select-item {
          display: flex;
          justify-content: center;
          align-items: center;

          padding: 10px 0;

          font-size: 13px;

          color: rgba(168, 168, 168);
          border-bottom: 1px solid rgba(38, 38, 38, 0.3);

          cursor: pointer;

          &.active {
            color: #ffffff;
          }

          &:hover {
            opacity: 0.8;
          }
        }

        .uploading-option-select-item:last-child {
          border-bottom: none;
        }
      }
    }
  }
`;

const helpMessageAnimation = keyframes`
  0% {
    transform: translateX(400px);
  }
  100% {
    transform: translateX(0);
  }
`;

export const UploadingHelpMessage = styled.div`
  position: fixed;
  bottom: 20px;
  right: 30px;

  z-index: 1010101010;

  .uploading-help-message {
    width: 384px;
    max-width: calc(100vw - 48px);
    margin-bottom: 16px;
    margin-inline-start: auto;
    padding: 20px 24px;
    overflow: hidden;
    line-height: 1.5714285714285714;
    word-wrap: break-word;
    background: #ffffff;
    border-radius: 8px;
    box-shadow:
      0 6px 16px 0 rgb(0 0 0 / 8%),
      0 3px 6px -4px rgb(0 0 0 / 12%),
      0 9px 28px 8px rgb(0 0 0 / 5%);

    font-size: 14px;
    color: #555555;

    animation: ${helpMessageAnimation} 0.3s;

    b {
      color: #f33;
    }
  }
`;
