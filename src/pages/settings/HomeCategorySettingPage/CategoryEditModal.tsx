import { DataDetailItem } from '@/components/detailTable/DataDetailBody';
import { StudioCategory } from '@/entities/place';
import { listPlaceByCategory, updateCategoryItems } from '@/services/PlaceV2Service';
import { Button, Input, Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import { RxDragHandleDots1 } from 'react-icons/rx';
import { ReactSortable } from 'react-sortablejs';
import styled from 'styled-components';
import CategiryFindModal from './CategoryFindModal';

export type CategoryPlaceInfo = {
  id: string;
  title: string;
};

type Props = {
  categoryId: number;
  category: StudioCategory;
  open: boolean;
  onClose: () => void;
};

const CategoryEditModal = ({ categoryId, category, open, onClose }: Props) => {
  const [openFindItemModal, setOpenFindItemModal] = useState(false);
  const [categoryPlaceInfos, setCategoryPlaceInfos] = useState<CategoryPlaceInfo[]>([]);

  useEffect(() => {
    const fetchCategoryPlaces = async () => {
      try {
        const placeItems = await listPlaceByCategory(categoryId);
        setCategoryPlaceInfos(placeItems.map((item) => ({ id: item.id, title: item.title })));
      } catch (err) {
        message.error('에러가 발생하였습니다. 잠시 후 다시 시도해주세요.');
      }
    };
    fetchCategoryPlaces();
  }, [categoryId]);

  const handleClose = () => {
    setCategoryPlaceInfos([]);
    onClose();
  };

  const onDeleteItem = (item: CategoryPlaceInfo) => {
    setCategoryPlaceInfos((prev) => prev.filter((prevItem) => prevItem.id !== item.id));
  };

  const onAddItems = (items: CategoryPlaceInfo[]) => {
    const filteredItems = items.filter((item) => !categoryPlaceInfos.find((i) => i.id === item.id));
    setCategoryPlaceInfos((prev) => [...prev, ...filteredItems]);
  };

  const handleSubmit = async () => {
    const placeIds = categoryPlaceInfos.map((item) => item.id);

    try {
      await updateCategoryItems({ categoryId, placeIds });
      message.success('저장되었습니다.');
      handleClose();
    } catch (err) {
      message.error('에러가 발생하였습니다. 잠시 후 다시 시도해주세요.');
      console.log(err);
    }
  };

  return (
    <Modal
      title="카테고리 수정"
      open={open}
      onCancel={handleClose}
      destroyOnClose
      footer={[
        <Button key="save" onClick={handleSubmit}>
          저장
        </Button>,
        <Button key="cancel" onClick={handleClose}>
          취소
        </Button>,
      ]}
    >
      <DataDetailItem label="카테고리명">
        <Input disabled value={category} />
      </DataDetailItem>

      <Wrapper>
        <ButtonWrapper>
          <Button onClick={() => setOpenFindItemModal(true)}>리스트 검색</Button>
          <CategiryFindModal open={openFindItemModal} onClose={() => setOpenFindItemModal(false)} addCategoryPlaceInfos={onAddItems} />
        </ButtonWrapper>
        <ResultWrapper>
          <ReactSortable
            className="category-with-items-list"
            list={categoryPlaceInfos}
            setList={setCategoryPlaceInfos}
            animation={200}
            delayOnTouchStart
            delay={1}
            handle=".category-with-items-drag-button"
          >
            {categoryPlaceInfos.map((item) => (
              <SSectionItem key={`${item.id}`}>
                <SectionWithItemsDragButton />
                <Item>
                  <div>{item.title}</div>
                </Item>
                <Button style={{ marginLeft: 'auto' }} onClick={() => onDeleteItem(item)}>
                  삭제
                </Button>
              </SSectionItem>
            ))}
          </ReactSortable>
        </ResultWrapper>
      </Wrapper>
    </Modal>
  );
};

export default CategoryEditModal;

const Wrapper = styled.div`
  .category-with-items-list {
    padding: 20px;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 12px;
`;

const SSectionItem = styled.div`
  position: relative;
  padding: 12px 0;
  display: flex;
  align-items: center;

  .category-with-items-drag-button {
    width: 25px;
    height: 25px;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    margin-right: 8px;

    svg {
      width: 23px;
      height: 23px;
    }
  }
`;

const ResultWrapper = styled.div`
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

const SectionWithItemsDragButton = () => {
  return (
    <button className="category-with-items-drag-button">
      <RxDragHandleDots1 />
    </button>
  );
};
