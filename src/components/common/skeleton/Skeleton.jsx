import React from 'react';
import { SkeletonContainer } from './Skeleton.styled';

/**
 *
 * @param {*} type  box / text / circle
 * @returns
 */
const Skeleton = ({ id, type, width, height, margin, borderRadius }) => {
  return (
    <SkeletonContainer id={id} type={type} width={width} height={height} margin={margin} borderRadius={borderRadius}>
      <i className="shimmer-wrapper">
        <i className="shimmer"></i>
      </i>
    </SkeletonContainer>
  );
};

export default Skeleton;
