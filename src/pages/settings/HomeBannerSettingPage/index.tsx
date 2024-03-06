import { useEffect, useState } from 'react';

import BannerService from '@/services/BannerService';

import DataTableHeader from '@/components/dataTable/DataTableHeader';

import { Banner } from '@/entities/banner';
import { Button, message } from 'antd';
import { ReactSortable } from 'react-sortablejs';
import styled from 'styled-components';
import BannerAddModal from './BannerAddModal';
import BannerItem from './BannerItem';

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

  const refetch = async () => {
    const data = await BannerService.listBanners();
    setBanners(data);
  };

  const handleChangeOrder = async () => {
    const orderItems = banners.map((banner, index) => ({
      id: banner.id,
      order: index + 1,
    }));

    await BannerService.updateBannerOrder({
      bannerOrders: orderItems,
    });

    message.success('저장되었습니다.');
  };

  return (
    <Wrapper>
      <DataTableHeader title="홈 배너 관리" register={{ text: '저장', onClick: handleChangeOrder }} />

      <div className="button-wrapper">
        <Button type="primary" onClick={() => setAddModalOpen(true)}>
          배너 추가
        </Button>
        <BannerAddModal open={addModalOpen} onClose={() => setAddModalOpen(false)} lastOrder={banners.length} refetch={refetch} />
      </div>
      <ReactSortable
        className="banner-list"
        list={banners}
        setList={setBanners}
        animation={200}
        delayOnTouchStart
        delay={1}
        handle=".banner-list-item-drag-button"
      >
        {banners.map((banner) => (
          <BannerItem key={banner.id} banner={banner} refetch={refetch} />
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
