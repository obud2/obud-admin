import React, { useContext, useEffect, useState } from "react";

import { LayoutContext } from "../../context/LayoutContext";

import DataTableHeader from "../../components/dataTable/DataTableHeader";

import { Flex, Spacing } from "../../styles/CommonStyles";

import { Card, Input, Typography } from "antd";
import { SDataDetailBody } from "../../components/detailTable/DataDetailBody.styled.tsx";

import { useQuery } from "react-query";
import CodeService from "../../services/CodeService";

import CodeList from "../../components/setting/CodeList";
import CodeDetail from "../../components/setting/CodeDetail";

const SettingCodePage = () => {
  const { matchese } = useContext(LayoutContext);

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

  const { data, refetch, isRefetching } = useQuery(["product-code"], fetchData);

  const [body, setBody] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");

  const [codeBody, setCodeBody] = useState({
    isOpen: false,
    type: "",
    data: "",
  });

  useEffect(() => {
    if (notiMessage) {
      setTimeout(() => {
        setNotiMessage("");
      }, [2000]);
    }
  }, [notiMessage]);

  useEffect(() => {
    setIsLoading(true);

    if (data) {
      setBody(data);
      setIsLoading(false);
    }
  }, [data]);

  const onClickOpenCodeList = (type, data) => {
    if (isLoading) return;
    setCodeBody({ isOpen: true, type: type, data: data || "" });
  };

  const onClickCloseCodeList = () => {
    if (isLoading) return;

    setCodeBody({ isOpen: false, type: "", data: "" });
  };

  const onChangeInputValue = (type, e) => {
    if (isLoading) return;

    setBody((prev) => ({ ...prev, [type]: e }));
  };

  const onClickSubmit = () => {
    if (isLoading) return;

    setIsLoading(true);

    const param1 = {
      id: "product-shell-setting",
      convenience: body?.convenience || [],
      information: body?.information || "",
      refundPolicy: body?.refundPolicy || "",
      serviceCenter: body?.serviceCenter || "",
    };

    const param2 = {
      id: "product-class-setting",
      type: body?.type || [],
      category: body?.category || [],
    };

    Promise.all([
      CodeService.saveItem("edit", param1),
      CodeService.saveItem("edit", param2),
    ])
      .then(() => {
        setNotiMessage("수정 되었습니다.");
      })
      .catch(() => {
        setNotiMessage("에러가 발생하였습니다. 잠시 후 다시시도해주세요.");
      })
      .finally(() => {
        setIsLoading(false);
        refetch();
      });
  };

  const isAllLoading = isLoading || isRefetching;

  return (
    <React.Fragment>
      <DataTableHeader
        title="상품 환경설정"
        resister={{ text: "저장", onClick: onClickSubmit }}
        notiMessage={notiMessage}
        isLoading={isAllLoading}
      />

      <Flex gap="20px" flexDirection={matchese ? "column" : "row"}>
        <SDataDetailBody padding>
          <Typography.Text>장소관리 설정</Typography.Text>
          <Spacing />

          <Card
            type="inner"
            title="편의시설"
            bordered
            extra={
              <CardExtra
                title="추가하기"
                isLoading={isAllLoading}
                onClick={() => onClickOpenCodeList("convenience")}
              />
            }
          >
            <Typography.Text code type="secondary">
              수정 및 삭제를 하여도 해당 카테고리를 등록한 상품에는 수정 및
              삭제가 되지않습니다.
            </Typography.Text>

            <CodeList
              list={body?.convenience || []}
              onClickEdit={onClickOpenCodeList}
              onChange={(e) => onChangeInputValue("convenience", e)}
              isLoading={isAllLoading}
            />
          </Card>
          <Spacing />

          <Card type="inner" title="이용안내" bordered>
            <Typography.Text code type="secondary">
              장소등록 페이지 하단 "이용안내" 폼에 나타나는 문구입니다. 비워두면
              나타나지 않습니다.
            </Typography.Text>
            <Spacing spacing="5" />

            <Input.TextArea
              rows={6}
              value={body?.information || ""}
              onChange={(e) =>
                onChangeInputValue("information", e.target.value)
              }
              placeholder="내용을 입력해주세요."
              disabled={isAllLoading}
            />
          </Card>
          <Spacing />

          <Card type="inner" title="환불규정" bordered>
            <Typography.Text code type="secondary">
              장소등록 페이지 하단 "환불규정" 폼에 나타나는 문구입니다. 비워두면
              나타나지 않습니다.
            </Typography.Text>
            <Spacing spacing="5" />

            <Input.TextArea
              rows={6}
              value={body?.refundPolicy || ""}
              onChange={(e) =>
                onChangeInputValue("refundPolicy", e.target.value)
              }
              placeholder="내용을 입력해주세요."
              disabled={isAllLoading}
            />
          </Card>
          <Spacing />

          {/* <Card type="inner" title="고객센터" bordered>
            <Typography.Text code type="secondary">
              공간등록 페이지 하단 "고객센터" 폼에 나타나는 문구입니다. 비워두면 나타나지 않습니다.
            </Typography.Text>
            <Spacing spacing="5" />

            <Input.TextArea
              rows={6}
              value={body?.serviceCenter || ''}
              onChange={(e) => onChangeInputValue('serviceCenter', e.target.value)}
              placeholder="내용을 입력해주세요."
              disabled={isAllLoading}
            />
          </Card> */}
        </SDataDetailBody>

        <SDataDetailBody padding>
          <Typography.Text>프로그램관리 설정</Typography.Text>
          <Spacing />

          <Card
            type="inner"
            title="분류"
            bordered
            extra={
              <CardExtra
                isLoading={isAllLoading}
                title="추가하기"
                onClick={() => onClickOpenCodeList("type")}
              />
            }
          >
            <CodeList
              list={body?.type || []}
              onClickEdit={onClickOpenCodeList}
              onChange={(e) => onChangeInputValue("type", e)}
              isLoading={isAllLoading}
            />
          </Card>
          <Spacing />

          <Card
            type="inner"
            title="카테고리"
            bordered
            extra={
              <CardExtra
                isLoading={isAllLoading}
                title="추가하기"
                onClick={() => onClickOpenCodeList("category")}
              />
            }
          >
            <Typography.Text code type="secondary">
              수정 및 삭제를 하여도 해당 카테고리를 등록한 상품에는 수정 및
              삭제가 되지않습니다.
            </Typography.Text>

            <CodeList
              list={body?.category || []}
              onClickEdit={onClickOpenCodeList}
              onChange={(e) => onChangeInputValue("category", e)}
              isLoading={isAllLoading}
            />
          </Card>
        </SDataDetailBody>
      </Flex>

      <CodeDetail
        isOpen={codeBody?.isOpen}
        isClose={onClickCloseCodeList}
        list={body[codeBody?.type] || []}
        type={codeBody?.type || ""}
        data={codeBody?.data || {}}
        onAdd={onChangeInputValue}
      />
    </React.Fragment>
  );
};

const CardExtra = ({ title, isLoading, onClick }) => {
  return (
    <a href="#" disabled={isLoading} onClick={onClick}>
      {title}
    </a>
  );
};

export default SettingCodePage;
