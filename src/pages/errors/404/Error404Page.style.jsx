import styled from 'styled-components';

export const SError404Page = styled.div`
  width: 100%;
  height: 600px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .error-title {
    font-size: 1.6rem;
    color: ${(props) => props.theme.mainColor};
  }

  .error-text {
    font-size: 1.4rem;
    color: ${(props) => props.theme.subColor2};
    margin: 10px 0;
  }
`;
