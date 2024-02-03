import React, { useState } from 'react';

import { Button, Checkbox, Input, Typography } from 'antd';

import moment from 'moment';

import { useQuery } from 'react-query';

import { DataDetailItem } from '../../../components/detailTable/DataDetailBody';

import SideBar from '../../../components/sidebar/SideBar';

import DataListTable from '../../../components/dataTable/DataListTable';

import PlanCommentDetail from './option/PlanCommentDetail';
import { getPlan, onAttendance } from '@/services/ScheduleService';

/**
 *
 * @param {*} id : 상품 등록 ID 값 new
 * @returns
 */
const ProductPlanResevationList = ({ id, lesson, open, onClose }) => {
  const [isCommentOpen, setIsCommentOpen] = useState('');

  const {
    data: plan,
    isLoading: isPlanLoading,
    isRefetching: isPlanRefetchLoading,
    refetch,
  } = useQuery(['product-plan-item', id], () => getPlan(id), {
    enabled: !!id,
  });

  const isAllLoading = isPlanLoading || isPlanRefetchLoading;

  const LIST_HEADER = [
    // {
    //   id: 'orderId',
    //   label: '주문번호',
    //   customBodyRender: (value) => {
    //     return value;
    //   },
    // },
    {
      id: 'reservationer',
      label: '예약자명',
    },
    {
      id: 'reservationCount',
      label: '인원',
      customBodyRender: (value) => {
        return `${value || 0}명`;
      },
    },
    {
      id: 'attendance',
      label: '출석여부',
      customBodyRender: (value, data) => {
        const onClickAttendance = () => {
          const param = {
            orderItemId: data?.id,
            isAttendance: !value,
          };

          onAttendance(param).then(() => {
            refetch();
          });
        };

        return <Checkbox checked={value} onClick={onClickAttendance} disabled={isAllLoading} />;
      },
    },
    {
      id: 'comment',
      label: '메모',
      customBodyRender: (value, data) => {
        const onFocusComment = () => {
          setIsCommentOpen(data);
        };

        return <Input value={value || ''} readOnly onFocus={onFocusComment} disabled={isAllLoading} />;
      },
    },
  ];

  const renderButtons = () => {
    return [
      <Button key="cancel-btn" style={{ width: '70px', marginRight: '5px' }} onClick={onClose}>
        닫기
      </Button>,
    ];
  };

  return (
    <SideBar open={open} onClose={onClose} title="예약자 명단" subTitle={lesson?.title || ''} extra={renderButtons()}>
      <DataDetailItem label="시간" span={2}>
        <Typography.Text>
          {`${moment(plan?.startDate).format('YYYY-MM-DD HH:mm')} ~ ${moment(plan?.endDate).format('HH:mm')}`}
        </Typography.Text>
      </DataDetailItem>

      <DataDetailItem label="강사" span={2}>
        <Typography.Text>{plan?.instructorInfo?.name || '-'}</Typography.Text>
      </DataDetailItem>

      <DataDetailItem label="예약/정원" span={2}>
        <Typography.Text type="danger">{plan?.currentMember || 0}</Typography.Text>
        <Typography.Text>{' / '}</Typography.Text>
        <Typography.Text>{plan?.maxMember || 0}</Typography.Text>
      </DataDetailItem>

      <DataDetailItem label="예약현황" span={2}>
        <Typography.Text type="danger">{plan?.reservationStatus === 'impossible' ? '예약불가능' : '예약가능'}</Typography.Text>
      </DataDetailItem>
      <DataDetailItem span={2} />

      <DataListTable data={plan?.reservationList || []} header={LIST_HEADER} useDetail={false} />

      <PlanCommentDetail isOpen={isCommentOpen} onClose={() => setIsCommentOpen('')} data={isCommentOpen} refetch={refetch} />
    </SideBar>
  );
};

export default ProductPlanResevationList;
