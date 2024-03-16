import React, { useEffect, useState } from 'react';

import { Button, InputNumber } from 'antd';

import { DataDetailItem } from '../../components/detailTable/DataDetailBody';
import { SOrderCancelModal } from './OrderCancelModal.styled';
import SubMain from '../../sub-main';

import ReservationService from '../../services/ReservationService';

const OrderCancelModal = ({ data, isOpen, onClose, refresh }) => {
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data?.cancelAmount > 0) setValue(data?.cancelAmount);
  }, [data]);

  const onClickSubmit = () => {
    const param = {
      orderItemId: data?.id,
      cancelAmount: value,
    };

    setIsLoading(true);
    ReservationService.orderCancelCheck(param)
      .then((res) => {
        if (res?.status === 200) {
          onClose();
        } else {
          swal({
            icon: 'info',
            text: res?.meta || '',
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        refresh();

        setIsLoading(false);
        onClose();
      });
  };

  return (
    <SubMain>
      <SOrderCancelModal isOpen={isOpen}>
        <div className="order-cancel-detail-background" />

        <div className="order-cancel-detail-container">
          <div className="order-cancel-detail-header">
            <p className="order-cancel-detail-title">취소처리 - {data?.id}</p>

            <button className="order-cancel-detail-close" onClick={onClose} />
          </div>

          <div className="order-cancel-detail-main">
            <DataDetailItem label="결제금액">
              <InputNumber
                addonAfter="원"
                placeholder="숫자만 입력하세요."
                value={data?.amount || ''}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                disabled={isLoading}
              />
            </DataDetailItem>

            <DataDetailItem label="환불금액">
              <InputNumber
                addonAfter="원"
                placeholder="숫자만 입력하세요."
                min={1}
                max={Number(data?.amount)}
                value={value || ''}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                onChange={(e) => setValue(e)}
                disabled={isLoading}
              />
            </DataDetailItem>
          </div>

          <div className="order-cancel-detail-footer">
            <Button onClick={onClose} disabled={isLoading} loading={isLoading}>
              닫기
            </Button>

            <Button onClick={onClickSubmit} type="primary" disabled={isLoading} loading={isLoading}>
              환불
            </Button>
          </div>
        </div>
      </SOrderCancelModal>
    </SubMain>
  );
};

export default OrderCancelModal;
