import React from 'react';
import './OrderStatusCalendarPalnList.css';

import { Button, InputNumber } from 'antd';

import _ from 'lodash';

import { useQuery } from 'react-query';
import ProductService from '../../../services/ProductService';

import 'moment/locale/ko';
import moment from 'moment';

import DataDetailBody from '../../../components/detailTable/DataDetailBody';
import DataListTable from '../../../components/dataTable/DataListTable';
import DetailHeader from '../../../components/detailTable/DetailHeader';

/**
 *
 * @param {*} id : 상품 등록 ID 값 new
 * @returns
 */
const OrderStatusCalendarPalnList = ({ month, open, onClose, onResevation, lessonId }) => {
  moment.lang('ko', {
    weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
  });

  const fetchData = async () => {
    const res = await ProductService?.getPlanCaledarDayInfo(lessonId, month);

    return res;
  };

  const { data: plan } = useQuery(['order-status-plan-items', lessonId, month], fetchData);

  const LIST_HEADER = [
    {
      id: 'startDate',
      label: '날짜',
      customBodyRender: (value) => {
        const day = moment(value).locale('ko').format('ddd');

        return (
          <div className="day-container">
            <p>{moment(value).locale('ko').format('YYYY-MM-DD')}</p>
            <p className={`day-color ${day}`}>{`(${day})`}</p>
          </div>
        );
      },
    },
    {
      id: 'id',
      label: '시간',
      customBodyRender: (_, data) => {
        const startTime = moment(data?.startDate).format('HH:mm');
        const endTime = moment(data?.endDate).format('HH:mm');

        return `${startTime || ''} ~ ${endTime || ''}`;
      },
    },
    {
      id: 'currentMember',
      label: '예약 인원',
      customBodyRender: (value) => {
        const isCheck = value > 0;

        return <p style={isCheck ? { color: '#ff00ff' } : {}}>{value}</p>;
      },
    },
    {
      id: 'maxMember',
      label: '정원',
      customBodyRender: (value) => {
        return (
          <InputNumber
            min={1}
            max={1000}
            placeholder="숫자만 입력하세요."
            value={value || ''}
            style={{ width: '100%' }}
            size="small"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            disabled
          />
        );
      },
    },
    {
      id: 'price',
      label: '가격',
      customBodyRender: (value) => {
        return (
          <InputNumber
            placeholder="숫자만 입력하세요."
            value={value || ''}
            style={{ width: '100%' }}
            size="small"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            disabled
          />
        );
      },
    },
    {
      id: 'id',
      label: '예약자 명단',
      customBodyRender: (_, data) => {
        return <Button onClick={() => onResevation(data)}>보기</Button>;
      },
    },
  ];

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title={`일정 (${month})`}
      extra={[
        <Button key="cancel-btn" style={{ width: '70px', marginRight: '5px' }} onClick={onClose}>
          닫기
        </Button>,
      ]}
    >
      {plan &&
        plan?.length > 0 &&
        plan?.map((item) => (
          <React.Fragment key={item?.id}>
            <DetailHeader title={item?.title} />
            <DataListTable
              data={item?.planList?.sort((a, b) => (a?.startDate < b?.startDate ? 1 : -1)) || []}
              header={LIST_HEADER}
              useDetail={false}
            />
          </React.Fragment>
        ))}
    </DataDetailBody>
  );
};

export default OrderStatusCalendarPalnList;
