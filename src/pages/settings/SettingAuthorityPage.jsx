import React, { useContext, useEffect, useState } from "react";

import { Tree, Select, Typography } from "antd";
import { MenuContext } from "../../context/MenuContext";

import { Flex } from "../../styles/CommonStyles";
import { USER_ROLE } from "../../constants/config";

import { SDataDetailBody } from "../../components/detailTable/DataDetailBody.styled.tsx";
import DataTableHeader from "../../components/dataTable/DataTableHeader";

import GroupService from "../../services/GroupService";

const SettingAuthorityPage = () => {
  const { menu } = useContext(MenuContext);

  const [auth, setAuth] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");

  const [checkedKeys, setCheckedKeys] = useState([]);

  useEffect(() => {
    if (notiMessage) {
      setTimeout(() => {
        setIsLoading(false);
        setNotiMessage("");
      }, [2000]);
    }
  }, [notiMessage]);

  useEffect(() => {
    if (auth) {
      GroupService.getItem(auth).then((res) => {
        const select = res?.auth || [];

        setCheckedKeys(select);
      });
    }
  }, [auth]);

  const handleChange = (e) => {
    setAuth(e);
  };

  const onCheck = (checkedKeys) => {
    setCheckedKeys(checkedKeys?.checked);
  };

  const onClickSubmit = () => {
    setIsLoading(true);

    const param = {
      id: auth,
      auth: checkedKeys,
    };

    GroupService.updateItem(param)
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
        title="권한설정"
        resister={{ text: "저장", onClick: onClickSubmit }}
        notiMessage={notiMessage}
        isLoading={isLoading}
        disabled={!auth}
      />

      <SDataDetailBody padding>
        <Flex flexDirection="column" style={{ marginBottom: 20 }}>
          <Select
            style={{ width: 210 }}
            // options={USER_ROLE?.slice(0, 2)}
            options={USER_ROLE}
            placeholder="권한을 선택해주세요."
            onChange={handleChange}
            disabled={isLoading}
            loading={isLoading}
          />
          <Typography.Text type="warning">
            * 해당 권한에게 노출하고 싶은 메뉴를 지정할 수 있습니다.
          </Typography.Text>
          <Typography.Text type="danger">
            * 해당 권한을 부여하면 해당 페이지에 읽기/ 쓰기/ 수정/ 삭제가
            가능해집니다.
          </Typography.Text>
        </Flex>

        {menu && menu?.length > 0 && (
          <Tree
            checkable
            checkStrictly
            defaultExpandAll
            autoExpandParent
            onCheck={onCheck}
            treeData={menu || []}
            checkedKeys={checkedKeys}
            disabled={!auth || isLoading}
            loading={isLoading}
          />
        )}
      </SDataDetailBody>
    </React.Fragment>
  );
};

export default SettingAuthorityPage;
