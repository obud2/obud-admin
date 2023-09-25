import React, { useEffect, useState } from 'react';

import { SStudioRefundSettingDetail } from './StudioRefundSettingDetail.styled';
import { Button, InputNumber, Typography } from 'antd';

import SubMain from '../../../../sub-main';

const StudioRefundSettingDetail = ({ isOpen, isClose, list, data, onAdd }) => {
  const [isData, setIsData] = useState(false);
  const [body, setBody] = useState({ isShow: true, title: '' });

  useEffect(() => {
    const check = data?.day > -1 ? true : false;

    if (check) {
      setBody(data);
      setIsData(true);
    }
  }, [data]);

  const onChangeBodyValue = (type, e) => {
    setBody((prev) => ({ ...prev, [type]: e }));
  };

  const onClickClose = () => {
    setIsData(false);
    setBody({ isShow: true, day: '', percent: '' });
    isClose();
  };

  const onClickAddForm = () => {
    const temp = [...(list || [])];
    const day = [];

    temp?.forEach((item) => {
      day.push(item?.day);
    });

    if (day?.includes(body?.day) && !isData) {
      swal({
        text: '같은 일자가 존재합니다.',
        icon: 'warning',
      });

      return;
    }

    if (isData) {
      const findIndex = temp?.findIndex((a) => a?.day === data?.day);

      temp[findIndex] = body;
    } else {
      temp.push({ ...body });
    }

    onAdd(temp);
    onClickClose();
  };

  return (
    <SubMain>
      <SStudioRefundSettingDetail isOpen={isOpen}>
        <div className="refund-detail-background" />

        <div className="refund-detail-container">
          <div className="refund-detail-header">
            <p className="refund-detail-title">환불기준 설정</p>

            <button className="refund-detail-close" onClick={onClickClose} />
          </div>

          <div className="refund-detail-contents">
            <Typography.Text>일자</Typography.Text>
            <InputNumber
              addonAfter="일 전"
              placeholder="숫자만 입력하세요."
              min={0}
              max={9999}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              value={body?.day}
              onChange={(e) => onChangeBodyValue('day', e)}
            />

            <Typography.Text>퍼센트</Typography.Text>
            <InputNumber
              addonAfter="%"
              placeholder="숫자만 입력하세요."
              min={0}
              max={100}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              value={body?.percent}
              onChange={(e) => onChangeBodyValue('percent', e)}
            />
          </div>

          <div className="refund-detail-footer">
            <Button onClick={onClickClose}>취소</Button>

            <Button type="primary" onClick={onClickAddForm}>
              {isData ? '수정' : '추가'}
            </Button>
          </div>
        </div>
      </SStudioRefundSettingDetail>
    </SubMain>
  );
};

export default StudioRefundSettingDetail;
