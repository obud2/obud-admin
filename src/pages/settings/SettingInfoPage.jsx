import React, { useEffect, useState } from "react";

import DataTableHeader from "../../components/dataTable/DataTableHeader";

import { Descriptions, Input } from "antd";
import { SDataDetailBody } from "../../components/detailTable/DataDetailBody.styled.tsx";
import InfoService from "../../services/InfoService";
import { setCreatedAt } from "../../constants/config";

const SettingInfoPage = () => {
  const [body, setBody] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");

  useEffect(() => {
    if (notiMessage) {
      setTimeout(() => {
        setNotiMessage("");
      }, [2000]);
    }
  }, [notiMessage]);

  useEffect(() => {
    setIsLoading(true);
    InfoService.info("info").then((res) => {
      setBody(res);
      setIsLoading(false);
    });
  }, []);

  const onChangeInputBody = (e) => {
    const { name, value } = e.target;

    setBody((prev) => ({ ...prev, [name]: value }));
  };

  const onClickSubmit = () => {
    setIsLoading(true);

    InfoService.saveItem("edit", body)
      .then(() => {
        setNotiMessage("수정 되었습니다.");
      })
      .catch(() => {
        setNotiMessage("에러가 발생하였습니다. 잠시 후 다시시도해주세요.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <React.Fragment>
      <DataTableHeader
        title="기본정보"
        resister={{ text: "저장", onClick: onClickSubmit }}
        notiMessage={notiMessage}
        isLoading={isLoading}
      />

      <SDataDetailBody padding>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="상호명" span={2}>
            <Input
              name="companyName"
              value={body?.companyName}
              onChange={onChangeInputBody}
              disabled={isLoading}
            />
          </Descriptions.Item>

          <Descriptions.Item label="대표이사" span={2}>
            <Input
              name="ceo"
              value={body?.ceo}
              onChange={onChangeInputBody}
              disabled={isLoading}
            />
          </Descriptions.Item>

          <Descriptions.Item label="연락처" span={2}>
            <Input
              name="contact"
              value={body?.contact}
              onChange={onChangeInputBody}
              disabled={isLoading}
            />
          </Descriptions.Item>

          <Descriptions.Item label="입점 및 제휴 문의" span={2}>
            <Input
              name="email"
              value={body?.email}
              onChange={onChangeInputBody}
              disabled={isLoading}
            />
          </Descriptions.Item>

          <Descriptions.Item label="주소" span={2}>
            <Input
              name="address"
              value={body?.address}
              onChange={onChangeInputBody}
              disabled={isLoading}
            />
          </Descriptions.Item>

          <Descriptions.Item label="개인정보책임자" span={2}>
            <Input
              name="informationManager"
              value={body?.informationManager}
              onChange={onChangeInputBody}
              disabled={isLoading}
            />
          </Descriptions.Item>

          <Descriptions.Item label="사업자등록번호" span={2}>
            <Input
              name="companyRegistrationNumber"
              value={body?.companyRegistrationNumber}
              onChange={onChangeInputBody}
              disabled={isLoading}
            />
          </Descriptions.Item>

          <Descriptions.Item label="통신판매업신고번호" span={2}>
            <Input
              name="telecommunicationNumber"
              value={body?.telecommunicationNumber}
              onChange={onChangeInputBody}
              disabled={isLoading}
            />
          </Descriptions.Item>

          <Descriptions.Item label="마지막 수정일" span={2}>
            <Input
              name="telecommunicationNumber"
              value={setCreatedAt(body?.updatedAt || "", "-")}
              onChange={onChangeInputBody}
              disabled
            />
          </Descriptions.Item>
        </Descriptions>
      </SDataDetailBody>
    </React.Fragment>
  );
};

export default SettingInfoPage;
