import React, { useEffect, useState } from 'react';

import { Button, Input, Select } from 'antd';

import { setCreatedAt } from '../../constants/config';
import AboutService from '../../services/AboutService';

import DataDetailBody, { DataDetailItem } from '../../components/detailTable/DataDetailBody';
import TextArea from 'antd/lib/input/TextArea';

const AboutClassDetail = ({ open, onClose, id, refresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [body, setBody] = useState({});

  const [notiMessage, setNotiMessage] = useState('');

  console.log(body);

  useEffect(() => {
    if (notiMessage) {
      setTimeout(() => {
        setNotiMessage('');
      }, [2000]);
    }
  }, [notiMessage]);

  useEffect(() => {
    if (id && id !== 'new') {
      setIsLoading(true);

      AboutService?.info(id).then((res) => {
        setBody(res);
        setIsLoading(false);
      });
    } else {
      setBody({});
    }

    return () => setBody({});
  }, [id]);

  const onChangeBody = (type, e) => {
    setBody((prev) => ({ ...prev, [type]: e }));
  };

  const onSubmit = () => {
    setIsLoading(true);

    AboutService?.saveItem('edit', body)
      .then(() => {
        setNotiMessage('수정 되었습니다.');
      })
      .catch(() => {
        setNotiMessage('에러가 발생하였습니다. 잠시 후 다시시도해주세요.');
      })
      .finally(() => {
        refresh();
      });
  };

  const renderButtons = () => {
    return [
      <Button key="cancel-btn" style={{ marginRight: '5px' }} onClick={onClose}>
        취소
      </Button>,
      <Button key="add-btn" type="primary" style={{ marginRight: '5px' }} onClick={onSubmit}>
        {id === 'new' ? '등록' : '수정'}
      </Button>,
    ];
  };

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title={`사용자 ${id === 'new' ? '등록' : '수정'}`}
      extra={renderButtons()}
      subTitle={body?.name}
      isLoading={isLoading}
      notiMessage={notiMessage}
    >
      <DataDetailItem label="처리 상태">
        <Select
          value={body?.process || ''}
          style={{ width: '100%' }}
          onChange={(e) => onChangeBody('process', e)}
          options={[
            { value: 'wait', label: '대기중' },
            { value: 'cancel', label: '취소' },
            { value: 'confirm', label: '확인' },
          ]}
          disabled={isLoading}
        />
      </DataDetailItem>
      <DataDetailItem />

      <DataDetailItem label="이름">
        <Input value={body?.name || '-'} onChange={(e) => onChangeBody('name', e.target.value)} readOnly />
      </DataDetailItem>

      <DataDetailItem label="연락처">
        <Input value={body?.phone || '-'} onChange={(e) => onChangeBody('phone', e.target.value)} readOnly />
      </DataDetailItem>

      <DataDetailItem label="지역">
        <Input value={body?.region || '-'} onChange={(e) => onChangeBody('region', e.target.value)} readOnly />
      </DataDetailItem>

      <DataDetailItem label="인원">
        <Input value={body?.num || '-'} onChange={(e) => onChangeBody('num', e.target.value)} readOnly />
      </DataDetailItem>

      <DataDetailItem label="시간대">
        <Input value={body?.date || '-'} onChange={(e) => onChangeBody('date', e.target.value)} readOnly />
      </DataDetailItem>

      <DataDetailItem label="요가스타일">
        <Input value={body?.yogaStyle || '-'} onChange={(e) => onChangeBody('yogaStyle', e.target.value)} readOnly />
      </DataDetailItem>

      <DataDetailItem label="프로그램스타일">
        <Input value={body?.classStyle || '-'} onChange={(e) => onChangeBody('classStyle', e.target.value)} readOnly />
      </DataDetailItem>

      <DataDetailItem label="기타요청사항">
        <TextArea rows={6} value={body?.etc || '-'} onChange={(e) => onChangeBody('etc', e.target.value)} readOnly />
      </DataDetailItem>

      <DataDetailItem label="등록일시">
        <Input value={setCreatedAt(body?.createdAt, '-')} readOnly />
      </DataDetailItem>
    </DataDetailBody>
  );
};

export default AboutClassDetail;
