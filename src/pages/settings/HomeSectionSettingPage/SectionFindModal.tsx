import { SectionItem } from "@/entities/place";
import PlaceService from "@/services/PlaceService";
import { Button, Checkbox, Input, Modal, Tag, message } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";

type Props = {
  open: boolean;
  onClose: () => void;
};

const SectionFindModal = ({ open, onClose }: Props) => {
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState<SectionItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    onSearch();
    return () => {
      setItems([]);
      setSelectedItems([]);
    };
  }, []);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(itemId)) {
        return prevSelected.filter((id) => id !== itemId);
      } else {
        return [...prevSelected, itemId];
      }
    });
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
        <Button key={"cancel"} onClick={onClose}>
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
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleItemSelection(item.id)}
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
