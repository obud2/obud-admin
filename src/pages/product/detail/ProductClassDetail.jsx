import React, { useContext, useEffect, useRef, useState } from "react";

import { Button, Radio, Input, Switch } from "antd";
import { UserContext } from "../../../context/UserContext";

import Editor from "../../../components/smartEditor/Editor";

import DataDetailBody, {
  DataDetailItem,
} from "../../../components/detailTable/DataDetailBody";

import { useQuery } from "react-query";
import CodeService from "../../../services/CodeService";
import ProductService from "../../../services/ProductService";

import UploadBtn from "../../../components/common/uploadBtn/UploadBtn";
import FileUpload from "../../../components/fileUpload/FileUpload";
import swal from "sweetalert";

/**
 *
 * @param {*} id : 상품 등록 ID 값 new
 * @returns
 */

const ProductClassDetail = ({ open, onClose, id, studiosId, refresh }) => {
  const defaultBody = { lessonType: "Regular" };

  const fileRef = useRef();
  const contentsRef = useRef("");

  /**
   *
   * @returns 공간 - 이용안내 / 환불규정 / 고객센터 값 호출
   */
  const fetchData = async () => {
    const res = await Promise.all([
      CodeService.getItem("product-shell-setting"),
      CodeService.getItem("product-class-setting"),
    ]);
    const res1 = res[0]?.value || {};
    const res2 = res[1]?.value || {};

    return {
      convenience: res1?.convenience || [],
      information: res1?.information || "",
      refundPolicy: res1?.refundPolicy || "",
      serviceCenter: res1?.serviceCenter || "",
      type: res2?.type || [],
      category: res2?.category || [],
    };
  };

  const { isAdmin } = useContext(UserContext);
  const { data: code, isLoading: isCodeLoading } = useQuery(
    ["product-code"],
    fetchData
  );
  // --------------------------------------------------

  const [body, setBody] = useState(defaultBody);
  const [files, setFiles] = useState([]);

  const [isActive, setIsActive] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");

  useEffect(() => {
    if (id && id !== "new") {
      setIsLoading(true);

      ProductService?.getLesson(id).then((res) => {
        setBody(res);
        setFiles(res?.images);
        setIsLoading(false);
      });
    } else {
      setBody(defaultBody);
      setFiles([]);
    }

    return () => {
      setBody(defaultBody);
      setFiles([]);
    };
  }, [id]);

  /** 등록 / 수정 버튼 활성화 */
  useEffect(() => {
    if (body?.lessonType && body?.title && files?.length > 0) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [body, files]);

  const onChangeInputValue = (type, e) => {
    setBody((prev) => ({ ...prev, [type]: e }));
  };

  const onSubmit = async () => {
    const param = {
      ...body,
      studiosId: studiosId,
      contents: contentsRef.current.getValue(),
    };

    if (!param?.lessonType) {
      emptyCheck("분류를 선택해주세요.");
      return;
    }
    if (!param?.title) {
      emptyCheck("수업명을 입력해주세요.");
      return;
    }

    const text = id === "new" ? "등록" : "수정";
    const files = await fileRef.current.upload("lesson");
    param["images"] = files.images || [];

    setIsLoading(true);
    ProductService?.setLesson(id, param)
      .then(() => {
        setNotiMessage(`${text} 되었습니다.`);
      })
      .catch(() => {
        setNotiMessage("에러가 발생하였습니다. 잠시 후 다시시도해주세요.");
      })
      .finally(() => {
        refresh();
        setIsLoading(false);
      });
  };

  const emptyCheck = (text) => {
    swal({
      title: "",
      text: text,
      icon: "warning",
    });
  };

  const renderButtons = () => {
    return [
      <Button
        key="cancel-btn"
        style={{ width: "70px", marginRight: "5px" }}
        onClick={onClose}
      >
        취소
      </Button>,
      <Button
        key="add-btn"
        type="primary"
        style={{ width: "70px" }}
        disabled={!isActive}
        onClick={onSubmit}
      >
        {id === "new" ? "등록" : "수정"}
      </Button>,
    ];
  };

  const isAllLoading = isLoading || isCodeLoading;

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title={`수업 ${id === "new" ? "등록" : "수정"}`}
      extra={renderButtons()}
      subTitle={body?.id}
      isLoading={isAllLoading}
      notiMessage={notiMessage}
    >
      <DataDetailItem label="게시여부" span={2}>
        <Switch
          style={{ width: "50px" }}
          checked={body?.isShow || false}
          onChange={(e) => onChangeInputValue("isShow", e)}
        />
      </DataDetailItem>

      <DataDetailItem label="분류" span={2} point>
        <Radio.Group
          onChange={(e) => onChangeInputValue("lessonType", e.target.value)}
          value={body?.lessonType || ""}
          disabled={!isAdmin}
        >
          {code &&
            code?.type &&
            code?.type
              ?.filter((a) => a?.isShow)
              ?.map((type) => (
                <Radio key={type?.title} value={type?.title || ""}>
                  {type?.title || ""}
                </Radio>
              ))}
        </Radio.Group>
      </DataDetailItem>

      <DataDetailItem label="수업명" span={2} point>
        <Input
          placeholder="수업명을 입력하세요."
          value={body?.title || ""}
          onChange={(e) => onChangeInputValue("title", e.target.value)}
          disabled={isAllLoading}
        />
      </DataDetailItem>

      <DataDetailItem label="이미지" span={2} point>
        <UploadBtn
          onClick={fileRef}
          helpText="권장 사이즈 : 123*123 / 최대 용량 : 5MB / 최대 개수 : 5개"
        />
        <FileUpload
          ref={fileRef}
          files={files}
          maxCount={5}
          onFileHandler={setFiles}
          folder="class"
        />
      </DataDetailItem>

      <DataDetailItem label="상세정보" span={2}>
        <Editor
          ref={contentsRef}
          value={body?.contents || ""}
          disabled={isAllLoading}
        />
      </DataDetailItem>
    </DataDetailBody>
  );
};

export default ProductClassDetail;
