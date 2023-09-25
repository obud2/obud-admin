import styled from 'styled-components';

import { xlLayout, smLayout } from '../../styles/VariablesStyles';

export const SProductStudioList = styled.article`
  width: 100%;
  padding: 25px 0;

  .product-loading-container {
    width: 100%;
    min-height: 450px;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .product-shell-list-container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);

    gap: 10.5px;

    ${xlLayout} {
      grid-template-columns: repeat(4, 1fr) !important;
    }

    ${smLayout} {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .empty-list {
    font-size: 1.4rem;
    color: #555555;
  }
`;
