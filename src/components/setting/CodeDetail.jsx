import React, { useEffect, useState } from 'react';

import { SCodeDetail } from './CodeDetail.styled';
import { Button, Input, Typography } from 'antd';

import SubMain from '../../sub-main';

const TYPE_CHECK = {
  convenience: '공간 - 편의시설',
  type: '수업 - 분류',
  category: '수업 - 카테고리',
};

const CodeDetail = ({ isOpen, isClose, list, type, data, onAdd }) => {
  const [isData, setIsData] = useState(false);
  const [body, setBody] = useState({ isShow: true, title: '' });

  useEffect(() => {
    if (data?.title) {
      setBody(data);
      setIsData(true);
    }
  }, [data]);

  const onChangeBodyValue = (type, e) => {
    setBody((prev) => ({ ...prev, [type]: e }));
  };

  const onClickClose = () => {
    setIsData(false);
    setBody({ isShow: true, title: '' });
    isClose();
  };

  const onClickAddForm = () => {
    const temp = [...(list || [])];
    const title = [];

    temp?.forEach((item) => {
      title.push(item?.title);
    });

    if (title?.includes(body?.title)) {
      swal({
        text: '같은 이름의 항목이 존재합니다.',
        icon: 'warning',
      });

      return;
    }

    if (isData) {
      const findIndex = temp?.findIndex((a) => a?.title === data?.title);

      temp[findIndex] = body;
    } else {
      temp.push({ ...body, type: type });
    }

    onAdd(type, temp);
    onClickClose();
  };

  return (
    <SubMain>
      <SCodeDetail isOpen={isOpen}>
        <div className="code-detail-background" />

        <div className="code-detail-container">
          <div className="code-detail-header">
            <p className="code-detail-title">
              {TYPE_CHECK[type]} {isData && '(수정)'}
            </p>

            <button className="code-detail-close" onClick={onClickClose} />
          </div>

          <div className="code-detail-contents">
            <Typography.Text>항목</Typography.Text>
            <Input
              placeholder="항목이름을 입력해주세요."
              value={body?.title}
              onChange={(e) => onChangeBodyValue('title', e.target.value)}
            />
          </div>

          <div className="code-detail-footer">
            <Button onClick={onClickClose}>취소</Button>

            <Button type="primary" onClick={onClickAddForm}>
              {isData ? '수정' : '추가'}
            </Button>
          </div>
        </div>
      </SCodeDetail>
    </SubMain>
  );
};

export default CodeDetail;
