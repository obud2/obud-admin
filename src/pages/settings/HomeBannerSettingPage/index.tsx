import { useEffect, useRef, useState } from "react";

import BannerService from "@/services/BannerService";
import { useQuery } from "react-query";

import DataTableHeader from "@/components/dataTable/DataTableHeader";

import { DataDetailItem } from "@/components/detailTable/DataDetailBody";
import { SDataDetailBody } from "@/components/detailTable/DataDetailBody.styled";

import UploadBtn from "@/components/common/uploadBtn/UploadBtn";
import FileUpload from "@/components/fileUpload/FileUpload";
import { Banner } from "@/entities/banner";
import { ReactSortable } from "react-sortablejs";
import BannerItem from "./BannerItem";
import { Button } from "antd";
import styled from "styled-components";
import BannerAddModal from "./BannerAddModal";

const HomeBannerSettingPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      const data = await BannerService.listBanners();
      setBanners(data);
    };

    fetchBanners();
  }, []);

  return (
    <Wrapper>
      <DataTableHeader
        title="홈 배너 관리"
        resister={{ text: "저장", onClick: () => console.log("SAVE") }}
      />

      <div className="button-wrapper">
        <Button type="primary" onClick={() => setAddModalOpen(true)}>
          배너 추가
        </Button>
        <BannerAddModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          lastOrder={banners.length}
        />
      </div>
      <ReactSortable
        className="banner-list"
        list={banners}
        setList={setBanners}
        animation={200}
        delayOnTouchStart={true}
        delay={1}
        handle=".banner-list-item-drag-button"
      >
        {banners.map((banner) => (
          <BannerItem key={banner.id} banner={banner} />
        ))}
      </ReactSortable>
    </Wrapper>
  );
};

export default HomeBannerSettingPage;

const Wrapper = styled.div`
  .button-wrapper {
    margin: 20px 0;
  }

  .banner-list {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
`;
