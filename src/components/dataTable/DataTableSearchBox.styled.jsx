import styled from 'styled-components';

export const SDataTableSearchBox = styled.div`
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;

  padding: 10px 15px;

  .filter-list-container {
    display: flex;

    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    .select-filter-item {
      display: flex;
      align-items: center;

      color: #555555;
      font-size: 0.9em;

      gap: 5px;
      margin-bottom: 3px;

      p {
        margin: 0;
      }

      .select-filter-item-icon {
        width: 25px;
        height: 25px;

        background-color: #1677ff;
        border-radius: 50%;

        display: flex;
        justify-content: center;
        align-items: center;

        svg {
          color: #fff;
        }
      }
    }

    .filter-list-info-text {
      font-size: 0.8em;
      color: #555555;
    }
  }

  .data-table-search-btn-container {
    display: flex;
    gap: 20px;

    margin-top: 10px;

    .data-table-search-btn {
      width: 210px;
    }
  }
`;

export const SRenderText = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  margin-bottom: 10px;

  gap: 30px;

  .render-text-label {
    color: #555555;
  }

  .render-text-filter {
    width: 50%;

    display: flex;
    align-items: center;

    gap: 10px;

    position: relative;
  }
`;
