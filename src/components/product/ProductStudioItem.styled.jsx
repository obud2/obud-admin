import styled from 'styled-components';

import { smLayout } from '../../styles/VariablesStyles';

export const SProductStudioItem = styled.div`
  width: 100%;

  background-color: #ffffff;
  margin-bottom: 10px;
  border-radius: 3px;

  overflow: hidden;

  &:hover {
    .product-shell-item-drag-button {
      visibility: visible;
    }
  }

  .product-shell-item-image-container {
    width: 100%;
    height: auto;

    position: relative;
    overflow: hidden;

    aspect-ratio: 1 / 1;

    ${smLayout} {
      width: 100%;
      height: 165px;
    }

    .product-shell-item-images {
      width: 100%;
      height: 100%;
      object-fit: cover;

      -webkit-user-drag: none;
    }
  }

  .product-shell-item-drag-button {
    position: absolute;
    top: 8px;
    left: 8px;

    width: 25px;
    height: 25px;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    visibility: hidden;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    svg {
      width: 23px;
      height: 23px;
      color: #ffffff;
    }
  }

  .product-shell-item-option-container {
    position: absolute;
    top: 8px;
    right: 8px;

    .product-shell-item-option-button {
      width: 25px;
      height: 25px;
      overflow: hidden;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      svg {
        width: 18px;
        height: 18px;
        color: #ffffff;
      }
    }

    .product-shell-item-option {
      width: 90px;

      opacity: 0;
      pointer-events: none;

      background-color: #ffffff;

      top: 110%;
      right: 0;
      position: absolute;

      padding: 6px 0;

      box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, 0.3);
      border-radius: 2px;

      transition: opacity 0.3s;

      &.active {
        opacity: 1;
        pointer-events: auto;
      }

      .option-item {
        width: 100%;
        padding: 7px 11px;
        font-size: 1.25rem;

        cursor: pointer;

        text-align: center;

        border-bottom: 1px solid #eeeeee;

        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        &:last-child {
          border: none;
        }
      }
    }
  }

  .product-shell-item-contents-container {
    width: 100%;
    height: 130px;

    display: flex;
    flex-direction: column;

    gap: 5px;

    padding: 12px;

    ${smLayout} {
      height: auto;
    }

    .product-shell-item-createdAt {
      font-size: 1.2rem;
      color: #999999;

      ${smLayout} {
        font-size: 1.1rem;
      }
    }

    .product-shell-item-title {
      font-size: 1.4rem;
      font-weight: 500;
      color: #000000;

      cursor: pointer;

      &:hover {
        opacity: 0.6;
      }

      ${smLayout} {
        font-size: 1.3rem;
      }
    }

    .product-shell-item-edit {
      border: 1px solid #999;

      width: 50px;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 1.2rem;
      margin-top: 15px;
    }

    .product-shell-item-isShow {
      font-size: 1.2rem;

      flex: 1;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }
  }
`;
