import React, { useEffect, useState } from 'react';

import swal from 'sweetalert';

import { Card } from 'antd';
import { SStudioRefundSettingList } from './StudioRefundSettingList.styled';
import StudioRefundSettingDetail from './StudioRefundSettingDetail';

const StudioRefundSettingList = ({ list, onChange, isLoading }) => {
  const [refund, setRefund] = useState([]);
  const [body, setBody] = useState({ isOpen: false, data: '' });

  useEffect(() => {
    if (list && list?.length > 0) {
      const temp = [...list];

      temp.sort((a, b) => (a?.day < b?.day ? -1 : 1));

      setRefund(temp);
    }
  }, [list]);

  const onClickDeleteCode = (i) => {
    swal({
      title: '삭제하시겠습니까?',
      text: '삭제 후 복구가 불가능합니다.',
      buttons: true,
      icon: 'warning',
    }).then((willDelete) => {
      if (willDelete) {
        const temp = [...list];

        temp?.splice(i, 1);

        onChange(temp);
      }
    });
  };

  const onClickOpenCodeList = (data) => {
    if (isLoading) return;
    setBody({ isOpen: true, data: data || '' });
  };

  const onClickCloseCodeList = () => {
    if (isLoading) return;

    setBody({ isOpen: false, data: '' });
  };

  return (
    <React.Fragment>
      <Card type="inner" title="환불기준" bordered extra={<CardExtra title="추가하기" onClick={() => onClickOpenCodeList()} />}>
        <SStudioRefundSettingList>
          <div className="refund-list-container">
            {refund && refund?.length > 0 ? (
              refund?.map((item, i) => (
                <ul key={`refund-${item?.day}`} className="refund-list-item">
                  <li>{`${item?.day}일 전`}</li>
                  <li>{`${item?.percent}% 환불`}</li>
                  <li>
                    <button className="edit-btn" onClick={() => onClickOpenCodeList(item)} disabled={item?.disabled}>
                      수정
                    </button>
                    <button className="delete-btn" onClick={() => onClickDeleteCode(i)} disabled={item?.disabled}>
                      삭제
                    </button>
                  </li>
                </ul>
              ))
            ) : (
              <div className="empty-list">등록된 항목이 존재하지 않습니다.</div>
            )}
          </div>
        </SStudioRefundSettingList>
      </Card>

      <StudioRefundSettingDetail
        isOpen={body?.isOpen}
        isClose={onClickCloseCodeList}
        list={refund}
        data={body?.data || {}}
        onAdd={onChange}
      />
    </React.Fragment>
  );
};

const CardExtra = ({ title, isLoading, onClick }) => {
  return (
    <a href="#" disabled={isLoading} onClick={onClick}>
      {title}
    </a>
  );
};

export default StudioRefundSettingList;
