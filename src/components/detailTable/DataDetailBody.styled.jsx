import styled, { css } from "styled-components";
import { smLayout } from "../../styles/VariablesStyles";

export const SDataDetailBody = styled.div`
  width: 100%;
  min-height: 500px;
  height: calc(95% - 24px);

  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;

  margin-top: 10px;

  overflow-x: hidden;
  overflow-y: auto;

  background-color: #ffffff;

  ${smLayout} {
    padding-bottom: 200px;
  }

  .detail-body-loading {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);

    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }

  .data-detail-body-container {
    width: 100%;
    border-radius: 8px;

    border: 1px solid rgba(5, 5, 5, 0.06);
  }

  ${(props) =>
    props.padding &&
    css`
      padding: 10px 15px;
    `}
`;

export const SDataDetailItem = styled.div`
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  display: inline-flex;

  ${(props) =>
    props.span === 1 &&
    css`
      width: 50%;

      .data-detail-body-title {
        border-inline-start: 1px solid rgba(0, 0, 0, 0.1);
      }
    `}

  ${(props) =>
    props.span === 2 &&
    css`
      width: 100%;
    `}



  ${smLayout} {
    width: 100%;
    flex-direction: column;
  }

  .data-detail-body-title {
    min-width: 160px;

    color: rgba(0, 0, 0, 0.65);
    background-color: #f7f8fb;

    padding: 16px 24px;
    font-size: 1.45rem;

    white-space: pre-line;

    display: flex;
    align-items: flex-start;

    &.empty {
      background-color: #ffffff;
    }

    .title-point {
      display: inline-block;
      width: 5px;
      height: 5px;
      background: #ec35197c;
      border-radius: 50%;
      margin-left: 5px;
    }

    ${smLayout} {
      padding: 10px 16px 5px;
      background-color: #ffffff;
    }
  }

  .data-detail-body-contents {
    flex: 1;
    padding: 16px 24px;

    ${smLayout} {
      padding: 5px 16px 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
`;

export const SDataDetailTitle = styled.div`
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;
