import React from 'react';

import { SDataDetailBody, SDataDetailItem, SDataDetailTitle } from '../detailTable/DataDetailBody.styled';

import { SSideBar } from './SideBar.styled';

/**
 *
 * @param {*} children : <div className="data-detail-body-item"></div>
 * @returns
 */
const SideBar = ({ open, onClose, isLoading, children }) => {
  return (
    <SSideBar open={open} onClose={onClose}>
      <div className="data-detail-body-container">
        <div className={`detail-body-background ${open ? 'active' : ''}`} onClick={onClose}></div>
        <div className={`detail-body-container ${open ? 'active' : ''}`}>
          {isLoading && (
            <div className="detail-body-loading">
              <span className="svg-loading" />
            </div>
          )}
          {children}
        </div>
      </div>
    </SSideBar>
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

export default SideBar;

export const DataDetailTitle = ({ title }) => {
  return <SDataDetailTitle>{title}</SDataDetailTitle>;
};
