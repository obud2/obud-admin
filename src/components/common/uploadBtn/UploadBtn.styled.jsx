import styled from 'styled-components';

export const SUploadBtn = styled.div`
  display: inline-flex;

  align-items: flex-start;
  flex-direction: column;

  gap: 5px;

  .upload-button {
    width: auto;

    position: relative;
    display: inline-block;

    background-color: #ffffff;
    color: #009ef7;

    font-size: 1.4rem;
    cursor: pointer;

    transition: background-color 0.3s;

    &:hover {
      opacity: 0.6;
    }
  }

  .upload-helptext {
    font-size: 1.3rem;

    color: #999999;
  }
`;
