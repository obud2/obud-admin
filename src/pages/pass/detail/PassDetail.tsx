import DataDetailBody, { DataDetailItem } from '@/components/detailTable/DataDetailBody';
import { Pass } from '@/entities/pass';
import { Place } from '@/entities/place';
import { CreatePassRequest, PassService } from '@/services/PassService';
import { Button, Checkbox, Input, InputNumber, Radio, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import swal from 'sweetalert';

const initialBody: CreatePassRequest = {
  title: '',
  placeId: '',
  isShow: true,
  durationInDays: 30,
  price: 0,
  maxReservations: 1,
  maxCancels: 1,
  minCancelWindowHour: 0,
  minCancelWindowMinute: 0,
  notice: '',
  refundPolicy: '',
};

type Props = {
  currentPlace?: Place;
  pass: Pass | null;
  open: boolean;
  onClose: () => void;
};

const DEFAULT_DURATION = [30, 60, 90];

const PassDetail = ({ currentPlace, pass, open, onClose }: Props) => {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState('');
  const [body, setBody] = useState<CreatePassRequest>(initialBody);
  const [maxDays, setMaxDays] = useState<number>(1);

  const [noLimitReservations, setNoLimitReservations] = useState<boolean>(false);
  const [noLimitCancels, setNoLimitCancels] = useState<boolean>(false);

  useEffect(() => {
    if (pass && open) {
      setBody({
        title: pass.title,
        placeId: pass.placeId,
        isShow: pass.isShow,
        durationInDays: pass.durationInDays,
        price: pass.price,
        maxReservations: pass.maxReservations,
        maxCancels: pass.maxCancels,
        minCancelWindowHour: pass.minCancelWindowHour,
        minCancelWindowMinute: pass.minCancelWindowMinute,
        notice: pass.notice,
        refundPolicy: pass.refundPolicy,
      });
      if (!DEFAULT_DURATION.includes(pass.durationInDays)) setMaxDays(pass.durationInDays);
      setNoLimitReservations(pass.maxReservations === null);
      setNoLimitCancels(pass.maxCancels === null);
    }
  }, [pass, open, setNoLimitCancels, setNoLimitReservations]);

  const isActive = body.title && body.durationInDays;

  const onChangeInputValue = (key: keyof Pass, value: Pass[keyof Pass]) => {
    setBody((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    setBody(initialBody);
    setNotiMessage('');
    setMaxDays(1);
    setNoLimitCancels(false);
    setNoLimitReservations(false);

    onClose();
  };

  const onSubmit = () => {
    const text = pass ? '수정' : '등록';
    const param = body;

    if (!param?.title) {
      emptyCheck('패스 이름을 입력해주세요.');
      return;
    }

    if (!currentPlace?.id) {
      emptyCheck('장소를 선택해주세요.');
      return;
    }

    setIsLoading(true);
    if (pass) {
      PassService.updatePass({
        ...param,
        id: pass.id,
        placeId: currentPlace?.id || '',
      })
        .then(() => {
          setNotiMessage(`패스 ${text} 되었습니다.`);
          setIsLoading(false);
          queryClient.invalidateQueries();
          handleClose();
        })
        .catch(() => {
          setNotiMessage('에러가 발생하였습니다. 잠시 후 다시시도해주세요.');
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      PassService.createPass({
        ...param,
        placeId: currentPlace?.id || '',
      })
        .then(() => {
          setNotiMessage(`패스 ${text} 되었습니다.`);
          setIsLoading(false);
          queryClient.invalidateQueries();
          handleClose();
        })
        .catch(() => {
          setNotiMessage('에러가 발생하였습니다. 잠시 후 다시시도해주세요.');
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const emptyCheck = (text: string) => swal({ title: '', text, icon: 'warning' });

  const renderButtons = () => {
    return [
      <Button key="cancel-btn" style={{ width: '70px', marginRight: '5px' }} onClick={handleClose}>
        취소
      </Button>,
      <Button key="add-btn" type="primary" style={{ width: '70px' }} disabled={!isActive} onClick={onSubmit}>
        {pass ? '수정' : '등록'}
      </Button>,
    ];
  };

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title={`패스 ${pass ? '수정' : '등록'}`}
      extra={renderButtons()}
      isLoading={isLoading}
      notiMessage={notiMessage}
    >
      <DataDetailItem label="게시여부" span={2} point>
        <Switch style={{ width: '50px' }} checked={body?.isShow || false} onChange={(e) => onChangeInputValue('isShow', e)} />
      </DataDetailItem>
      <DataDetailItem label="패스 이름" span={2} point>
        <Input
          placeholder="요가 클래스 1달권(8회)"
          value={body.title}
          onChange={(e) => onChangeInputValue('title', e.target.value)}
          disabled={isLoading}
        />
      </DataDetailItem>
      <DataDetailItem label="기간" span={2} point>
        <Radio.Group value={body.durationInDays} onChange={(e) => onChangeInputValue('durationInDays', e.target.value)}>
          {DEFAULT_DURATION.map((day) => (
            <Radio key={day} value={day}>
              {Math.floor(day / 30)}개월 ({day}일)
            </Radio>
          ))}
          <Radio value={maxDays}>
            직접 입력
            <InputNumber
              size="small"
              style={{ width: '100px', height: '20px', marginLeft: '4px' }}
              value={maxDays}
              onChange={(e) => e && e > 0 && setMaxDays(e)}
              addonAfter="일"
              min={1}
              max={180}
              disabled={isLoading}
            />
          </Radio>
        </Radio.Group>
      </DataDetailItem>
      <DataDetailItem label="판매가" span={2} point>
        <InputNumber
          style={{ width: '100%', marginLeft: '4px' }}
          value={body.price}
          onChange={(e) => e && e >= 0 && onChangeInputValue('price', e)}
          placeholder="판매 금액을 입력하세요."
          addonAfter="원"
          min={0}
          disabled={isLoading}
        />
      </DataDetailItem>
      <DataDetailItem label="총 예약 횟수" span={2} point>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputNumber
            style={{ width: '100px', marginLeft: '4px' }}
            value={body.maxReservations}
            onChange={(e) => e && e > 0 && onChangeInputValue('maxReservations', e)}
            min={1}
            addonAfter="회"
            disabled={isLoading || noLimitReservations}
          />
          <Checkbox
            style={{ marginLeft: '12px' }}
            checked={noLimitReservations}
            onChange={(e) => {
              setNoLimitReservations(e.target.checked);
              if (e.target.checked) onChangeInputValue('maxReservations', null);
            }}
            disabled={isLoading}
          >
            제한 없음
          </Checkbox>
        </div>
      </DataDetailItem>
      <DataDetailItem label="총 취소가능 횟수" span={2} point>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputNumber
            style={{ width: '100px', marginLeft: '4px' }}
            value={body.maxCancels}
            onChange={(e) => e !== null && e >= 0 && onChangeInputValue('maxCancels', e)}
            min={0}
            addonAfter="회"
            disabled={isLoading || noLimitCancels}
          />
          <Checkbox
            style={{ marginLeft: '12px' }}
            checked={noLimitCancels}
            onChange={(e) => {
              setNoLimitCancels(e.target.checked);
              if (e.target.checked) onChangeInputValue('maxCancels', null);
            }}
            disabled={isLoading}
          >
            제한 없음
          </Checkbox>
        </div>
      </DataDetailItem>
      <DataDetailItem label="유의 사항" span={2}>
        <TextArea value={body.notice} onChange={(e) => e && onChangeInputValue('notice', e.target.value)} rows={10} showCount />
      </DataDetailItem>
      <DataDetailItem label="예약 취소 기간 설정" span={2}>
        <div style={{ color: '#1D64D0', marginBottom: '10px', fontSize: '10px' }}>
          패스로 예약 시, 예약 취소 가능한 시간을 설정해주세요. (해당 기간 동안 취소 시 예약 횟수 차감이 되지 않습니다.) 0으로 입력 시 수업
          시작 직전까지 취소가 가능합니다.
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '14px' }}>수업 시간 </span>
          <InputNumber
            size="small"
            min={0}
            style={{ width: '120px', marginLeft: '4px' }}
            value={body.minCancelWindowHour}
            onChange={(e) => e !== null && e >= 0 && onChangeInputValue('minCancelWindowHour', e)}
            addonAfter="시간"
            disabled={isLoading}
          />
          <InputNumber
            size="small"
            min={0}
            max={59}
            style={{ width: '120px', marginLeft: '4px' }}
            value={body.minCancelWindowMinute}
            onChange={(e) => e !== null && e >= 0 && onChangeInputValue('minCancelWindowMinute', e)}
            addonAfter="분"
            disabled={isLoading}
          />
          <span style={{ fontSize: '14px', marginLeft: '4px' }}>전 까지 가능</span>
        </div>
      </DataDetailItem>
      <DataDetailItem label="환불 규정" span={2}>
        <TextArea value={body.refundPolicy} onChange={(e) => e && onChangeInputValue('refundPolicy', e.target.value)} rows={10} showCount />
      </DataDetailItem>
    </DataDetailBody>
  );
};

export default PassDetail;
