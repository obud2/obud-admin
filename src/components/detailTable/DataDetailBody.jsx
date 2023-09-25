import React from 'react';

import DetailHeader from './DetailHeader';
import { SDataDetailBody, SDataDetailItem } from './DataDetailBody.styled';

import DataDetail from './DataDetail';

/**
 *
 * @param {*} children : <div className="data-detail-body-item"></div>
 * @returns
 */
const DataDetailBody = ({ open, onClose, title, subTitle, isLoading, extra, children, notiMessage, notiDescription, noModal }) => {
  return (
    <DataDetail open={open} onClose={onClose} noModal={noModal} notiMessage={notiMessage} notiDescription={notiDescription}>
      <DetailHeader title={title} subTitle={subTitle} extra={extra} />

      <SDataDetailBody>
        {isLoading && (
          <div className="detail-body-loading">
            <span className="svg-loading" />
          </div>
        )}

        <div className="data-detail-body-container">{children}</div>
      </SDataDetailBody>
    </DataDetail>
  );
};

/**
 *
 * @param {*} label  : 타이틀
 * @param {*} span : 1: 전체 의 반 /  2: 전체
 * @param {*} children
 * @returns
 */
export const DataDetailItem = ({ label, point, span = 2, children }) => {
  return (
    <SDataDetailItem span={span}>
      <p className={`data-detail-body-title ${label ? '' : 'empty'}`}>
        {label} {point && <i className="title-point" />}
      </p>

      <div className="data-detail-body-contents">{children}</div>
    </SDataDetailItem>
  );
};

export default DataDetailBody;
