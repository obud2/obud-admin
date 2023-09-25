import styled, { css, keyframes } from 'styled-components';

export const skeletonAnimation = keyframes`
  0% {
      background-color: rgba(0, 0, 0, 0.02);
  }
  50% {
      background-color: rgba(0, 0, 0, 0.03);
  }
  100% {
      background-color: rgba(0, 0, 0, 0.02);
  }
`;

export const SkeletonContainer = styled.sub`
  width: 70px;
  height: 70px;
  display: block;
  background-color: rgba(0, 0, 0, 0.02);
  bottom: 0;
  position: relative;
  overflow: hidden;
  border-radius: 5px;

  .shimmer-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    animation: 1.1s ${skeletonAnimation} 0.5s infinite normal none;
  }

  .shimmer {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    position: absolute;
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.04), transparent);
  }

  ${(props) =>
    props.type === 'box' &&
    css`
      width: 100%;
      height: 220px;
    `}

  ${(props) =>
    props.type === 'text' &&
    css`
      width: 100%;
      height: 10px;
    `}

  ${(props) =>
    props.type === 'circle' &&
    css`
      width: 30px;
      height: 30px;
      border-radius: 50%;
    `}

  ${(props) =>
    props.width &&
    css`
      width: ${props.width};
    `};
  ${(props) =>
    props.height &&
    css`
      height: ${props.height};
    `}
  ${(props) =>
    props.margin &&
    css`
      margin: ${props.margin};
    `}
  ${(props) =>
    props.borderRadius &&
    css`
      border-radius: ${props.borderRadius};
    `}
`;
