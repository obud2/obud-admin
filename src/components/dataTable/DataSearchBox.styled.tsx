import styled, { css } from 'styled-components';

export const SDataSearchBox = styled.div<{
  disabled?: boolean;
  doSearch?: boolean;
}>`
  width: 100%;
  height: 48px;

  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;

  padding: 10px 15px;

  background-color: #ffffff;

  display: none;

  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}

  ${(props) =>
    props.doSearch &&
    css`
      display: flex;
      align-items: center;
      justify-content: flex-start;
    `}

  .search-box-input {
    flex: 1;
    height: 100%;

    border: none;
    outline: none;

    color: #555555;
    font-size: 1.3rem;
    background-color: transparent;

    ${(props) =>
      props.disabled &&
      css`
        cursor: not-allowed;
      `}
  }

  .select-filter-item-icon {
    width: 24px;
    height: 100%;

    color: #939393;
    font-size: 1.3rem;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    border-radius: 30px;

    svg {
      width: 17px;
      height: 17px;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;
