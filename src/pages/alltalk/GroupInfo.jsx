import React, { useEffect, useState } from "react";
import { Descriptions, Typography } from "antd";
import { addComma, ALLTALK_GROUP } from "../../constants/config";
import PortalService from "../../services/PortalService";
import DataTableHeader from "../../components/dataTable/DataTableHeader";
import { SDataDetailBody } from "../../components/detailTable/DataDetailBody.styled.tsx";

const { Title } = Typography;
const GroupInfo = () => {
  const [data, setData] = useState([]);
  const [groupInfo, setGroupInfo] = useState({});

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    PortalService.getGroupInfo(ALLTALK_GROUP).then((groupRes) => {
      setGroupInfo(groupRes);
    });
  };

  return (
    <React.Fragment>
      <DataTableHeader title="계약 정보" />
      <SDataDetailBody padding>
        <Title level={5}>충전금 잔액: {addComma(groupInfo?.amount)}</Title>
        <Descriptions
          title="계약 단가"
          size="small"
          bordered
          column={1}
          style={{ width: "30%" }}
        >
          <Descriptions.Item label="알림톡">
            {groupInfo?.price?.at}원
          </Descriptions.Item>
          <Descriptions.Item label="친구톡">
            {groupInfo?.price?.ft_text}원
          </Descriptions.Item>
          <Descriptions.Item label="SMS">
            {groupInfo?.price?.sms}원
          </Descriptions.Item>
          <Descriptions.Item label="LMS">
            {groupInfo?.price?.lms}원
          </Descriptions.Item>
        </Descriptions>
      </SDataDetailBody>
    </React.Fragment>
  );
};

export default GroupInfo;
