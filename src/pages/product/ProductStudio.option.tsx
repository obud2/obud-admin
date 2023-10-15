import { Switch } from "antd";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { setCreatedAt } from "../../constants";
import ProductService from "../../services/ProductService";

export const LIST_HEADER = [
  {
    id: "title",
    label: "수업명",
    customBodyRender: (value: any, data: any) => {
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
          style={{ width: "50px" }}
          checked={value}
          onChange={(e) => updateShow(e)}
        />
      );
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
