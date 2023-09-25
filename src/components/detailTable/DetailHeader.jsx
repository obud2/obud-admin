import React from 'react';

import { SDetailHeader } from './DetailHeader.styled';

const DetailHeader = ({ title, subTitle, extra }) => {
  return (
    title && (
      <SDetailHeader>
        <div className="detail-header-title-container">
          <span className="detail-title">{title}</span>
          <span className="detail-subTitle">{subTitle}</span>
        </div>

        <div className="detail-header-btn-container">{extra}</div>
      </SDetailHeader>
    )
  );
};

export default DetailHeader;
