import { setCreatedAt } from "../../constants/config";

export const LIST_HEADER = [
  { id: "name", label: "이름" },
  { id: "hp", label: "연락처" },
  { id: "region", label: "희망(거주)지역" },
  { id: "career", label: "경력" },
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
  { id: "hp", label: "연락처" },
  { id: "sns", label: "SNS" },
  { id: "region", label: "희망(거주)지역" },
  { id: "career", label: "수업경력" },
  { id: "yogaStyle", label: "가능 요가수업" },
  { id: "classStyle", label: "추가 가능컨텐츠" },
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
