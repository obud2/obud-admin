import { useState } from "react";

import { useQuery } from "react-query";

import { ReactSortable } from "react-sortablejs";
import DataTableHeader from "../../../components/dataTable/DataTableHeader";
import PlaceService from "../../../services/PlaceService";

const HomeSectionSettingPage = () => {
  const { data: sections, isLoading: sectionLoading } = useQuery(
    ["place-section"],
    () => PlaceService.getPlaceSections()
  );

  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");

  const onClickSubmit = async () => {
    setIsLoading(true);
  };

  return (
    <>
      <DataTableHeader
        title="About 관리"
        resister={{ text: "저장", onClick: onClickSubmit }}
        notiMessage={notiMessage}
        isLoading={isLoading || sectionLoading}
      />
      {sections && (
        <ReactSortable
          list={sections}
          setList={(e) => console.log(e)}
          animation={200}
          delayOnTouchStart={true}
          delay={1}
        >
          {sections.map((item, idx) => (
            <div key={idx}>{item.createdAt}</div>
          ))}
        </ReactSortable>
      )}
    </>
  );
};

export default HomeSectionSettingPage;
