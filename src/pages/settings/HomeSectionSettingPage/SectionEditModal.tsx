import { DataDetailItem } from "@/components/detailTable/DataDetailBody";
import { SectionItem, SectionWithItems } from "@/entities/place";
import PlaceService from "@/services/PlaceService";
import { Button, Input, Modal, Tag, message } from "antd";
import { useState } from "react";
import { RxDragHandleDots1 } from "react-icons/rx";
import { ReactSortable } from "react-sortablejs";
import styled from "styled-components";
import SectionFindModal from "./SectionFindModal";

type Props = {
  sectionWithItems: SectionWithItems;
  open: boolean;
  onClose: () => void;
};

const SectionEditModal = ({ sectionWithItems, open, onClose }: Props) => {
  const [openFindItemModal, setOpenFindItemModal] = useState(false);

  const [label, setLabel] = useState(sectionWithItems.section.name);
  const [items, setItems] = useState(sectionWithItems.items);

  const handleClose = () => {
    setItems([]);
    onClose();
  };

  const onDeleteItem = (item: SectionItem) => {
    setItems((prev) => prev.filter((prevItem) => prevItem.id !== item.id));
  };

  const onAddItems = (items: SectionItem[]) => {
    const filteredItems = items.filter(
      (item) => !sectionWithItems.items.find((i) => i.id === item.id)
    );
    setItems((prev) => [...prev, ...filteredItems]);
  };

  const handleSubmit = async () => {
    const requestItems = items.map((item, index) => ({
      id: item.id,
      order: index + 1,
      type: item.type,
    }));

    try {
      await PlaceService.updateSectionItems({
        sectionId: sectionWithItems.section.id,
        items: requestItems,
      });
      message.success("저장되었습니다.");
      handleClose();
    } catch (err) {
      message.error("에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
      console.log(err);
    }
  };

  return (
    <Modal
      title="섹션 수정"
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key={"save"} onClick={handleSubmit}>
          저장
        </Button>,
        <Button key={"cancel"} onClick={handleClose}>
          취소
        </Button>,
      ]}
    >
      <DataDetailItem label="섹션명">
        {/* 아직 Input Value 수정은 서버에서 지원하지 않는다. */}
        <Input
          disabled
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </DataDetailItem>

      <Wrapper>
        <ButtonWrapper>
          <Button onClick={() => setOpenFindItemModal(true)}>
            리스트 검색
          </Button>
          <SectionFindModal
            open={openFindItemModal}
            onClose={() => setOpenFindItemModal(false)}
            addSectionItems={onAddItems}
          />
        </ButtonWrapper>
        <ResultWrapper>
          <ReactSortable
            className="section-with-items-list"
            list={items}
            setList={setItems}
            animation={200}
            delayOnTouchStart={true}
            delay={1}
            handle=".section-with-items-drag-button"
          >
            {items.map((item) => (
              <SSectionItem key={`${item.id}-${item.type}`}>
                <SectionWithItemsDragButton />
                <Item>
                  <div>{item.name}</div>
                  <Tag>{item.type}</Tag>
                </Item>
                <Button
                  style={{ marginLeft: "auto" }}
                  onClick={() => onDeleteItem(item)}
                >
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

export default SectionEditModal;

const Wrapper = styled.div`
  .section-with-items-list {
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

  .section-with-items-drag-button {
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
    <button className="section-with-items-drag-button">
      <RxDragHandleDots1 />
    </button>
  );
};
