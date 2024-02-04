import React, { useEffect, useState } from 'react';

import { useQuery } from 'react-query';
import UserService from '../../../services/UserService';

import dayjs from 'dayjs';
import swal from 'sweetalert';

import 'dayjs/locale/ko';
import locale from 'antd/es/date-picker/locale/ko_KR';

import { Button, DatePicker, Input, InputNumber, Select, Switch } from 'antd';

import DataDetailBody, { DataDetailItem } from '../../../components/detailTable/DataDetailBody';

import { clonePlan, deletePlan, getPlan, setPlan } from '@/services/ScheduleService';
import { Flex } from '@/styles/CommonStyles';
import { getProgramTitlePresets } from '@/services/ProgramService';

/**
 *
 * @param {*} id : 상품 등록 ID 값 new
 * @returns
 */

const ProductPlanDetail = ({ id, open, onClose, lessonId, refetch }) => {
  const dateFormat = 'YYYY-MM-DDTHH:mm';
  const defaultBody = { isShow: false, startDate: '', endDate: '', payOption: {} };

  /**
   *
   * @returns 강사 값 호출
   */
  const fetchData = async () => {
    const res = await UserService.getInstructor();

    const instructorArray = [{ label: '선택안함', value: '' }];

    res?.map((a) => {
      instructorArray.push({
        label: a?.name,
        value: a?.id,
      });
    });

    return instructorArray;
  };

  const { data: instructor } = useQuery(['user-instructor'], fetchData);
  // --------------------------------------------------

  const [body, setBody] = useState(defaultBody);
  const [option, setOption] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState('');

  const [isOption, setIsOption] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);

  const { data: presets } = useQuery(['/program/preset', { programId: lessonId }], () => getProgramTitlePresets(lessonId), {
    enabled: !!lessonId,
  });

  const reset = () => {
    setBody(defaultBody);
    setOption({});
    setIsLoading(false);
    setNotiMessage('');
    setIsOption(false);
    setIsDisabled(false);
  };

  /** 기본정보 호출 */
  useEffect(() => {
    if (id && id !== 'new') {
      setIsLoading(true);

      getPlan(id).then((res) => {
        if (res?.currentMember > 0) {
          setIsDisabled(true);
        }

        if (res?.payOption?.title) {
          setIsOption(true);
          setOption(res?.payOption);
        }

        setBody(res);
        setIsLoading(false);
      });
    } else {
      setIsDisabled(false);
      setIsOption(false);
      setBody(defaultBody);
      setOption({});
    }

    return () => {
      setIsDisabled(false);
      setIsOption(false);
      setBody(defaultBody);
      setOption({});
    };
  }, [id]);

  const onChangeInputValue = (type, e) => {
    setBody((prev) => ({ ...prev, [type]: e }));
  };

  const onChangeOptionValue = (type, e) => {
    setOption((prev) => ({ ...prev, [type]: e }));
  };

  const onChangeOption = (e) => {
    setIsOption(e);
  };

  const onSubmit = async () => {
    const text = id === 'new' ? '등록' : '수정';
    const param = {
      ...body,
      lessonId,
    };

    if (!param?.startDate) {
      emptyCheck('프로그램일을 입력해주세요.');
      return;
    }
    if (!param?.endDate) {
      emptyCheck('프로그램일을 입력해주세요.');
      return;
    }
    if (param?.price < 0) {
      emptyCheck('가격을 입력해주세요.');
      return;
    }
    if (!(param?.maxMember > 0)) {
      emptyCheck('최대정원을 입력해주세요.');
      return;
    }

    if (isOption) {
      param.payOption = option;
    } else {
      param.payOption = {};
    }

    if (isOption) {
      if (!param?.payOption?.title) {
        emptyCheck('옵션명을 입력해주세요.');
        return;
      }

      if (param?.payOption?.price < 0) {
        emptyCheck('옵션가격을 입력해주세요.');
        return;
      }

      if (!(param?.payOption?.maxMember > 0)) {
        emptyCheck('옵션최대정원을 입력해주세요.');
        return;
      }

      if (param?.maxMember < param?.payOption?.maxMember) {
        emptyCheck('옵션 최대정원은 일정 최대정원을 초과할 수 없습니다.');
        return;
      }
    }

    setIsLoading(true);
    setPlan(id, param)
      .then(() => {
        setNotiMessage(`${text} 되었습니다.`);
        reset();
      })
      .catch((res) => {
        setNotiMessage(res?.data?.meta || res?.data?.message);
      })
      .finally(() => {
        refetch();
        setIsLoading(false);
      });
  };

  const onClone = () => {
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

  const onDelete = async () => {
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

  const emptyCheck = (text) => {
    swal({
      title: '',
      text,
      icon: 'warning',
    });
  };

  const renderButtons = () => {
    const btn = [];

    if (id !== 'new') {
      btn.push(
        <Button key="clone-btn" type="dashed" style={{ width: '70px' }} onClick={onClone}>
          복제
        </Button>,
        <Button key="delete-btn" type="dashed" style={{ width: '70px', margin: '0 5px' }} onClick={onDelete}>
          삭제
        </Button>,
      );
    }

    btn.push(
      <Button key="cancel-btn" style={{ width: '70px', marginRight: '5px' }} onClick={onClose}>
        취소
      </Button>,
      <Button key="add-btn" type="primary" style={{ width: '70px' }} onClick={onSubmit}>
        {id === 'new' ? '등록' : '수정'}
      </Button>,
    );

    return btn;
  };

  const isAllLoading = isLoading;

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title={`일정 ${id === 'new' ? '등록' : '수정'}`}
      extra={renderButtons()}
      subTitle={body?.id}
      isLoading={isAllLoading}
      notiMessage={notiMessage}
    >
      <DataDetailItem label="게시여부" span={2}>
        <Switch style={{ width: '50px' }} checked={body?.isShow || false} onChange={(e) => onChangeInputValue('isShow', e)} />
      </DataDetailItem>

      <DataDetailItem label="일정" point span={2}>
        <DatePicker.RangePicker
          showTime
          hourStep={1}
          minuteStep={5}
          secondStep={10}
          disabled={isDisabled}
          locale={locale}
          style={{ width: '100%' }}
          format={dateFormat}
          value={[body?.startDate ? dayjs(body?.startDate, dateFormat) : '', body?.endDate ? dayjs(body?.endDate, dateFormat) : '']}
          onChange={(e, dateString) => {
            const date = dateString?.[0]?.split('T')[0];
            const endTime = dateString?.[1]?.split('T')[1];

            const start = dateString?.[0];
            const end = `${date}T${endTime}`;

            onChangeInputValue('startDate', start);
            onChangeInputValue('endDate', end);
          }}
        />
      </DataDetailItem>

      <DataDetailItem label="(선택) 회차명" span={2}>
        <Flex flexDirection="column" gap="5px">
          <Select
            placeholder="(선택) 회차명을 선택해주세요."
            style={{ width: '100%' }}
            disabled={isAllLoading}
            value={body.scheduleTitlePresetId}
            onChange={(id) => {
              setBody((prev) => ({ ...prev, scheduleTitlePresetId: id }));
            }}
          >
            {(presets ?? []).map((it) => (
              <Select.Option key={it.id} value={it.id}>
                {it.title}
              </Select.Option>
            ))}
          </Select>
        </Flex>
      </DataDetailItem>

      <DataDetailItem label="가격" point span={2}>
        <InputNumber
          addonAfter="원"
          placeholder="숫자만 입력하세요."
          value={body?.price}
          style={{ width: '100%' }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          onChange={(e) => onChangeInputValue('price', e)}
          disabled={isAllLoading || isDisabled}
        />
      </DataDetailItem>

      <DataDetailItem label="가격(정가)" span={2}>
        <InputNumber
          addonAfter="원"
          placeholder="숫자만 입력하세요."
          min={body?.price}
          value={body?.fakePrice}
          style={{ width: '100%' }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          onChange={(e) => onChangeInputValue('fakePrice', e)}
          disabled={isAllLoading || isDisabled}
        />
      </DataDetailItem>

      {body?.id && (
        <DataDetailItem label="품절처리" span={2}>
          <Switch
            style={{ width: '50px' }}
            checked={body?.reservationStatus === 'impossible'}
            onChange={(e) => onChangeInputValue('reservationStatus', e ? 'impossible' : 'possible')}
          />
        </DataDetailItem>
      )}

      <DataDetailItem label="최대정원" point span={2}>
        <InputNumber
          min={1}
          max={1000}
          addonAfter="명"
          placeholder="숫자만 입력하세요."
          value={body?.maxMember || ''}
          style={{ width: '100%' }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          onChange={(e) => onChangeInputValue('maxMember', e)}
          disabled={isAllLoading}
        />
      </DataDetailItem>

      {body?.id && (
        <DataDetailItem label="현재예약인원" span={2}>
          <InputNumber
            addonAfter="명"
            value={body?.currentMember ?? 0}
            style={{ width: '100%' }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            disabled
          />
        </DataDetailItem>
      )}

      <DataDetailItem label="강사" span={2}>
        <Select
          showSearch
          placeholder="강사를 선택해주세요."
          optionFilterProp="children"
          style={{ width: '100%' }}
          value={body?.instructor}
          onChange={(e) => onChangeInputValue('instructor', e)}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          options={instructor}
        />
      </DataDetailItem>

      <DataDetailItem span={2} />

      <DataDetailItem label="옵션여부" span={2}>
        <Switch style={{ width: '50px' }} checked={isOption} onChange={onChangeOption} disabled={isDisabled} />
      </DataDetailItem>

      {isOption && (
        <React.Fragment>
          <DataDetailItem point label="옵션명" span={2}>
            <Input
              placeholder="옵션명을 입력해주세요."
              value={option?.title || ''}
              style={{ width: '100%' }}
              onChange={(e) => onChangeOptionValue('title', e.target.value)}
              disabled={isAllLoading}
            />
          </DataDetailItem>

          <DataDetailItem label="옵션가격" span={2}>
            <InputNumber
              addonAfter="원"
              placeholder="숫자만 입력하세요."
              value={option?.price}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              onChange={(e) => onChangeOptionValue('price', e)}
              disabled={isAllLoading}
            />
          </DataDetailItem>

          <DataDetailItem point label="옵션 최대정원" span={2}>
            <InputNumber
              min={1}
              max={body?.maxMember || 0}
              addonAfter="명"
              placeholder="일정의 최대정원 이상은 입력이 불가능합니다."
              value={option?.maxMember || ''}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              onChange={(e) => onChangeOptionValue('maxMember', e)}
              disabled={isAllLoading}
            />
          </DataDetailItem>
        </React.Fragment>
      )}
    </DataDetailBody>
  );
};

export default ProductPlanDetail;
