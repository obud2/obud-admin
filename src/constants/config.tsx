import dayjs from 'dayjs';
import { User } from '@/entities/user';

/**
 * 프로젝트 이름
 * 각 영역별로 이름 바뀜.
 */
export const PROJECT_NAME = 'Obud';
export const APP_PREFIX = 'Obud';

export const ALLTALK_GROUP = 'G1000000007';
export const ALLTALK_CHANNEL = 'obud';
export const ALLTALK_API_KEY = 'b3e06d45-35a4-4d31-ad41-4feab973d050';

export const API_URL = 'https://api.obud.co';
export const APP_URL = 'https://www.obud.co';

export const S3_BUCKET = 'file.obud.site';
export const BASE_IMG_URL = `https://s3.ap-northeast-2.amazonaws.com/${S3_BUCKET}/`;

// 로그인 쿠키 옵션
export const COOKIE_OPTION = {
  path: '/',
};

/**
 * GR0100 : 어드민 ( 모든 권한 )
 * GR0110 : 스튜디오 ( 공간 관리 )
 * GR0120 : 강사 ( 클래스 관리 )
 * GR0200 : 사용자
 */
export const ADMIN = 'GR0100';
export const STUDIO = 'GR0110';
export const INSTRUCTOR = 'GR0120';
export const USR = 'GR0200';

export const isAdminUser = (user: User): boolean => user.group === ADMIN;
export const isPlaceManager = (user: User): boolean => user.group === STUDIO;

export const USER_ROLE = [
  { value: INSTRUCTOR, label: '강사' },
  { value: STUDIO, label: '스튜디오 관리자' },
  { value: USR, label: '기본회원' },
  { value: ADMIN, label: '총 관리자' },
];

// CANCEL = 'CANCEL',         취소됨
// COMPLETE = 'COMPLETE',     결제 완료
// FAIL = 'FAIL',             결제 실패
// WAIT = 'WAIT',             결제 대기줌
// CANCELING = 'CANCELING',   결제 취소 요청

/**
 * 로그인 쿠키 아이디
 * 약자 ID_JTW = 토큰 값
 * 약자 ID_SES = 로그인 아이디
 * 약자 LSID_KEYWORD = 최근검색어
 */
const TOKEN = 'ADMIN_ID_JWT';
const USER_SESSION = 'ADMIN_ID_SES';

/**
 *
 * @returns 로그인 유저 토큰
 */
export const getJwt = () => {
  return sessionStorage.getItem(TOKEN) || '';
};

export const setJwt = (token: string) => {
  return sessionStorage.setItem(TOKEN, token);
};

/**
 *
 * @returns 로그인 유저 아이디
 */
export const getUserId = () => {
  return sessionStorage.getItem(USER_SESSION) || '';
};

export const setUserId = (user: any) => {
  return sessionStorage.setItem(USER_SESSION, user);
};

/**
 *
 * @returns 로그인 체크
 */
export const loginCheck = () => {
  return !!(getJwt() && getUserId());
};

/**
 *
 * @returns 스토리지 전부 삭제
 */
export const removeStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
};

/**
 *
 * @returns 로그아웃
 */
export const userLogout = () => {
  removeStorage();
};

/**
 *
 * @param {Number} createdAt
 * @param {String} format 변환되는 스트링 값
 * ex) format = . (yyyy.mm.dd)
 * ex) format = - (yyyy-mm-dd)
 *
 * @returns Format(yyyy.mm.dd)
 */
export const setCreatedAt = (createdAt: number | string, format: number | string) => {
  if (!createdAt) return '-';
  if (!isNaN(Number(createdAt)) && !(Number(createdAt) > 0)) return '-';

  const dt = dayjs(new Date(!isNaN(Number(createdAt)) ? Number(createdAt) : createdAt))
    .add(9, 'hour')
    .toDate();
  const addDt = `${
    dt.getFullYear() +
    format.toString() +
    `00${(dt.getMonth() + 1).toString()}`.slice(-2) +
    format +
    `00${dt.getDate().toString()}`.slice(-2)
  } ${`00${dt.getHours().toString()}`.slice(-2)}:${`00${dt.getMinutes().toString()}`.slice(-2)}`;

  return addDt;
};

/**
 *
 * @param {boolean} toggle
 * 스크롤 못하게 잠금.
 */
export const bodyHiddenToggle = (toggle: boolean) => {
  const body = document.querySelector('body');

  if (!body) return;

  if (toggle) {
    body.classList.add('hidden');
  } else {
    body.classList.remove('hidden');
  }
};

export const textSilce = (title: string | any[], silce: number) => {
  if (!title) return;
  return title.length > silce ? `${title.slice(0, silce)}...` : title;
};

export const addComma = (num = 0) => {
  const regexp = /\B(?=(\d{3})+(?!\d))/g;
  return num.toString().replace(regexp, ',');
};

export const payStatus = (orderStatus: any) => {
  let temp = '';

  switch (orderStatus) {
    case 'CANCEL':
      temp = '취소완료';
      break;
    case 'COMPLETE':
      temp = '결제 완료';
      break;
    case 'FAIL':
      temp = '결제 실패';
      break;
    case 'WAIT':
      temp = '결제 대기중';
      break;
    case 'REFUSAL':
      temp = '취소 거절';
      break;
    case 'CANCELING':
      temp = '취소처리중';
      break;
  }

  return temp;
};
