import { Button, Switch } from "antd";
import { GoLinkExternal } from "react-icons/go";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { APP_URL, setCreatedAt } from "../../constants";
import ProductService from "../../services/ProductService";

// TODO: Strict Typing
export const LIST_HEADER = [
  {
    id: "title",
    label: "수업명",
    flex: "none",
    width: "300px",
    customBodyRender: (value: any, data: any, onClick: any) => {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => onClick(data)}
          >
            <img
              src={data?.images[0]?.url || ""}
              style={{ width: 49, height: 49, marginRight: "10px" }}
            />
            <span>{value}</span>
          </div>

          <Link target="_blank" to={`${APP_URL}/lesson/${data.id}`}>
            <GoLinkExternal />
          </Link>
        </div>
      );
    },
  },
  {
    id: "isShow",
    label: "게시여부",
    customBodyRender: (value: boolean, data: { id: any }) => {
      const queryClient = useQueryClient();

      // TODO: Improve Logic
      async function updateShow(isShow: boolean) {
        ProductService.getLesson(data.id).then((data) => {
          ProductService.setLesson(data.id, {
            ...data,
            isShow: isShow,
          }).finally(() =>
            queryClient.invalidateQueries(["product-studio-lesson-list"])
          );
        });
      }

      return (
        <Switch
          style={{ width: "50px", margin: "0 4px" }}
          checked={value}
          onChange={(e) => updateShow(e)}
        />
      );
    },
  },
  {
    id: "",
    label: "일정등록",
    customBodyRender: (value: any, data: any) => (
      <Link
        to={`/pages/product/studio/${data?.studiosId || ""}/${data?.id || ""}`}
      >
        <Button type="default">등록</Button>
      </Link>
    ),
  },
  {
    id: "createdAt",
    label: "등록일시",
    customBodyRender: (value: number) => {
      return setCreatedAt(value, "-");
    },
  },
  {
    id: "updatedAt",
    label: "수정일시",
    customBodyRender: (value: number) => {
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
    customBodyRender: (value: any) => {
      return value ? "게시중" : "숨김";
    },
  },
  {
    id: "createdAt",
    label: "등록일시",
    customBodyRender: (value: number) => {
      return setCreatedAt(value, "-");
    },
  },
  {
    id: "updatedAt",
    label: "수정일시",
    customBodyRender: (value: number) => {
      return setCreatedAt(value, "-");
    },
  },
];
