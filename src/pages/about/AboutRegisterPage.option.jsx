import { setCreatedAt } from '../../constants/config';

export const LIST_HEADER = [
  { id: 'placeTitle', label: '장소 이름' },
  { id: 'sns', label: '인스타그램 아이디' },
  { id: 'email', label: '이메일' },
  { id: 'representative', label: '담당자 이름 / 직함' },
  { id: 'phone', label: '연락처' },
  {
    id: 'process',
    label: '문의처리',
    customBodyRender: (value) => {
      if (value === 'wait') return '대기중';
      if (value === 'confirm') return '확인';
      if (value === 'cancel') return '취소';
    },
  },
  {
    id: 'createdAt',
    label: '등록일시',
    customBodyRender: (value) => {
      return setCreatedAt(value, '-');
    },
  },
];

export const EXEL_HEADER = [
  { id: 'placeTitle', label: '장소 이름' },
  { id: 'sns', label: '인스타그램 아이디' },
  { id: 'email', label: '이메일' },
  { id: 'representative', label: '담당자 이름 / 직함' },
  { id: 'phone', label: '연락처' },
  {
    id: 'process',
    label: '문의처리',
    customBodyRender: (value) => {
      if (value === 'wait') return '대기중';
      if (value === 'confirm') return '확인';
      if (value === 'cancel') return '취소';
    },
  },
  {
    id: 'createdAt',
    label: '등록일시',
    customBodyRender: (value) => {
      return setCreatedAt(value, '-');
    },
  },
];

export const FILTER = [
  { id: '', label: '전체' },
  { id: 'wait', label: '대기중' },
  { id: 'confirm', label: '확인' },
  { id: 'cancel', label: '취소' },
];
