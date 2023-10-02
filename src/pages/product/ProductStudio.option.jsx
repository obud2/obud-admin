import { Link } from "react-router-dom";

import { setCreatedAt } from "../../constants";

export const LIST_HEADER = [
  {
    id: "title",
    label: "수업명",
    customBodyRender: (value, data) => {
      return (
        <Link
          to={`/pages/product/studio/${data?.studiosId || ""}/${
            data?.id || ""
          }`}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={data?.images[0]?.url || ""}
              style={{ width: 49, height: 49 }}
            />
            {value}
          </div>
        </Link>
      );
    },
  },
  {
    id: "isShow",
    label: "게시여부",
    customBodyRender: (value) => {
      return value ? <p className="point-text">게시중</p> : "숨김";
    },
  },
  {
    id: "createdAt",
    label: "등록일시",
    customBodyRender: (value) => {
      return setCreatedAt(value, "-");
    },
  },
  {
    id: "updatedAt",
    label: "수정일시",
    customBodyRender: (value) => {
      return setCreatedAt(value, "-");
    },
  },
];

export const EXEL_HEADER = [
  { id: "lessonType", label: "분류" },
  {
    id: "title",
    label: "수업명",
  },
  {
    id: "isShow",
    label: "게시여부",
    customBodyRender: (value) => {
      return value ? "게시중" : "숨김";
    },
  },
  {
    id: "createdAt",
    label: "등록일시",
    customBodyRender: (value) => {
      return setCreatedAt(value, "-");
    },
  },
  {
    id: "updatedAt",
    label: "수정일시",
    customBodyRender: (value) => {
      return setCreatedAt(value, "-");
    },
  },
];

export const FILTER = [
  { id: "", label: "전체" },
  { id: "Special", label: "Special" },
  { id: "Regular", label: "Regular" },
];
