import dayjs from 'dayjs';

export const WEEK = [
  {
    label: '월',
    value: 'mon',
  },
  {
    label: '화',
    value: 'tue',
  },
  {
    label: '수',
    value: 'wed',
  },
  {
    label: '목',
    value: 'thu',
  },
  {
    label: '금',
    value: 'fri',
  },
  {
    label: '토',
    value: 'sat',
  },
  {
    label: '일',
    value: 'sun',
  },
];

export const disabledDate = (current) => {
  const today = current && current < dayjs().subtract(1, 'day').endOf('day');
  const tooLate = current.diff(dayjs(), 'days') >= 90;

  return today || !!tooLate;
};
