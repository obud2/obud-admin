import styled from 'styled-components';

import { smLayout } from '../../styles/VariablesStyles';

export const SDataListTable = styled.div`
  width: 100%;

  margin: 10px 0;

  background-color: #ffffff;
  border-radius: 4px;

  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.1);

  position: relative;

  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

  ${smLayout} {
    overflow-y: none;
    /* overflow-x: auto; */
  }

  .data-option-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    gap: 5px;
    padding: 10px 15px;

    .data-sort-btn-tooltip {
      font-size: 0.8em;
      color: #555555;

      margin-top: 5px;
    }
  }

  .data-list-header {
    list-style: none;

    display: flex;

    margin: 0;
    padding: 10px 16px 10px 25px;

    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .data-list-header-field {
      flex: 1;
      font-weight: 500;
      font-size: 1.25rem;

      &.no {
        max-width: 45px;
      }
    }

    .data-list-header-field:last-child {
      flex: 0.5;
    }
  }

  .data-list-loading {
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 20px 0;
    position: absolute;

    background-color: #ffffff;
    overflow: hidden;
  }

  .data-list-container {
    height: auto;
    color: rgba(0, 0, 0, 0.87);

    background-color: #ffffff;

    .empty-list-item {
      text-align: center;
      font-size: 1.3rem;

      color: #555555;
      padding: 30px 0;
    }
  }
`;
