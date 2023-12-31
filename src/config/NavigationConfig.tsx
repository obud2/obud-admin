/**
 * Demo : https://mui.com/material-ui/material-icons/
 * 아이콘 전부 소문자로 입력.
 */

import { APP_URL } from "../constants/config";

// 기본 메뉴
export const NavigationConfig = [
  {
    id: "System",
    key: "system",
    type: "group",
    isShow: true,
    children: [
      {
        id: "dashboard",
        key: "dashboard",
        title: "대시보드",
        type: "item",
        iconType: "ant",
        icon: "Appstore",
        url: "/",
        exact: true,
        isShow: true,
      },
      {
        id: "introUser",
        title: "사이트바로가기",
        type: "link",
        icon: "Link",
        url: APP_URL,
        isShow: true,
      },
    ],
  },
];

// 데이터 메뉴
export const NavigationMenu = [
  {
    id: "screen",
    key: "screen",
    iconType: "ant",
    title: "화면관리",
    type: "collapse",
    icon: "Desktop",
    isShow: false,
    children: [
      {
        id: "main-screen",
        key: "main-screen",
        title: "메인화면",
        type: "item",
        url: "/pages/main-setting",
        exact: true,
        isShow: false,
      },
      {
        id: "home-banner-screen",
        key: "home-banner-screen",
        title: "홈 화면 배너",
        type: "item",
        url: "/pages/home-banner-setting",
        exact: true,
        isShow: false,
      },
      {
        id: "home-section-screen",
        key: "home-section-screen",
        title: "홈 화면 섹션",
        type: "item",
        url: "/pages/home-section-setting",
        exact: true,
        isShow: false,
      },
      {
        id: "home-category-screen",
        key: "home-category-screen",
        title: "홈 화면 카테고리",
        type: "item",
        url: "/pages/home-category-setting",
        exact: true,
        isShow: false,
      },
    ],
  },
  {
    id: "order",
    key: "order",
    iconType: "ant",
    title: "예약관리",
    type: "collapse",
    icon: "Profile",
    isShow: false,
    children: [
      {
        id: "order-status",
        key: "order-status",
        title: "예약현황",
        type: "item",
        url: "/pages/order-status",
        exact: true,
        isShow: false,
      },
      {
        id: "order-list",
        key: "order-list",
        title: "예약내역",
        type: "item",
        url: "/pages/order-list",
        exact: true,
        isShow: false,
      },
      {
        id: "order-cancel",
        key: "order-cancel",
        title: "취소내역",
        type: "item",
        url: "/pages/order-cancel",
        exact: true,
        isShow: false,
      },
      {
        id: "order-refusal",
        key: "order-refusal",
        title: "거절내역",
        type: "item",
        url: "/pages/order-refusal",
        exact: true,
        isShow: false,
      },
    ],
  },
  {
    id: "product",
    key: "product",
    iconType: "ant",
    title: "상품관리",
    type: "collapse",
    icon: "Shopping",
    isShow: false,
    children: [
      {
        id: "product-list",
        key: "product-list",
        title: "공간 별 수업목록",
        type: "item",
        url: "/pages/product",
        exact: true,
        isShow: false,
      },
      {
        id: "special-list",
        key: "special-list",
        title: "Special",
        type: "item",
        url: "/pages/special",
        exact: true,
        isShow: false,
      },
    ],
  },
  {
    id: "coupon",
    key: "coupon",
    iconType: "ant",
    title: "쿠폰관리",
    type: "item",
    url: "/pages/coupon/list",
    icon: "CreditCard",
    isShow: false,
  },
  {
    id: "about",
    key: "about",
    title: "문의관리",
    type: "collapse",
    iconType: "ant",
    icon: "Build",
    isShow: false,
    children: [
      {
        id: "class",
        key: "class",
        title: "클래스문의",
        type: "item",
        url: "/pages/about-class",
        exact: true,
        isShow: false,
      },
      {
        id: "register",
        key: "register",
        title: "입점 문의",
        type: "item",
        url: "/pages/about-register",
        exact: true,
        isShow: false,
      },
    ],
  },
  {
    id: "users",
    key: "users",
    iconType: "ant",
    title: "회원관리",
    type: "item",
    url: "/pages/user/list",
    icon: "Team",
    isShow: false,
  },
  {
    id: "setting",
    key: "setting",
    title: "설정",
    type: "collapse",
    iconType: "ant",
    icon: "Setting",
    isShow: false,
    children: [
      {
        id: "info",
        key: "info",
        title: "기본정보",
        type: "item",
        url: "/pages/info",
        exact: true,
        isShow: false,
      },
      {
        id: "terms",
        key: "terms",
        title: "약관관리",
        type: "item",
        url: "/pages/policy",
        exact: true,
        isShow: false,
      },
      {
        id: "code",
        key: "code",
        title: "상품 환경설정",
        type: "item",
        url: "/pages/code",
        exact: true,
        isShow: false,
      },
      {
        id: "auth",
        key: "auth",
        title: "권한",
        type: "item",
        url: "/pages/auth",
        exact: true,
        isShow: false,
      },
    ],
  },
  {
    id: "alltalk",
    key: "alltalk",
    title: "AllTalk",
    type: "collapse",
    icon: "Message",
    iconType: "ant",
    isShow: true,
    children: [
      {
        id: "group-info",
        key: "group-info",
        title: "계약정보",
        type: "item",
        url: "/pages/groupInfo",
        exact: true,
      },
      {
        id: "alimTalk",
        key: "alimTalk",
        title: "알림톡 전송",
        type: "item",
        url: "/pages/alimTalk",
        exact: true,
      },
      {
        id: "template-list",
        key: "template-list",
        title: "템플릿 리스트",
        type: "item",
        url: "/pages/template",
        exact: true,
      },
      {
        id: "send-list",
        key: "send-list",
        title: "발송내역",
        type: "item",
        url: "/pages/send",
        exact: true,
      },
    ],
  },
];
