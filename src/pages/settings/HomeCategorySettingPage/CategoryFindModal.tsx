import { SectionItem, SectionItemType } from '@/entities/place';
import { listSectionItems } from '@/services/PlaceV2Service';
import { Button, Checkbox, Input, Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CategoryPlaceInfo } from './CategoryEditModal';

type Props = {
  open: boolean;
  onClose: () => void;
  addCategoryPlaceInfos: (categoryPlaceInfos: CategoryPlaceInfo[]) => void;
};

const CategoryFindModal = ({ open, onClose, addCategoryPlaceInfos }: Props) => {
  const [keyword, setKeyword] = useState('');
  const [items, setItems] = useState<SectionItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SectionItem[]>([]);

  const handleClose = () => {
    setKeyword('');
    setItems([]);
    setSelectedItems([]);
    onClose();
  };

  useEffect(() => {
    onSearch();
  }, []);

  const toggleItemSelection = (item: SectionItem) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.find((i) => i.id === item.id)) {
        return prevSelected.filter((i) => i.id !== item.id);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const handleAddItems = () => {
    const categoryPlaceInfos = items
      .filter((item) => selectedItems.find((i) => i.id === item.id))
      .map((item) => ({ id: item.id, title: item.name }));
    addCategoryPlaceInfos(categoryPlaceInfos);
    handleClose();
  };

  const onSearch = async () => {
    try {
      const sectionItems = await listSectionItems({ keyword });
      // TODO: 장소만 필터링하는게 맞는지 확인
      setItems(sectionItems.filter((item) => item.type === SectionItemType.PLACE));
      setSelectedItems([]);
    } catch (err) {
      message.error('에러가 발생하였습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <Modal
      title="장소 검색"
      destroyOnClose
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key="add" onClick={handleAddItems}>
          추가
        </Button>,
        <Button key="cancel" onClick={handleClose}>
          취소
        </Button>,
      ]}
    >
      <DetailItemWrapper>
        <Wrapper>
          <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="장소명" />
          <Button onClick={onSearch}>검색</Button>
        </Wrapper>
      </DetailItemWrapper>

      <DetailItemWrapper>
        <Title>검색 결과</Title>
        <ItemWrapper>
          {items.map((item) => (
            <Item key={`${item.id}-${item.type}`}>
              <Checkbox
                checked={!!selectedItems.find((i) => i.id === item.id && i.type === item.type)}
                onChange={() => toggleItemSelection(item)}
              >
                <div>{item.name}</div>
              </Checkbox>
            </Item>
          ))}
        </ItemWrapper>
      </DetailItemWrapper>
    </Modal>
  );
};

export default CategoryFindModal;

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
