import styled from 'styled-components';

import { smLayout } from '../../styles/VariablesStyles';

export const SDataTableTitle = styled.div`
  width: 100%;
  min-height: 54px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 10px;

  margin-bottom: 10px;
  background-color: #ffffff;

  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 10px 15px;

  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

  .data-table-title-container {
    margin-right: 10px;

    display: flex;
    align-items: center;

    .data-table-title {
      font-size: 1.6rem;
      font-weight: 600;
      margin: 0;

      ${smLayout} {
        font-size: 1.3rem;
      }
    }

    .data-table-sub-title {
      font-size: 1.3rem;
      font-weight: 500;
      margin: 0 0 0 5px;

      color: #868686;

      ${smLayout} {
        font-size: 1.2rem;
      }
    }
  }

  .data-table-button-container {
    display: flex;
    align-items: center;

    gap: 5px;
  }

  .data-table-refresh {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 15px;
      height: 15px;
    }
  }
`;
