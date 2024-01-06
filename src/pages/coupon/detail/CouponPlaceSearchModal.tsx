import CouponService, { PlaceResult } from "@/services/CouponService";
import { Button, Checkbox, Input, Modal, message } from "antd";
import { useState } from "react";
import styled from "styled-components";

type Props = {
  open: boolean;
  onClose: () => void;
  placeList: PlaceResult["id"][];
  setPlaceList: (placeList: PlaceResult["id"][]) => void;
  programList: PlaceResult["programs"][number]["id"][];
  setProgramList: (
    programList: PlaceResult["programs"][number]["id"][]
  ) => void;
};

const CouponPlaceSearchModal = ({ open, onClose }: Props) => {
  const [query, setQuery] = useState("");
  const [placeResults, setPlaceResults] = useState<PlaceResult[]>([]);

  const handleClose = () => {
    onClose();
  };

  const onSearch = async () => {
    try {
      const data = await CouponService.searchPlace({ query });
      setPlaceResults(data);
    } catch (err) {
      message.error("에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <Modal
      title="장소 검색"
      open={open}
      onCancel={handleClose}
      destroyOnClose
      footer={[
        <Button key={"save"}>저장</Button>,
        <Button key={"cancel"} onClick={handleClose}>
          취소
        </Button>,
      ]}
    >
      <InputWrapper>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button onClick={onSearch}>검색</Button>
      </InputWrapper>

      <ResultWrapper>
        {placeResults.map((result) => (
          <ResultItem key={result.id}>
            <Checkbox>{result.name}</Checkbox>
            {result.programs.map((program) => (
              <ResultItem key={program.id}>
                <Checkbox>{program.name}</Checkbox>
              </ResultItem>
            ))}
          </ResultItem>
        ))}
      </ResultWrapper>
    </Modal>
  );
};

export default CouponPlaceSearchModal;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const ResultWrapper = styled.div``;

const ResultItem = styled.div``;
