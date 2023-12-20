import DataTableHeader from "@/components/dataTable/DataTableHeader";
import { SectionWithItems } from "@/entities/place";
import PlaceService from "@/services/PlaceService";
import { message } from "antd";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import styled from "styled-components";
import SectionItem from "./SectionItem";

const HomeSectionSettingPage = () => {
  const [sectionWithItems, setSectionWithItems] = useState<SectionWithItems[]>(
    []
  );

  useEffect(() => {
    const fetchSections = async () => {
      const data = await PlaceService.listSections();
      setSectionWithItems(data);
    };

    fetchSections();
  }, []);

  const refetch = async () => {
    const data = await PlaceService.listSections();
    setSectionWithItems(data);
  };

  const onSaveSectionInfo = async (sectionWithItems: SectionWithItems[]) => {
    try {
      const orderItems = sectionWithItems.map((swi, index) => ({
        id: swi.section.id,
        order: index + 1,
      }));

      await PlaceService.updateSectionOrder(orderItems);
      message.success("저장되었습니다.");
    } catch (err) {
      message.error("에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <Wrapper>
      <DataTableHeader
        title="홈 화면 섹션 관리"
        resister={{
          text: "저장",
          onClick: () => onSaveSectionInfo(sectionWithItems),
        }}
      />
      {sectionWithItems && (
        <ReactSortable
          className="section-list"
          list={sectionWithItems}
          setList={setSectionWithItems}
          animation={200}
          delayOnTouchStart={true}
          delay={1}
          handle=".section-list-item-drag-button"
        >
          {sectionWithItems.map((swi) => (
            <SectionItem
              key={swi.id}
              sectionWithItems={swi}
              refetch={refetch}
            />
          ))}
        </ReactSortable>
      )}
    </Wrapper>
  );
};

export default HomeSectionSettingPage;

const Wrapper = styled.div`
  .section-list {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
`;
