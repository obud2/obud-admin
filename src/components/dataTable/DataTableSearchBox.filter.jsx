export const SEARCH_FILTER = [
  {
    value: 'title',
    label: '제목',
    placeholder: '제목을 입력해주세요.',
    maxLength: 10,
  },
  {
    value: 'category',
    label: '구분',
    placeholder: '구분값을 입력해주세요.',
    maxLength: 10,
  },
  {
    value: 'isShow',
    label: '공개여부',
    placeholder: '공개 / 비공개 입력해주세요.',
    maxLength: 3,
  },
  {
    value: 'createdAt',
    label: '등록일시',
    placeholder: '달력 버튼을 통하여 날짜를 입력해주세요.',
    maxLength: 8,
    date: true,
  },
];
