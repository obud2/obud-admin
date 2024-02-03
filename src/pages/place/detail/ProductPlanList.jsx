import React, { useEffect, useState } from 'react';
import './ProductPlanList.css';

import { Button, InputNumber } from 'antd';

import _ from 'lodash';

import 'moment/locale/ko';
import moment from 'moment';

import DataDetailBody from '../../../components/detailTable/DataDetailBody';
import DataListTable from '../../../components/dataTable/DataListTable';
import { clonePlan, deletePlan, setPlan } from '@/services/PlaceService';

/**
 *
 * @param {*} id : 상품 등록 ID 값 new
 * @returns
 */
const ProductPlanList = ({ data, open, onDetail, onClose, month, setNotiMessage, lessonId, refetch }) => {
  const dateFormat = 'YYYYMMDDHHmmss';
  moment.lang('ko', {
    weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
  });

  const [body, setBody] = useState([]);

  useEffect(() => {
    const copy = [];

    data?.map((a) => {
      const now = moment().format(dateFormat).valueOf();
      const start = moment(a.startDate).format(dateFormat).valueOf();

      if (Number(now) < Number(start)) {
        copy.push(a);
      }
    });

    copy?.map((a) => {
      if (a?.currentMember > 0) {
        a.isDisabled = true;
      }
    });

    setBody(copy);
  }, [data]);

  const onClickEdit = (data) => {
    const param = {
      id: data?.id,

      lessonId,
      startDate: data?.startDate,
      endDate: data?.endDate,
      instructor: data?.instructor,

      // Edit
      price: data?.price,
      maxMember: data?.maxMember,
    };

    setPlan('edit', param)
      .then(() => {
        setNotiMessage('수정 되었습니다.');
      })
      .catch((res) => {
        setNotiMessage(res?.data?.meta);
      })
      .finally(() => {
        refetch();
      });
  };

  const onChangeInputValue = (type, e, data) => {
    const findIndex = body.findIndex((a) => a?.id === data?.id);
    const temp = _.cloneDeep(body);

    if (findIndex > -1) {
      temp[findIndex][type] = e;
    }

    setBody(temp);
  };

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
      customBodyRender: (value, data) => {
        return (
          <InputNumber
            min={1}
            max={1000}
            placeholder="숫자만 입력하세요."
            value={value || ''}
            style={{ width: '100%' }}
            size="small"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={(e) => onChangeInputValue('maxMember', e, data)}
          />
        );
      },
    },
    {
      id: 'price',
      label: '가격',
      customBodyRender: (value, data) => {
        const isDisabled = data?.isDisabled;

        return (
          <InputNumber
            placeholder="숫자만 입력하세요."
            value={value || ''}
            style={{ width: '100%' }}
            size="small"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={(e) => onChangeInputValue('price', e, data)}
            disabled={isDisabled}
          />
        );
      },
    },
    {
      id: 'id',
      label: '',
      customBodyRender: (_, data) => {
        return <Button onClick={() => onClickEdit(data)}>수정</Button>;
      },
    },
  ];

  const useOption = [
    { label: '상세', onClick: (e) => onDetail('', e) },
    { label: '복제', onClick: (e) => onClone(e) },
    { label: '삭제', onClick: (e) => onDelete(e) },
  ];

  const onClone = (id) => {
    swal({
      title: '상품을 복제하시겠습니까?',
      text: '',
      buttons: true,
      icon: 'info',
    }).then(async (willDelete) => {
      if (willDelete) {
        await clonePlan(id);
        refetch();
      }
    });
  };

  const onDelete = async (id) => {
    swal({
      title: '상품을 삭제하시겠습니까?',
      text: '',
      buttons: true,
      icon: 'warning',
    }).then(async (willDelete) => {
      if (willDelete) {
        await deletePlan(id);
        refetch();
      }
    });
  };

  const renderButtons = () => {
    return [
      <Button key="cancel-btn" style={{ width: '70px', marginRight: '5px' }} onClick={onClose}>
        닫기
      </Button>,
    ];
  };

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title={`일정 (${month})`}
      subTitle="날짜가 지난 상품은 노출되지 않습니다."
      extra={renderButtons()}
    >
      <DataListTable data={body || []} header={LIST_HEADER} useDetail={false} useOption={useOption} />
    </DataDetailBody>
  );
};

export default ProductPlanList;
