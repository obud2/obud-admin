import DataTableHeader from "@/components/dataTable/DataTableHeader";
import { Section } from "@/entities/place";
import PlaceService from "@/services/PlaceService";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import styled from "styled-components";
import SectionItem from "./SectionItem";
import { Button } from "antd";
import swal from "sweetalert";

const HomeSectionSettingPage = () => {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const fetchSections = async () => {
      const data = await PlaceService.listSections();
      setSections(data.map((s) => s.section));
    };

    fetchSections();
  }, []);

  const onSubmit = async (sections: Section[]) => {
    try {
      const orderItems = sections.map((section, index) => ({
        id: section.id,
        order: index + 1,
      }));

      await PlaceService.updateSectionOrder(orderItems);
      swal("저장되었습니다.");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Wrapper>
      <DataTableHeader title="홈 화면 섹션 관리" />
      <ButtonWrapper>
        <Button onClick={() => onSubmit(sections)}>저장</Button>
      </ButtonWrapper>
      {sections && (
        <ReactSortable
          className="section-list"
          list={sections}
          setList={setSections}
          animation={200}
          delayOnTouchStart={true}
          delay={1}
          handle=".section-list-item-drag-button"
        >
          {sections.map((section) => (
            <SectionItem key={section.name} section={section} />
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

const ButtonWrapper = styled.div`
  text-align: right;
  margin-bottom: 24px;
`;
