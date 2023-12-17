import React, { useEffect, useState } from "react";
import { Descriptions, Table } from "antd";
import { Content } from "antd/es/layout/layout";
import moment from "moment";
import { ALLTALK_GROUP } from "../../constants";
import PortalService from "../../services/PortalService";
import DataTableHeader from "../../components/dataTable/DataTableHeader";
import { SDataDetailBody } from "../../components/detailTable/DataDetailBody.styled.tsx";

const SendResult = () => {
  const [data, setData] = useState([]);
  const [groupInfo, setGroupInfo] = useState({});

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    PortalService.getGroupInfo(ALLTALK_GROUP).then((groupRes) => {
      setGroupInfo(groupRes);
    });
    PortalService.getSendList(ALLTALK_GROUP).then((result) => {
      setData(result.list);
    });
  };

  const columns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: "그룹ID",
      dataIndex: "groupId",
      key: "groupId",
    },
    {
      title: "메시지타입",
      dataIndex: "type",
      key: "type",
      render: (val) => {
        let label = "";
        if (val === "at") label = "알림톡";
        if (val === "ft") label = "친구톡";
        if (val === "sms") label = "SMS";
        if (val === "lms") label = "LMS";
        return label;
      },
    },
    {
      title: "전송결과",
      dataIndex: "result",
      key: "result",
    },
    {
      title: "수신번호",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "전송일시",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val) => {
        return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "-";
      },
    },
  ];

  return (
    <React.Fragment>
      <DataTableHeader title="전송결과" />
      <Descriptions size="small" column={1}>
        <Descriptions.Item label="">
          최근 30일동안 전송된 메시지를 확인할 수 있습니다.
        </Descriptions.Item>
        <Descriptions.Item label="">
          전송결과 완료 후 메시지 전송 실패건은 사용한 충전금/포인트가
          재충전됩니다.
        </Descriptions.Item>
        <Descriptions.Item label="">
          문자메시지는 최대 72시간, 카카오톡 메시지는 최대 24시간까진 진행중일수
          있습니다.
        </Descriptions.Item>
      </Descriptions>
      <SDataDetailBody padding>
        <Table dataSource={data} columns={columns} />
      </SDataDetailBody>
    </React.Fragment>
  );
};

export default SendResult;
