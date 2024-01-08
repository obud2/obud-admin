import CouponService, { UserResult } from "@/services/CouponService";
import { Button, Checkbox, Input, Modal, message } from "antd";
import { useState } from "react";
import styled from "styled-components";

type Props = {
  open: boolean;
  onClose: () => void;
  userList: UserResult[];
  setUserList: (userList: UserResult[]) => void;
};

const CouponUserSearchModal = ({
  open,
  onClose,
  userList,
  setUserList,
}: Props) => {
  const [showResults, setShowResults] = useState(false);
  const [query, setQuery] = useState("");
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [tempUserList, setTempUserList] = useState<UserResult[]>([]);

  const handleClose = () => {
    setQuery("");
    setUserResults([]);
    setTempUserList([]);
    onClose();
  };

  const handleSave = () => {
    setUserList(Array.from(new Set([...userList, ...tempUserList])));
    handleClose();
  };

  const onSearch = async () => {
    try {
      const data = await CouponService.searchUser({ query });
      setUserResults(data);
      setShowResults(true);
    } catch (err) {
      message.error("에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const emptyResult = userResults.length === 0 && query;

  return (
    <Modal
      title="회원 검색"
      open={open}
      onCancel={handleClose}
      destroyOnClose
      footer={[
        <Button key={"save"} onClick={handleSave}>
          저장
        </Button>,
        <Button key={"cancel"} onClick={handleClose}>
          취소
        </Button>,
      ]}
    >
      <InputWrapper>
        <Input
          value={query}
          placeholder="이름, 연락처, 이메일 주소로 검색"
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(false);
          }}
        />
        <Button onClick={onSearch}>검색</Button>
      </InputWrapper>

      <ResultWrapper>
        {showResults && emptyResult && <div>검색 결과가 없습니다.</div>}
        {userResults.map((user) => (
          <ResultItem key={user.id}>
            <Checkbox
              checked={!!tempUserList.find((u) => u.id === user.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setTempUserList((prev) => [...prev, user]);
                } else {
                  setTempUserList((prev) =>
                    prev.filter((prevUser) => prevUser.id !== user.id)
                  );
                }
              }}
            >
              <UserInfoWrapper>
                {user.name} / {user.email} / {user.phone}
              </UserInfoWrapper>
            </Checkbox>
          </ResultItem>
        ))}
      </ResultWrapper>
    </Modal>
  );
};

export default CouponUserSearchModal;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const ResultWrapper = styled.div``;

const ResultItem = styled.div``;

const UserInfoWrapper = styled.div`
  display: flex;
`;
