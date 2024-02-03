import React, { useEffect } from 'react';

import { notification } from 'antd';

import { SDataDetail } from './DataDetail.styled';
import { bodyHiddenToggle } from '../../constants/config';

const DataDetail = ({ open, children, notiMessage, notiDescription }) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (open) {
      bodyHiddenToggle(true);
    } else {
      bodyHiddenToggle(false);
    }

    return () => bodyHiddenToggle(false);
  }, [open]);

  useEffect(() => {
    if (notiMessage || notiDescription) {
      openNotification(notiMessage, notiDescription, 'bottomRight');
    }
  }, [notiMessage, notiDescription]);

  const openNotification = (notiMessage, notiDescription, placement) => {
    api.info({
      message: notiMessage,
      description: notiDescription,
      placement,
    });
  };

  return (
    <React.Fragment>
      {contextHolder}
      <SDataDetail>
        <div className={`detail-body-background ${open ? 'active' : ''}`}>
          <div className={`detail-body-container ${open ? 'active' : ''}`}>{children}</div>
        </div>
      </SDataDetail>
    </React.Fragment>
  );
};

export default DataDetail;
