import React, { useEffect, useState } from "react";

import { Button, Input, Select, Typography } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

import { setCreatedAt } from "../../constants/config";
import AboutService from "../../services/AboutService";

import DataDetailBody, {
  DataDetailItem,
} from "../../components/detailTable/DataDetailBody";

const AboutClassDetail = ({ open, onClose, id, refresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [body, setBody] = useState({});

  const [notiMessage, setNotiMessage] = useState("");

  useEffect(() => {
    if (notiMessage) {
      setTimeout(() => {
        setNotiMessage("");
      }, [2000]);
    }
  }, [notiMessage]);

  useEffect(() => {
    if (id && id !== "new") {
      setIsLoading(true);

      AboutService?.info(id).then((res) => {
        setBody(res);
        setIsLoading(false);
      });
    } else {
      setBody({});
    }

    return () => setBody({});
  }, [id]);

  const onChangeBody = (type, e) => {
    setBody((prev) => ({ ...prev, [type]: e }));
  };

  const onSubmit = () => {
    setIsLoading(true);

    AboutService?.saveItem("edit", body)
      .then(() => {
        setNotiMessage("수정 되었습니다.");
      })
      .catch(() => {
        setNotiMessage("에러가 발생하였습니다. 잠시 후 다시시도해주세요.");
      })
      .finally(() => {
        refresh();
      });
  };

  const renderButtons = () => {
    return [
      <Button key="cancel-btn" style={{ marginRight: "5px" }} onClick={onClose}>
        취소
      </Button>,
      <Button
        key="add-btn"
        type="primary"
        style={{ marginRight: "5px" }}
        onClick={onSubmit}
      >
        {id === "new" ? "등록" : "수정"}
      </Button>,
    ];
  };

  // 이력서 다운로드
  const downloadFile = (url, name, date) => {
    fetch(url, { method: "GET" })
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}_이력서_${date}`;
        document.body.appendChild(a);
        a.click();
        setTimeout((_) => {
          window.URL.revokeObjectURL(url);
        }, 60000);
        a.remove();
        setOpen(false);
      })
      .catch((err) => {
        console.error("err: ", err);
      });
  };

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title={`입점문의 ${id === "new" ? "등록" : "수정"}`}
      extra={renderButtons()}
      subTitle={body?.name}
      isLoading={isLoading}
      notiMessage={notiMessage}
    >
      {/* 유저 정보 */}
      <DataDetailItem span={2}>
        <Typography.Text>
          <UserAddOutlined /> &nbsp; 상세 정보
        </Typography.Text>
      </DataDetailItem>

      <DataDetailItem label="처리 상태" span={2}>
        <Select
          value={body?.process || ""}
          style={{ width: "100%" }}
          onChange={(e) => onChangeBody("process", e)}
          options={[
            { value: "wait", label: "대기중" },
            { value: "cancel", label: "취소" },
            { value: "confirm", label: "확인" },
          ]}
          disabled={isLoading}
        />
      </DataDetailItem>
      <DataDetailItem />

      <DataDetailItem label="이름" span={2}>
        <Input
          value={body?.name || "-"}
          onChange={(e) => onChangeBody("name", e.target.value)}
          readOnly
        />
      </DataDetailItem>

      <DataDetailItem label="연락처" span={2}>
        <Input
          value={body?.phone || "-"}
          placeholder="URL을 입력하세요"
          onChange={(e) => onChangeBody("phone", e.target.value)}
          readOnly
        />
      </DataDetailItem>

      <DataDetailItem label="sns(인스타그램)" span={2}>
        <Input
          value={body?.sns || "-"}
          onChange={(e) => onChangeBody("sns", e.target.value)}
          readOnly
        />
      </DataDetailItem>

      <DataDetailItem label="지역" span={2}>
        <Input
          value={body?.region || "-"}
          onChange={(e) => onChangeBody("region", e.target.value)}
          readOnly
        />
      </DataDetailItem>

      <DataDetailItem label="수업경력" span={2}>
        <Input
          value={body?.career || "-"}
          onChange={(e) => onChangeBody("career", e.target.value)}
          readOnly
        />
      </DataDetailItem>

      <DataDetailItem label="가능 요가수업" span={2}>
        <Input
          value={body?.yogaStyle || "-"}
          onChange={(e) => onChangeBody("yogaStyle", e.target.value)}
          readOnly
        />
      </DataDetailItem>

      <DataDetailItem label="추가 가능컨텐츠" span={2}>
        <Input
          value={body?.classStyle || "-"}
          onChange={(e) => onChangeBody("classStyle", e.target.value)}
          readOnly
        />
      </DataDetailItem>

      <DataDetailItem label="등록 일시" span={2}>
        <Input value={setCreatedAt(body?.createdAt, "-")} readOnly />
      </DataDetailItem>
    </DataDetailBody>
  );
};

export default AboutClassDetail;
