import React, { useEffect, useState } from "react";
import { Button, Descriptions, Space, Table, Tag } from "antd";
import PortalService from "../../services/PortalService";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DataTableHeader from "../../components/dataTable/DataTableHeader";
import { SDataDetailBody } from "../../components/detailTable/DataDetailBody.styled.tsx";
import { ALLTALK_API_KEY, ALLTALK_CHANNEL } from "../../constants";

const TemplateList = (props) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectChannel, setSelectChannel] = useState("");

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    PortalService.getTemplateList(ALLTALK_CHANNEL).then((result) => {
      setData(result);
    });
  };

  const columns = [
    {
      title: "BizCode",
      dataIndex: "kkoBizCode",
      key: "kkoBizCode",
    },
    {
      title: "템플릿명",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "검수상태",
      dataIndex: "approval",
      key: "approval",
      render: (_) => {
        //N:등록완료, I:검수중, R:부결(반려),
        // Y:검수완료, M:사용요청중, A:승인완료
        const colorSet = {
          N: "green",
          I: "blue",
          R: "red",
          Y: "gold",
          M: "geekblue",
          A: "purple",
        };
        const labelSet = {
          N: "등록완료",
          I: "검수중",
          R: "부결(반려)",
          Y: "검수완료",
          M: "사용요청중",
          A: "승인완료",
        };
        return <Tag color={colorSet[_]}>{labelSet[_]}</Tag>;
      },
    },
    {
      title: "운영이관",
      dataIndex: "id",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.approval === "Y" && (
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={() => requestRelease(record)}
            >
              운영이관
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const requestRelease = (code) => {
    PortalService.requestRelease({
      channelId: ALLTALK_CHANNEL,
      kkoBizCodes: [code.kkoBizCode],
    }).then((result) => {
      getList();
    });
  };

  const onDetail = () => navigate("/pages/template/detail");

  return (
    <React.Fragment>
      <DataTableHeader
        title="알림톡 템플릿 목록"
        resister={{ text: "템플릿 등록", onClick: () => onDetail() }}
      />
      <Descriptions size="small" column={1}>
        <Descriptions.Item label="">
          템플릿 등록 후 심사에 1~3일 소요됩니다.
        </Descriptions.Item>
        <Descriptions.Item label="">
          검수완료 : 검수가 완료된 상태입니다. 실제 사용하시려면
          [운영이관]버튼을 클릭하여 사용요청해주세요.
        </Descriptions.Item>
      </Descriptions>
      <SDataDetailBody padding>
        <Table dataSource={data} columns={columns} />
      </SDataDetailBody>
    </React.Fragment>
  );
};

export default TemplateList;
