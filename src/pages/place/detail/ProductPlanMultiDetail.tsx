// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState } from 'react';

import { useQuery } from 'react-query';
import UserService from '../../../services/UserService';

import _ from 'lodash';
import dayjs from 'dayjs';
import swal from 'sweetalert';

import 'dayjs/locale/ko';
import locale from 'antd/es/date-picker/locale/ko_KR';

import { WEEK, disabledDate } from './ProductPlanMultiDetail.option';
import { Flex } from '../../../styles/CommonStyles';
import { Button, DatePicker, Input, InputNumber, Select, Space, Switch, TimePicker, Typography } from 'antd';

import DataDetailBody, { DataDetailItem } from '../../../components/detailTable/DataDetailBody';

import { setMultiPlan } from '@/services/ScheduleService';
import { getProgramTitlePresets } from '@/services/ProgramService';

const ProductPlanMultiDetail = ({ open, onClose, lessonId, refetch }) => {
  const dateFormat = 'YYYY-MM-DD';

  const defaultBody = { startDate: '', endDate: '', payOption: {} };

  /**
   *
   * @returns 강사 값 호출
   */
  const fetchData = async () => {
    const res = await UserService.getInstructor();

    const instructorArray = [{ label: '선택안함', value: '' }];

    res?.forEach((a) => {
      instructorArray.push({
        label: a.name,
        value: a.id,
      });
    });

    return instructorArray;
  };

  const { data: instructor } = useQuery(['user-instructor'], fetchData);
  // --------------------------------------------------

  const [body, setBody] = useState(defaultBody);

  const [timeList, setTimeList] = useState([{}]);
  const [option, setOption] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState('');

  const [isOption, setIsOption] = useState(false);

  /** 기본정보 호출 */
  useEffect(() => {
    setIsOption(false);

    setBody(defaultBody);
    setTimeList([{}]);
    setOption({});

    return () => {
      setIsOption(false);
      setBody(defaultBody);
      setTimeList([{}]);
      setOption({});
    };
  }, [open]);

  const onChangeInputValue = (type, e) => {
    setBody((prev) => ({ ...prev, [type]: e }));
  };

  const onClickDays = (e) => {
    const week = [...(body?.days || [])];
    const findIndex = week.findIndex((a) => a === e);

    if (findIndex > -1) {
      week.splice(findIndex, 1);
    } else {
      week.push(e);
    }

    setBody((prev) => ({ ...prev, days: week }));
  };

  const onClickAddTime = () => {
    setTimeList((prev) => [...prev, {}]);
  };

  const onClickDeleteTime = (index) => {
    const temp = _.cloneDeep(timeList);

    temp.splice(index, 1);

    setTimeList(temp);
  };

  const onChangeTimeItem = async (index, type, e) => {
    const temp = _.cloneDeep(timeList);

    if (type === 'time') {
      const startTime = e.split('T')[0];
      const endTime = e.split('T')[1];

      temp[index].startTime = startTime;
      temp[index].endTime = endTime;
    } else {
      temp[index][type] = e;
    }

    await setTimeList(temp);
  };

  const onChangeOptionValue = (type, e) => {
    setOption((prev) => ({ ...prev, [type]: e }));
  };

  const onChangeOption = (e) => {
    setIsOption(e);
  };

  const { data: presets } = useQuery(['/program/preset', { programId: lessonId }], () => getProgramTitlePresets(lessonId!), {
    enabled: !!lessonId,
  });
  const onSubmit = async () => {
    const param = {
      ...body,
      lessonId,
      timeRanges: timeList,
    };

    if (!param?.startDate) {
      emptyCheck('기간을 입력해주세요.');
      return;
    }
    if (!param?.endDate) {
      emptyCheck('기간을 입력해주세요.');
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
    setMultiPlan(param)
      .then(() => {
        setNotiMessage('등록 되었습니다.');
      })
      .catch((message) => {
        setNotiMessage(message || '등록에 실패하였습니다.');
      })
      .finally(() => {
        refetch();
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

  // Loading Check
  const isAllLoading = isLoading;

  const renderButtons = () => {
    const btn = [];

    btn.push(
      <Button
        key="cancel-btn"
        style={{ width: '70px', marginRight: '5px' }}
        onClick={onClose}
        disabled={isAllLoading}
        loading={isAllLoading}
      >
        취소
      </Button>,
      <Button key="add-btn" type="primary" style={{ width: '70px' }} onClick={onSubmit} disabled={isAllLoading} loading={isAllLoading}>
        등록
      </Button>,
    );

    return btn;
  };

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title="일정 반복 등록"
      extra={renderButtons()}
      subTitle={body?.id}
      notiMessage={notiMessage}
    >
      <DataDetailItem label="기간" point span={2}>
        <Flex flexDirection="column" gap="5px">
          <DatePicker.RangePicker
            locale={locale}
            disabledDate={disabledDate}
            disabled={isAllLoading}
            style={{ width: '100%' }}
            format={dateFormat}
            value={[body?.startDate ? dayjs(body?.startDate, dateFormat) : '', body?.endDate ? dayjs(body?.endDate, dateFormat) : '']}
            onChange={(e, dateString) => {
              const start = dateString?.[0];
              const end = dateString?.[1];

              onChangeInputValue('startDate', start);
              onChangeInputValue('endDate', end);
            }}
          />

          <Typography.Text style={{ fontSize: '12px' }} type="secondary">
            기간은 최대 3개월을 초과할 수 없습니다.
          </Typography.Text>
        </Flex>
      </DataDetailItem>

      <DataDetailItem label="반복 요일" point span={2}>
        <Flex flexDirection="column" gap="5px">
          <Space wrap>
            {WEEK.map((item) => (
              <Button
                key={item?.value}
                type={body?.days?.includes(item?.value) ? 'primary' : 'default'}
                disabled={isAllLoading}
                onClick={() => onClickDays(item?.value)}
              >
                {item?.label}
              </Button>
            ))}
          </Space>

          <Typography.Text style={{ fontSize: '12px' }} type="secondary">
            하나 이상의 운영요일이 선택되어야 합니다.
          </Typography.Text>
        </Flex>
      </DataDetailItem>

      <DataDetailItem label="회차 시간" point span={2}>
        <Flex flexDirection="column" gap="5px">
          {timeList &&
            timeList?.length > 0 &&
            timeList?.map((item, index) => (
              <TimeCheck
                key={index}
                value={item}
                instructor={instructor}
                isDelete={index > 0}
                onChange={(type, e) => onChangeTimeItem(index, type, e)}
                onDelete={() => onClickDeleteTime(index)}
                disabled={isAllLoading}
              />
            ))}

          <Button style={{ width: '90px' }} type="primary" size="small" disabled={isAllLoading} onClick={onClickAddTime}>
            시간대 추가
          </Button>
        </Flex>
      </DataDetailItem>

      <DataDetailItem label="(선택) 회차명" span={2}>
        <Flex flexDirection="column" gap="5px">
          <Select
            placeholder="(선택) 회차명을 선택해주세요."
            style={{ width: '100%' }}
            disabled={isAllLoading}
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
          disabled={isAllLoading}
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
          disabled={isAllLoading}
        />
      </DataDetailItem>

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

      <DataDetailItem span={2} />

      <DataDetailItem label="옵션여부" span={2}>
        <Switch style={{ width: '50px' }} checked={isOption} onChange={onChangeOption} disabled={isAllLoading} />
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

const TimeCheck = ({ value, instructor, isDelete, onChange, onDelete, disabled }) => {
  const timeFormat = 'HH:mm';

  return (
    <Flex gap="10px">
      <TimePicker.RangePicker
        hourStep={1}
        minuteStep={5}
        secondStep={10}
        format={timeFormat}
        disabled={disabled}
        value={[value?.startTime ? dayjs(value?.startTime, timeFormat) : '', value?.endTime ? dayjs(value?.endTime, timeFormat) : '']}
        onChange={(e, dateString) => {
          const startTime = dateString?.[0];
          const endTime = dateString?.[1];

          onChange('time', `${startTime}T${endTime}`);
        }}
      />

      <Select
        showSearch
        placeholder="강사를 선택해주세요."
        optionFilterProp="children"
        value={value?.instructor}
        onChange={(e) => onChange('instructor', e)}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        disabled={disabled}
        options={instructor}
      />

      {isDelete && (
        <Button onClick={onDelete} disabled={disabled}>
          삭제
        </Button>
      )}
    </Flex>
  );
};

export default ProductPlanMultiDetail;
