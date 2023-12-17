import { DataDetailItem } from "@/components/detailTable/DataDetailBody";
import { SectionItem, SectionWithItems } from "@/entities/place";
import { Button, Divider, Input, Modal } from "antd";
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

  const onDeleteItem = (item: SectionItem) => {
    setItems((prev) => prev.filter((prevItem) => prevItem.id !== item.id));
  };

  return (
    <Modal
      title="섹션 수정"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key={"save"} onClick={() => console.log("SAVE")}>
          저장
        </Button>,
        <Button key={"cancel"} onClick={onClose}>
          취소
        </Button>,
      ]}
    >
      <DataDetailItem label="섹션명">
        <Input value={label} onChange={(e) => setLabel(e.target.value)} />
      </DataDetailItem>

      <Wrapper>
        <ButtonWrapper>
          <Button onClick={() => setOpenFindItemModal(true)}>
            리스트 검색
          </Button>
          <SectionFindModal
            open={openFindItemModal}
            onClose={() => setOpenFindItemModal(false)}
          />
        </ButtonWrapper>
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
            <SSectionItem key={item.id}>
              <SectionWithItemsDragButton />
              <div>{item.name}</div>
              <Button
                style={{ marginLeft: "auto" }}
                onClick={() => onDeleteItem(item)}
              >
                삭제
              </Button>
            </SSectionItem>
          ))}
        </ReactSortable>
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

const SectionWithItemsDragButton = () => {
  return (
    <button className="section-with-items-drag-button">
      <RxDragHandleDots1 />
    </button>
  );
};
