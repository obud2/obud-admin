import { SectionWithItems } from "@/entities/place";
import { Button } from "antd";
import { useState } from "react";
import { RxDragHandleDots1 } from "react-icons/rx";
import styled from "styled-components";
import SectionEditModal from "./SectionEditModal";

type Props = {
  sectionWithItems: SectionWithItems;
  refetch: () => void;
};

const SectionItem = ({ sectionWithItems, refetch }: Props) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const section = sectionWithItems.section;

  return (
    <SSectionItem>
      <SectionListItemDragButton />
      <div>{section.name}</div>
      <div className="action-container">
        <Button onClick={() => setEditModalOpen(true)}>수정</Button>
      </div>
      <SectionEditModal
        sectionWithItems={sectionWithItems}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        refetch={refetch}
      />
    </SSectionItem>
  );
};

export default SectionItem;

const SSectionItem = styled.div`
  position: relative;
  padding: 24px;
  background-color: #ffffff;
  margin-bottom: 10px;
  border-radius: 8px;

  font-size: 1.6rem;
  font-weight: bold;
  color: ${(props) => props.theme.mainColor};
  width: ;

  .action-container {
    font-size: 1.2rem;
    margin-top: 12px;
    text-align: right;
  }

  &:hover {
    .section-list-item-drag-button {
      visibility: visible;
    }
  }

  .section-list-item-drag-button {
    position: absolute;
    top: 8px;
    right: 8px;

    width: 25px;
    height: 25px;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    visibility: hidden;

    svg {
      width: 23px;
      height: 23px;
    }
  }
`;

const SectionListItemDragButton = () => {
  return (
    <button className="section-list-item-drag-button">
      <RxDragHandleDots1 />
    </button>
  );
};
