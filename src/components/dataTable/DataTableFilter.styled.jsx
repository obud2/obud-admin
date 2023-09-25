import styled from 'styled-components';

export const SDataTableFilter = styled.div`
  width: 100%;
  min-height: 45px;

  display: flex;

  margin-bottom: 10px;

  border-bottom: 1px solid #e5e7eb;

  .filter-item {
    min-width: 45px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 1.3rem;

    color: #000000;
    padding: 0 15px 10px 15px;

    cursor: pointer;

    transition: all 0.3s;

    &.active {
      font-weight: 500 !important;
      color: #009ef7 !important;
      border-bottom: 1.5px solid #009ef7 !important;
    }
  }
`;
