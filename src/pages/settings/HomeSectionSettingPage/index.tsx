import { useMutation, useQuery } from "react-query";

import DataTableHeader from "@/components/dataTable/DataTableHeader";
import PlaceService from "@/services/PlaceService";
import { ReactSortable } from "react-sortablejs";
import styled from "styled-components";
import SectionItem from "./SectionItem";
import { Section } from "@/entities/place";

const HomeSectionSettingPage = () => {
  const { data, isLoading } = useQuery(
    ["place-section"],
    () => PlaceService.listSections(),
    {
      select: (data) => data.map((s) => s.section),
    }
  );

  const { mutate } = useMutation((sections: Section[]) => {
    const orderItems = sections.map((section, index) => ({
      id: section.id,
      order: index,
    }));

    return PlaceService.updateSectionOrder(orderItems);
  });

  return (
    <Wrapper>
      <DataTableHeader title="About 관리" isLoading={isLoading} />
      {data && (
        <ReactSortable
          className="section-list"
          list={data}
          setList={mutate}
          animation={200}
          delayOnTouchStart={true}
          delay={1}
          handle=".section-list-item-drag-button"
        >
          {data.map((section) => (
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
