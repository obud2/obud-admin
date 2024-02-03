import { USR, INSTRUCTOR, ADMIN, STUDIO, setCreatedAt, USER_ROLE, textSilce } from '../../constants/config';

export const LIST_HEADER = [
  { id: 'name', label: '이름' },
  {
    id: 'email',
    label: '이메일',
    customBodyRender: (value, data) => {
      let sns = '';

      if (data?.kakao) sns = '카카오';
      else if (data?.naver) sns = '네이버';
      else if (data?.google) sns = '구글';
      else if (data?.apple) sns = '애플';

      return `${textSilce(value, 20)} ${sns ? `(${sns})` : ''}`;
    },
  },
  {
    id: 'group',
    label: '회원유형',
    customBodyRender: (value) => {
      let result = '일반회원';

      USER_ROLE?.map((role) => {
        if (value === role?.value) result = role?.label;
      });

      return result;
    },
  },
  {
    id: 'id',
    label: '거주지역',
    customBodyRender: (_, data) => {
      const addSplit = data?.adr?.split(' ');
      const addr = `${addSplit?.[0] || ''} ${addSplit?.[1] || ''}`;

      return addr || '-';
    },
  },
  {
    id: 'createdAt',
    label: '가입일시',
    customBodyRender: (value) => {
      return setCreatedAt(value, '-');
    },
  },
];

export const EXEL_HEADER = [
  { id: 'name', label: '이름' },
  {
    id: 'email',
    label: '이메일',
    customBodyRender: (value) => {
      return value;
    },
  },
  {
    id: 'gender',
    label: '성별',
    customBodyRender: (value) => {
      return value || '-';
    },
  },
  {
    id: 'hp',
    label: '연락처',
    customBodyRender: (value) => {
      return value || '-';
    },
  },
  {
    id: 'group',
    label: '회원유형',
    customBodyRender: (value) => {
      let result = '일반회원';

      USER_ROLE?.map((role) => {
        if (value === role?.value) result = role?.label;
      });

      return result;
    },
  },
  {
    id: 'id',
    label: '거주지역',
    customBodyRender: (_, data) => {
      const addr = data?.adr;
      const addrDetail = data?.adrDetail;

      return `${addr} ${addrDetail}`;
    },
  },

  {
    id: 'kakao',
    label: '카카오ID',
    customBodyRender: (value) => {
      return value;
    },
  },
  {
    id: 'naver',
    label: '네이버ID',
    customBodyRender: (value) => {
      return value;
    },
  },
  {
    id: 'google',
    label: '구글ID',
    customBodyRender: (value) => {
      return value;
    },
  },
  {
    id: 'createdAt',
    label: '가입일시',
    customBodyRender: (value) => {
      return setCreatedAt(value, '-');
    },
  },
];

export const FILTER = [
  { id: '', label: '전체' },
  { id: USR, label: '일반회원' },
  { id: STUDIO, label: '스튜디오' },
  { id: INSTRUCTOR, label: '강사' },
  { id: ADMIN, label: '관리자' },
];
