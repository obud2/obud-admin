import { setCreatedAt } from "../../constants/config";

export const LIST_HEADER = [
  { id: "name", label: "이름" },
  // { id: 'email', label: '이메일' },
  { id: "phone", label: "연락처" },
  { id: "region", label: "장소" },
  { id: "num", label: "인원" },
  { id: "date", label: "요청날짜" },
  {
    id: "process",
    label: "문의처리",
    customBodyRender: (value) => {
      if (value === "wait") return "대기중";
      if (value === "confirm") return "확인";
      if (value === "cancel") return "취소";
    },
  },
  {
    id: "createdAt",
    label: "등록일시",
    customBodyRender: (value) => {
      return setCreatedAt(value, "-");
    },
  },
];

export const EXEL_HEADER = [
  { id: "name", label: "이름" },
  { id: "phone", label: "연락처" },
  { id: "region", label: "지역" },
  { id: "num", label: "인원" },
  { id: "date", label: "시간대" },
  { id: "yogaStyle", label: "요가스타일" },
  { id: "classStyle", label: "수업스타일" },
  { id: "etc", label: "기타요청사항" },
  {
    id: "process",
    label: "문의처리",
    customBodyRender: (value) => {
      if (value === "wait") return "대기중";
      if (value === "confirm") return "확인";
      if (value === "cancel") return "취소";
    },
  },
  {
    id: "createdAt",
    label: "등록일시",
    customBodyRender: (value) => {
      return setCreatedAt(value, "-");
    },
  },
];

export const FILTER = [
  { id: "", label: "전체" },
  { id: "wait", label: "대기중" },
  { id: "confirm", label: "확인" },
  { id: "cancel", label: "취소" },
];
