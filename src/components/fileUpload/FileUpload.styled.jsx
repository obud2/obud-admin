import styled from 'styled-components';

export const SFileUpload = styled.div`
  width: auto;
  display: block;

  .fileupload-input {
    display: none;
  }

  .upload-list-view-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    gap: 5px;

    padding: 5px 0;
  }

  .upload-list-item {
    position: relative;
    width: 123px;
    height: 123px;

    border: 1px solid #eeeeee;
    border-radius: 2px;

    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    margin: 5px 0;

    .upload-delete-btn {
      position: absolute;
      top: -2px;
      right: -2px;
      z-index: 88;

      width: 24px;
      height: 24px;

      color: rgb(255, 255, 255);

      background-color: rgba(0, 0, 0, 0.5);

      outline: none;
      border: none;

      border-radius: 5px;

      display: flex;
      align-items: center;
      justify-content: center;

      cursor: pointer;

      &::after,
      &::before {
        content: ' ';

        position: absolute;

        top: 8px;
        left: 11px;

        width: 1px;
        height: 9px;

        background-color: #fff;
      }

      &::after {
        transform: rotate(-45deg);
      }

      &::before {
        transform: rotate(45deg);
      }
    }

    .upload-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      -webkit-user-drag: none;

      cursor: move;
    }
  }
`;
