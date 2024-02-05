import { addComma, payStatus } from '../../constants/config';

import moment from 'moment';
import dayjs from 'dayjs';

export const LIST_HEADER = [
  {
    id: 'orderId',
    label: '주문번호/취소시간',
    customBodyRender: (value, data) => {
      const cancelDate = data?.cancelDate ? dayjs(data.cancelDate).format('YYYY.MM.DD HH:mm') : '';
      return (
        <div>
          <p style={{ fontSize: '11px', fontWeight: 400, color: '#757575' }}>{cancelDate}</p>
          <p style={{ margin: '3px 0 7px' }}>{value || ''}</p>
          <p style={{ fontSize: '13px', fontWeight: 500, color: '#232323' }}>{data?.reservationer || ''}</p>
          <p style={{ fontSize: '13px', fontWeight: 400, color: '#757575' }}>{data?.reservationerHp || ''}</p>
        </div>
      );
    },
  },
  {
    id: 'studiosTitle',
    flex: 2,
    label: '장소/프로그램/시간',
    customBodyRender: (value, data) => {
      const date = moment(data?.startDate)?.format('YYYY.MM.DD');
      const startTime = moment(data?.startDate)?.format('HH:ss');
      const endTime = moment(data?.endDate)?.format('HH:ss');

      return (
        <div>
          <p style={{ fontSize: '11px', fontWeight: 400, color: '#757575' }}>{value}</p>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#232323',
              margin: '1px 0 3px',
            }}
          >
            {data?.lessonTitle}
          </p>

          <p
            style={{
              fontSize: '11px',
              fontWeight: 400,
              color: '#757575',
            }}
          >
            {`${date} :: ${`${startTime}~${endTime}`}`}
          </p>
        </div>
      );
    },
  },
  {
    id: 'price',
    label: '상품/옵션금액',
    flex: 1,
    customBodyRender: (_, data) => {
      const price = data?.price || 0;
      const optionPrice = data?.payOption?.price || 0;

      return (
        <div>
          <div style={{ display: 'flex', fontWeight: 400, color: '#757575' }}>
            <p>상품금액 ::</p>
            <p>&nbsp;{`${addComma(price || 0)}원`}</p>
          </div>

          <div style={{ display: 'flex', fontWeight: 400, color: '#757575' }}>
            <p>옵션금액 ::</p>
            <p>&nbsp;{`${addComma(optionPrice || 0)}원`}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: 'reservationCount',
    label: '인원',
    flex: 0.5,
    customBodyRender: (value) => {
      return <p style={{ color: '#009ef7' }}>{`${addComma(value)}명`}</p>;
    },
  },
  {
    id: 'payOptionCount',
    label: '옵션',
    flex: 0.5,
    customBodyRender: (value) => {
      return <p style={{ color: '#4d7561' }}>{`${addComma(value)}개`}</p>;
    },
  },
  {
    id: 'orderStatus',
    label: '상태/취소시간',
    customBodyRender: (value, data) => {
      const cancelDate = data?.cancelDate ? dayjs(data.cancelDate).format('YYYY.MM.DD HH:mm') : '';
      return (
        <div>
          <p style={{ color: '#f33' }}>{payStatus(value)}</p>
          <p style={{ fontSize: '11px', fontWeight: 400, color: '#757575' }}>{cancelDate}</p>
        </div>
      );
    },
  },
  {
    id: 'amount',
    label: '결제금액',
    customBodyRender: (value) => {
      return `${addComma(value || 0)}원`;
    },
  },
  {
    id: 'cancelAmount',
    label: '환불금액',
    customBodyRender: (value) => {
      return `${addComma(value || 0)}원`;
    },
  },
];

export const EXEL_HEADER = [
  {
    id: 'id',
    label: '주문번호/시각',
    customBodyRender: (value, data) => {
      return `${data?.cancelDate} ${value || ''} ${data?.reservationer || ''} ${data?.reservationerHp || ''}`;
    },
  },
  {
    id: 'studiosTitle',
    flex: 2,
    label: '장소/프로그램/시간',
    customBodyRender: (value, data) => {
      const date = moment(data?.startDate)?.format('YYYY.MM.DD');
      const startTime = moment(data?.startDate)?.format('HH:ss');
      const endTime = moment(data?.endDate)?.format('HH:ss');

      return `${value || ''} ${data?.lessonTitle} ${`${date} :: ${`${startTime}~${endTime}`}`}`;
    },
  },
  {
    id: 'price',
    label: '상품/옵션금액',
    flex: 0.7,
    customBodyRender: (_, data) => {
      const price = data?.price || 0;
      const optionPrice = data?.payOption?.price || 0;

      return `상품금액 :: ${`${addComma(price || 0)}원`} 옵션금액 :: ${`${addComma(optionPrice || 0)}원`}`;
    },
  },
  {
    id: 'reservationCount',
    label: '인원',
    flex: 0.5,
    customBodyRender: (value) => {
      return `${addComma(value)}`;
    },
  },
  {
    id: 'payOptionCount',
    label: '옵션',
    flex: 0.5,
    customBodyRender: (value) => {
      return `${addComma(value)}`;
    },
  },
  {
    id: 'orderStatus',
    label: '상태',
    customBodyRender: (value) => {
      return `${payStatus(value)}`;
    },
  },
  {
    id: 'amount',
    label: '결제금액',
    customBodyRender: (value) => {
      return `${addComma(value || 0)}`;
    },
  },
];

export const FILTER = [
  // { id: 'basic', label: '취소현황' },
  { id: 'canceled', label: '취소완료' },
];
