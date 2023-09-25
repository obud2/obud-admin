import styled from 'styled-components';

import { smLayout } from '../../styles/VariablesStyles';

export const SDetailHeader = styled.div`
  width: 100%;
  min-height: 54px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 10px;

  background-color: #f7f8fb;

  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 10px 15px;

  ${smLayout} {
    flex-wrap: wrap;
  }

  .detail-header-title-container {
    display: flex;
    align-items: center;

    color: #555555;

    .detail-title {
      font-size: 1.6rem;
      font-weight: bold;
      margin-right: 6px;

      white-space: nowrap;
    }

    .detail-subTitle {
      font-size: 1.4rem;
    }
  }

  .detail-header-btn-container {
    display: flex;
    align-items: center;
  }
`;
