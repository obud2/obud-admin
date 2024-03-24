import React, { useEffect, useRef, useState } from 'react';

import { Button, Radio, Input, Switch, Checkbox } from 'antd';
import { Flex, Spacing } from '../../../styles/CommonStyles';

import DataDetailBody, { DataDetailItem } from '../../../components/detailTable/DataDetailBody';

import { useQuery } from 'react-query';
import CodeService from '../../../services/CodeService';

import swal from 'sweetalert';

import UploadBtn from '../../../components/common/uploadBtn/UploadBtn';
import FileUpload from '../../../components/fileUpload/FileUpload';
import DaumPost from '../../../components/daumPost/DaumPost';
import StudioRefundSettingList from './option/StudioRefundSettingList';
import { getStudio, setStudio } from '@/services/PlaceService';
import TextArea from 'antd/es/input/TextArea';

/**
 *
 * @param {*} id : 상품 등록 ID 값 new
 * @returns
 */
const PlaceDetail = ({ id, open, onClose, refresh }) => {
  const fileRef = useRef();

  const fetchData = async () => {
    const res = await Promise.all([CodeService.getItem('product-shell-setting'), CodeService.getItem('product-class-setting')]);
    const res1 = res[0]?.value || {};
    const res2 = res[1]?.value || {};

    return {
      convenience: res1?.convenience || [],
      information: res1?.information || '',
      refundPolicy: res1?.refundPolicy || '',
      serviceCenter: res1?.serviceCenter || '',
      type: res2?.type || [],
      category: res2?.category || [],
    };
  };

  const { data: code, isLoading: isCodeLoading } = useQuery(['product-code'], fetchData);

  const [body, setBody] = useState({});
  const [files, setFiles] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [notiMessage, setNotiMessage] = useState('');

  const [isPostOpen, setIsPostOpen] = useState(false);

  /** 기본정보 호출 */
  useEffect(() => {
    if (id && id !== 'new') {
      setIsLoading(true);

      getStudio(id).then((res) => {
        setBody(res);
        setFiles(res?.images);
        setIsLoading(false);
      });
    } else {
      setBody({
        value: '',
        information: code?.information || '',
        refundPolicy: code?.refundPolicy || '',
      });
      setFiles([]);
    }

    return () => {
      setBody({
        value: '',
        information: code?.information || '',
        refundPolicy: code?.refundPolicy || '',
      });
      setFiles([]);
    };
  }, [id, code]);

  /** 등록 / 수정 버튼 활성화 */
  useEffect(() => {
    if (body?.title && files?.length > 0) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [body, files]);

  const renderByCategory = () => {
    const cate = [...(code?.category || [])];
    const checkCate = [];
    const addBodyCate = [];

    // 카테고리 추가 및 타이틀 추출
    if (code?.category) {
      code?.category.forEach((a) => {
        checkCate.push(a?.title);
      });
    }

    // 프로그램에 이미 등록 된 카테고리 체크.
    body?.category?.forEach((a) => {
      if (!checkCate.includes(a)) addBodyCate.push(a);
    });

    // 삭제 된 카테고리 추가
    addBodyCate?.forEach((a) => {
      cate.push({
        title: a,
        type: 'category',
        isShow: true,
        delete: true, // Style 구분
      });
    });

    return cate;
  };

  const renderByConvenience = () => {
    const convenience = [...(code?.convenience || [])];
    const checkCate = [];
    const addBodyCate = [];

    // 편의시설 추가 및 타이틀 추출
    if (code?.convenience) {
      code?.convenience.forEach((a) => {
        checkCate.push(a?.title);
      });
    }

    // 프로그램에 이미 등록 된 편의시설 체크.
    body?.convenience?.forEach((a) => {
      if (!checkCate.includes(a)) addBodyCate.push(a);
    });

    // 삭제 된 편의시설 추가
    addBodyCate?.forEach((a) => {
      convenience.push({
        title: a,
        type: 'convenience',
        isShow: true,
        chosen: false,
        delete: true, // Style 구분
      });
    });

    return convenience;
  };

  const onChangeInputValue = (type, e) => {
    setBody((prev) => ({ ...prev, [type]: e }));
  };

  const onClickToggle = (type, e) => {
    const bodyCopy = [...(body[type] || [])];

    const findIndex = bodyCopy?.findIndex((a) => a === e);

    if (findIndex > -1) {
      bodyCopy?.splice(findIndex, 1);
    } else {
      bodyCopy?.push(e);
    }

    setBody((prev) => ({ ...prev, [type]: bodyCopy }));
  };

  const onSubmit = async () => {
    const text = id === 'new' ? '등록' : '수정';
    const param = {
      ...body,
    };

    if (!(param?.category?.length > 0)) {
      emptyCheck('카테고리를 선택해주세요.');
      return;
    }
    if (!param?.title) {
      emptyCheck('상품명을 입력해주세요.');
      return;
    }

    const files = await fileRef.current.upload('studio');
    param.images = files.images || [];

    setIsLoading(true);
    setStudio(id, param)
      .then(() => {
        setNotiMessage(`${text} 되었습니다.`);
      })
      .catch(() => {
        setNotiMessage('에러가 발생하였습니다. 잠시 후 다시시도해주세요.');
      })
      .finally(() => {
        refresh();
        setIsLoading(false);
      });
  };

  const emptyCheck = (text) => {
    swal({
      title: '',
      text,
      icon: 'warning',
    });
  };

  const renderButtons = () => {
    return [
      <Button key="cancel-btn" style={{ width: '70px', marginRight: '5px' }} onClick={onClose}>
        취소
      </Button>,
      <Button key="add-btn" type="primary" style={{ width: '70px' }} disabled={!isActive} onClick={onSubmit}>
        {id === 'new' ? '등록' : '수정'}
      </Button>,
    ];
  };

  const isAllLoading = isLoading || isCodeLoading;

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title={`장소 ${id === 'new' ? '등록' : '수정'}`}
      extra={renderButtons()}
      subTitle={body?.id}
      isLoading={isAllLoading}
      notiMessage={notiMessage}
    >
      <DataDetailItem label="게시여부" span={2}>
        <Switch style={{ width: '50px' }} checked={body?.isShow || false} onChange={(e) => onChangeInputValue('isShow', e)} />
      </DataDetailItem>

      <DataDetailItem label="카테고리" span={2} point>
        {renderByCategory()
          ?.filter((a) => a?.isShow)
          ?.map((category) => (
            <Checkbox
              key={category?.title}
              checked={body?.category?.includes(category?.title)}
              value={category?.title || ''}
              onChange={(e) => onClickToggle('category', e.target.value, category?.delete)}
            >
              <p style={category?.delete ? { color: '#ec35197c' } : {}}>{category?.title || ''}</p>
            </Checkbox>
          ))}
      </DataDetailItem>

      <DataDetailItem label="장소명" point span={2}>
        <Input
          placeholder="장소명을 입력하세요."
          value={body?.title || ''}
          onChange={(e) => onChangeInputValue('title', e.target.value)}
          disabled={isAllLoading}
        />
      </DataDetailItem>

      <DataDetailItem label="이미지" point span={2}>
        <UploadBtn onClick={fileRef} helpText="권장 사이즈 : 123*123 / 최대 용량 : 5MB / 최대 개수 : 5개" />
        <FileUpload ref={fileRef} files={files} maxCount={5} onFileHandler={setFiles} folder="studio" />
      </DataDetailItem>

      <DataDetailItem label="상세정보" span={2}>
        <TextArea
          value={body?.contents || ''}
          onChange={(e) => onChangeInputValue('contents', e.target.value)}
          rows={15}
          disabled={isAllLoading}
        />
      </DataDetailItem>

      <DataDetailItem label="상세주소" span={2}>
        <Flex gap="10px">
          <Input placeholder="기본 주소를 입력하세요." value={body?.addr || ''} readOnly disabled={isAllLoading} />
          <Button type="primary" onClick={() => setIsPostOpen(true)}>
            주소찾기
          </Button>

          <DaumPost isOpen={isPostOpen} isClose={() => setIsPostOpen(false)} onChange={(e, extra) => onChangeInputValue('addr', `${e}`)} />
        </Flex>
        <Spacing spacing="10" />

        <Input
          placeholder="상세 주소를 입력하세요."
          value={body?.addrDetail || ''}
          onChange={(e) => onChangeInputValue('addrDetail', e.target.value)}
          disabled={isAllLoading}
        />
      </DataDetailItem>

      <DataDetailItem label="주차정보" span={2}>
        <Radio.Group onChange={(e) => onChangeInputValue('parking', e.target.value)} value={body?.parking || ''} disabled={isAllLoading}>
          <Radio value="true">주차 가능</Radio>
          <Radio value="false">주차 불가능</Radio>
        </Radio.Group>
        <Spacing />

        <Input
          placeholder="추가 안내 사항을 입력하세요."
          value={body?.parkingInfo || ''}
          onChange={(e) => onChangeInputValue('parkingInfo', e.target.value)}
          disabled={isAllLoading}
        />
      </DataDetailItem>

      <DataDetailItem label="홈페이지" span={2}>
        <Input
          placeholder="URL 을 입력하세요."
          value={body?.homepage || ''}
          onChange={(e) => onChangeInputValue('homepage', e.target.value)}
          disabled={isAllLoading}
        />
      </DataDetailItem>

      <DataDetailItem label="센터연락처" span={2}>
        <Input
          value={body?.serviceCenter || ''}
          onChange={(e) => onChangeInputValue('serviceCenter', e.target.value)}
          disabled={isAllLoading}
        />
      </DataDetailItem>

      <DataDetailItem label="편의시설" span={2}>
        {renderByConvenience()
          ?.filter((a) => a?.isShow)
          ?.map((item) => {
            const isCheck = body?.convenience?.includes(item?.title) || false;

            return (
              <Button
                key={item?.title}
                style={item?.delete ? { backgroundColor: '#ec35197c', margin: '0 5px 5px 0' } : { margin: '0 5px 5px 0' }}
                type={isCheck ? 'primary' : 'default'}
                onClick={(e) => onClickToggle('convenience', item?.title)}
                disabled={isAllLoading}
              >
                {item?.title}
              </Button>
            );
          })}
      </DataDetailItem>

      <DataDetailItem label="이용안내" span={2}>
        <Input.TextArea
          rows={6}
          value={body?.information || ''}
          onChange={(e) => onChangeInputValue('information', e.target.value)}
          disabled={isAllLoading}
        />
      </DataDetailItem>

      <DataDetailItem label="환불규정" span={2}>
        <Input.TextArea
          rows={6}
          value={body?.refundPolicy || ''}
          onChange={(e) => onChangeInputValue('refundPolicy', e.target.value)}
          disabled={isAllLoading}
        />
      </DataDetailItem>

      <DataDetailItem label="환불기준 설정" span={2}>
        <StudioRefundSettingList list={body?.refund} onChange={(e) => onChangeInputValue('refund', e)} isLoading={isAllLoading} />
      </DataDetailItem>
    </DataDetailBody>
  );
};

export default PlaceDetail;
