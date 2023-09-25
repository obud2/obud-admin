import styled, { css } from 'styled-components';

export const SOrderCancelModal = styled.div`
  width: 100%;
  position: fixed;
  z-index: 1000;

  opacity: 0;
  pointer-events: none;

  transition: all 0.3s;

  ${(props) =>
    props.isOpen &&
    css`
      opacity: 1;
      pointer-events: visible;
    `}

  .order-cancel-detail-background {
    width: 100vw;
    height: 100vh;

    position: fixed;
    top: 0%;
    left: 0%;

    background-color: rgba(0, 0, 0, 0.15);
  }

  .order-cancel-detail-container {
    min-width: 420px;

    position: fixed;
    top: 50%;
    left: 50%;

    background-color: #ffffff;

    transform: translate(-50%, -50%);

    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    padding-bottom: 15px;

    .order-cancel-detail-header {
      width: 100%;
      padding: 24px 24px 12px 24px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      border-bottom: 1px solid #eeeeee;

      .order-cancel-detail-title {
        font-weight: 500;
        font-size: 1.8rem;
      }

      .order-cancel-detail-close {
        width: 24px;
        height: 24px;
        background-color: #ffffff;

        display: flex;
        align-items: center;
        justify-content: center;

        overflow: hidden;

        z-index: 1000;

        cursor: pointer;

        &::after,
        &::before {
          content: '';

          position: absolute;

          width: 1px;
          height: 18px;
          background-color: #212121;
        }

        &::after {
          transform: rotate(45deg);
        }
        &::before {
          transform: rotate(-45deg);
        }
      }
    }

    .order-cancel-detail-main {
      width: 100%;
      max-width: 440px;
      padding: 10px;
    }

    .order-cancel-detail-footer {
      width: 100%;
      padding: 0 10px;

      text-align: right;

      display: flex;
      align-items: center;
      justify-content: flex-end;

      gap: 8px;
    }
  }
`;
