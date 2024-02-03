import styled from 'styled-components';

export const SStudioRefundSettingList = styled.div`
  width: 100%;
  position: relative;

  .refund-list-isLoading {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.04);
  }

  .refund-list-container {
    width: 100%;
    height: 140px;

    overflow-x: hidden;
    overflow-y: auto;

    border-bottom: 1px solid #e5e7eb;

    .refund-list-item {
      width: 100%;

      display: flex;
      align-items: center;
      justify-content: flex-start;

      border-bottom: 1px solid #e5e7eb;

      & > li {
        min-width: 24px;
        display: inline-block;
        padding: 8px;

        .edit-btn {
          color: #3385ff;
          &:hover {
            opacity: 0.5;
          }
          &:disabled {
            color: rgba(0, 0, 0, 0.2);
            cursor: not-allowed;
          }
        }

        .delete-btn {
          color: #f33;
          &:hover {
            opacity: 0.5;
          }
          &:disabled {
            color: rgba(0, 0, 0, 0.2);
            cursor: not-allowed;
          }
        }

        &:nth-child(1) {
          min-width: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #555555;
        }

        &:nth-child(2) {
          min-width: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #555555;
        }

        &:nth-child(3) {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          gap: 10px;

          font-size: 1.3rem;
        }
      }
    }
  }

  .empty-list {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #555555;
    font-size: 1.3rem;
  }
`;
