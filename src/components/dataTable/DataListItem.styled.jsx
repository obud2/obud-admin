import styled, { keyframes } from 'styled-components';

// import { smLayout } from '../../styles/VariablesStyles';

const optionAnimation = keyframes`
  0% {
    opacity: 0.1;
    transform: translateY(30%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const SDataListItem = styled.div`
  display: flex;

  font-weight: 500;
  font-size: 1.3rem;
  line-height: 1.5rem;

  border-bottom: 1px solid rgb(224, 224, 224);
  text-align: left;
  padding: 13px 16px 13px 25px;

  cursor: auto;
  color: rgba(0, 0, 0, 0.87);

  position: relative;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);

    .data-list-item-drag-button {
      opacity: 1;
      pointer-events: auto;
    }
  }

  &.disabled {
    cursor: not-allowed;
    background-color: rgba(0, 0, 0, 0.02);
  }

  &.select {
    background-color: #4096ff1f;
  }

  .data-list-field {
    flex: 1;
    margin: 0;

    display: flex;
    align-items: center;

    position: relative;

    &.no {
      max-width: 45px;
    }
  }

  .data-list-field:last-child {
    flex: 0.5;
  }

  .data-list-item-drag-button {
    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);

    opacity: 0;
    pointer-events: none;

    transition: opacity 0.3s;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .data-list-field-option {
    width: 17px;
    height: 17px;
    cursor: pointer;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .data-list-option-container {
    width: auto;
    height: auto;
    min-width: 70px;

    text-align: center;

    position: absolute;
    top: 100%;

    background-color: #ffffff;
    z-index: 10;

    border: none;
    margin: 0;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    padding: 0;

    animation: ${optionAnimation} 0.3s ease-in-out;

    .data-list-option-item {
      width: 100%;

      padding: 8px 14px;
      font-size: 12px;

      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }
`;
