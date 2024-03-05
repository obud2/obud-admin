/**
 * Demo : https://mui.com/material-ui/material-icons/
 * 아이콘 전부 소문자로 입력.
 */

import { APP_URL } from '../constants/config';

// 기본 메뉴
export const getNavigationConfig = (isAdmin: boolean): Menu[] => [
  {
    id: 'System',
    key: 'system',
    title: '',
    type: 'group',
    isShow: true,
    children: [
      ...(isAdmin
        ? [
            {
              id: 'dashboard',
              key: 'dashboard',
              title: '대시보드',
              type: 'item',
              iconType: 'ant',
              icon: 'Appstore',
              url: '/',
              exact: true,
              isShow: true,
            },
          ]
        : []),

      {
        id: 'introUser',
        key: 'introUser',
        title: '사이트바로가기',
        type: 'link',
        icon: 'Link',
        url: APP_URL,
        isShow: true,
      },
    ],
  },
];

type Menu = {
  id: string;
  key: string;
  title: string;
  type: string;
  isShow: boolean;
  iconType?: string;
  icon?: string;
  url?: string;
  exact?: boolean;
  children?: Menu[];
};

// 데이터 메뉴
export const getNavigationMenu = (isAdmin: boolean) => {
  const menu: Menu[] = [];

  if (isAdmin) {
    menu.push({
      id: 'screen',
      key: 'screen',
      iconType: 'ant',
      title: '화면관리',
      type: 'collapse',
      icon: 'Desktop',
      isShow: true,
      children: [
        {
          id: 'main-screen',
          key: 'main-screen',
          title: '메인화면',
          type: 'item',
          url: '/pages/main-setting',
          exact: true,
          isShow: true,
        },
        {
          id: 'home-banner-screen',
          key: 'home-banner-screen',
          title: '홈 화면 배너',
          type: 'item',
          url: '/pages/home-banner-setting',
          exact: true,
          isShow: true,
        },
        {
          id: 'home-section-screen',
          key: 'home-section-screen',
          title: '홈 화면 섹션',
          type: 'item',
          url: '/pages/home-section-setting',
          exact: true,
          isShow: true,
        },
        {
          id: 'home-category-screen',
          key: 'home-category-screen',
          title: '홈 화면 카테고리',
          type: 'item',
          url: '/pages/home-category-setting',
          exact: true,
          isShow: true,
        },
      ],
    });
  }

  menu.push({
    id: 'order',
    key: 'order',
    iconType: 'ant',
    title: '예약관리',
    type: 'collapse',
    icon: 'Profile',
    isShow: true,
    children: [
      {
        id: 'order-status',
        key: 'order-status',
        title: '예약현황',
        type: 'item',
        url: '/pages/order-status',
        exact: true,
        isShow: true,
      },
      {
        id: 'order-list',
        key: 'order-list',
        title: '예약내역',
        type: 'item',
        url: '/pages/order-list',
        exact: true,
        isShow: true,
      },
      {
        id: 'order-cancel',
        key: 'order-cancel',
        title: '취소내역',
        type: 'item',
        url: '/pages/order-cancel',
        exact: true,
        isShow: true,
      },
    ],
  });

  menu.push({
    id: 'place',
    key: 'place',
    iconType: 'ant',
    title: '장소/프로그램 관리',
    type: 'item',
    url: '/pages/places',
    icon: 'Shopping',
    isShow: true,
  });

  if (isAdmin) {
    menu.push({
      id: 'special-programs',
      key: 'special-programs',
      title: '특별 프로그램 관리',
      type: 'item',
      url: '/pages/special',
      icon: 'Gift',
      exact: true,
      isShow: true,
    });
  }

  if (isAdmin) {
    menu.push({
      id: 'pass',
      key: 'pass',
      iconType: 'ant',
      title: '패스관리',
      type: 'collapse',
      icon: 'Idcard',
      isShow: true,
      children: [
        {
          id: 'list',
          key: 'list',
          title: '패스 목록',
          type: 'item',
          url: '/pages/pass-list',
          exact: true,
          isShow: true,
        },
        {
          id: 'member',
          key: 'member',
          title: '패스 회원 관리',
          type: 'item',
          url: '/pages/pass-member',
          exact: true,
          isShow: true,
        },
      ],
    });
  }

  if (isAdmin) {
    menu.push({
      id: 'coupon',
      key: 'coupon',
      iconType: 'ant',
      title: '쿠폰관리',
      type: 'item',
      url: '/pages/coupon/list',
      icon: 'CreditCard',
      isShow: true,
    });
    menu.push({
      id: 'about',
      key: 'about',
      title: '문의관리',
      type: 'collapse',
      iconType: 'ant',
      icon: 'Build',
      isShow: true,
      children: [
        {
          id: 'class',
          key: 'class',
          title: '클래스문의',
          type: 'item',
          url: '/pages/about-class',
          exact: true,
          isShow: true,
        },
        {
          id: 'register',
          key: 'register',
          title: '입점 문의',
          type: 'item',
          url: '/pages/about-register',
          exact: true,
          isShow: true,
        },
      ],
    });
  }

  menu.push({
    id: 'users',
    key: 'users',
    iconType: 'ant',
    title: '회원관리',
    type: 'item',
    url: '/pages/user/list',
    icon: 'Team',
    isShow: true,
  });

  if (isAdmin) {
    menu.push({
      id: 'setting',
      key: 'setting',
      title: '설정',
      type: 'collapse',
      iconType: 'ant',
      icon: 'Setting',
      isShow: true,
      children: [
        {
          id: 'info',
          key: 'info',
          title: '기본정보',
          type: 'item',
          url: '/pages/info',
          exact: true,
          isShow: true,
        },
        {
          id: 'terms',
          key: 'terms',
          title: '약관관리',
          type: 'item',
          url: '/pages/policy',
          exact: true,
          isShow: true,
        },
        {
          id: 'code',
          key: 'code',
          title: '상품 환경설정',
          type: 'item',
          url: '/pages/code',
          exact: true,
          isShow: true,
        },
        {
          id: 'auth',
          key: 'auth',
          title: '권한',
          type: 'item',
          url: '/pages/auth',
          exact: true,
          isShow: true,
        },
      ],
    });
    menu.push({
      id: 'alltalk',
      key: 'alltalk',
      title: 'AllTalk',
      type: 'collapse',
      icon: 'Message',
      iconType: 'ant',
      isShow: true,
      children: [
        {
          id: 'group-info',
          key: 'group-info',
          title: '계약정보',
          type: 'item',
          url: '/pages/groupInfo',
          exact: true,
          isShow: true,
        },
        {
          id: 'alimTalk',
          key: 'alimTalk',
          title: '알림톡 전송',
          type: 'item',
          url: '/pages/alimTalk',
          exact: true,
          isShow: true,
        },
        {
          id: 'template-list',
          key: 'template-list',
          title: '템플릿 리스트',
          type: 'item',
          url: '/pages/template',
          exact: true,
          isShow: true,
        },
        {
          id: 'send-list',
          key: 'send-list',
          title: '발송내역',
          type: 'item',
          url: '/pages/send',
          exact: true,
          isShow: true,
        },
      ],
    });
  }
  return menu;
};
