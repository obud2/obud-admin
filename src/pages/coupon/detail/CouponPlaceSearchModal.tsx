import CouponService, { PlaceResult } from "@/services/CouponService";
import { Button, Checkbox, Input, Modal, message } from "antd";
import { useState } from "react";
import styled from "styled-components";

type Props = {
  open: boolean;
  onClose: () => void;
  placeList: PlaceResult[];
  setPlaceList: (placeList: PlaceResult[]) => void;
  programList: PlaceResult["programs"][number][];
  setProgramList: (programList: PlaceResult["programs"][number][]) => void;
};

const CouponPlaceSearchModal = ({
  open,
  onClose,
  placeList,
  setPlaceList,
  programList,
  setProgramList,
}: Props) => {
  const [showResults, setShowResults] = useState(false);
  const [query, setQuery] = useState("");
  const [placeResults, setPlaceResults] = useState<PlaceResult[]>([]);
  const [tempPlaceList, setTempPlaceList] = useState<PlaceResult[]>([]);
  const [tempProgramList, setTempProgramList] = useState<
    PlaceResult["programs"][number][]
  >([]);

  const handleClose = () => {
    setQuery("");
    setPlaceResults([]);
    setTempPlaceList([]);
    setTempProgramList([]);
    onClose();
  };

  const handleSave = () => {
    setPlaceList(Array.from(new Set([...placeList, ...tempPlaceList])));
    setProgramList(Array.from(new Set([...programList, ...tempProgramList])));
    handleClose();
  };

  const onSearch = async () => {
    try {
      const data = await CouponService.searchPlace({ query });
      setPlaceResults(
        data.map((place) => ({
          ...place,
          programs: place.programs.map((program) => ({
            ...program,
            name: `${place.name} - ${program.name}`,
          })),
        }))
      );
      setShowResults(true);
    } catch (err) {
      message.error("에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const emptyResult = placeResults.length === 0 && query;

  return (
    <Modal
      title="장소 검색"
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
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(false);
          }}
        />
        <Button onClick={onSearch}>검색</Button>
      </InputWrapper>

      <ResultWrapper>
        {showResults && emptyResult && <div>검색 결과가 없습니다.</div>}
        {placeResults.map((result) => (
          <ResultItem key={result.id}>
            <Checkbox
              checked={!!tempPlaceList.find((place) => place.id === result.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setTempPlaceList((prev) => [...prev, result]);
                  setTempProgramList((prev) => [...prev, ...result.programs]);
                } else {
                  setTempPlaceList((prev) =>
                    prev.filter((place) => place.id !== result.id)
                  );
                  setTempProgramList((prev) =>
                    prev.filter(
                      (program) =>
                        !result.programs.find((p) => p.id === program.id)
                    )
                  );
                }
              }}
            >
              {result.name}
            </Checkbox>
            <ResultProgramWrapper>
              {result.programs.map((program) => (
                <ResultItem key={program.id}>
                  <Checkbox
                    checked={!!tempProgramList.find((p) => p.id === program.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTempProgramList((prev) => [...prev, program]);
                      } else {
                        setTempProgramList((prev) =>
                          prev.filter((p) => p.id !== program.id)
                        );
                      }
                    }}
                  >
                    {program.name}
                  </Checkbox>
                </ResultItem>
              ))}
            </ResultProgramWrapper>
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

const ResultWrapper = styled.div`
  max-height: 500px;
  overflow-y: auto;
`;

const ResultProgramWrapper = styled.div`
  margin-left: 20px;
  padding: 8px;
`;

const ResultItem = styled.div``;
