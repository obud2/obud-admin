import { SectionItem } from "@/entities/place";
import PlaceService from "@/services/PlaceService";
import { Button, Checkbox, Input, Modal, Tag, message } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";

type Props = {
  open: boolean;
  onClose: () => void;
  addSectionItems: (sectionItems: SectionItem[]) => void;
};

const SectionFindModal = ({ open, onClose, addSectionItems }: Props) => {
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState<SectionItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SectionItem[]>([]);

  useEffect(() => {
    onSearch();
    return () => {
      setItems([]);
      setSelectedItems([]);
    };
  }, []);

  const toggleItemSelection = (item: SectionItem) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.find((i) => i.id === item.id && i.type === item.type)) {
        return prevSelected.filter(
          (i) => i.id !== item.id || i.type !== item.type
        );
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const handleAddItems = () => {
    const sectionItems = items.filter((item) =>
      selectedItems.find((i) => i.id === item.id && i.type === item.type)
    );
    onClose();
    setKeyword("");
    setItems([]);
    addSectionItems(sectionItems);
  };

  const onSearch = async () => {
    try {
      const sectionItems = await PlaceService.listSectionItems({ keyword });
      setItems(sectionItems);
      setSelectedItems([]);
    } catch (err) {
      message.error("에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <Modal
      title="장소 / 프로그램 검색"
      destroyOnClose
      open={open}
      onCancel={onClose}
      footer={[
        <Button key={"add"} onClick={handleAddItems}>
          추가
        </Button>,
        <Button key={"cancel"} onClick={onClose}>
          취소
        </Button>,
      ]}
    >
      <DetailItemWrapper>
        <Wrapper>
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="장소명 / 프로그램명"
          />
          <Button onClick={onSearch}>검색</Button>
        </Wrapper>
      </DetailItemWrapper>

      <DetailItemWrapper>
        <Title>검색 결과</Title>
        <ItemWrapper>
          {items.map((item) => (
            <Item key={`${item.id}-${item.type}`}>
              <Checkbox
                checked={
                  !!selectedItems.find(
                    (i) => i.id === item.id && i.type === item.type
                  )
                }
                onChange={() => toggleItemSelection(item)}
              >
                <div>{item.name}</div>
              </Checkbox>
              <Tag>{item.type}</Tag>
            </Item>
          ))}
        </ItemWrapper>
      </DetailItemWrapper>
    </Modal>
  );
};

export default SectionFindModal;

const DetailItemWrapper = styled.div`
  padding: 12px;
`;

const Wrapper = styled.div`
  display: flex;
`;

const Title = styled.div`
  margin-bottom: 8px;
  border-bottom: 1px solid #dddddd;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  height: 500px;
  overflow-y: scroll;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
`;
