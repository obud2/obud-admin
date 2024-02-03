import React, { useEffect, useState } from 'react';

import SubMain from '../../../../sub-main';

import { SPlanCommentDetail } from './PlanCommentDetail.styled';
import { Button, Input } from 'antd';

import { onComment } from '@/services/ScheduleService';

const PlanCommentDetail = ({ isOpen, onClose, data, refetch }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(data?.comment);
  }, [data]);

  const onClickSubmit = () => {
    const param = {
      orderItemId: data?.id,
      comment: value,
    };

    onComment(param).then(() => {
      refetch();
      onClose();
    });
  };

  return (
    <SubMain>
      <SPlanCommentDetail isOpen={isOpen}>
        <div className="comment-detail-background" />

        <div className="comment-detail-container">
          <div className="comment-detail-header">
            <p className="comment-detail-title">메모</p>

            <button className="comment-detail-close" onClick={onClose} />
          </div>

          <div className="comment-detail-main">
            <Input.TextArea rows={7} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>

          <div className="comment-detail-footer">
            <Button onClick={onClickSubmit}>저장</Button>
          </div>
        </div>
      </SPlanCommentDetail>
    </SubMain>
  );
};

export default PlanCommentDetail;
