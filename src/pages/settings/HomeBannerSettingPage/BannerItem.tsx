import { Banner } from '@/entities/banner';
import BannerService from '@/services/BannerService';
import { Button, Popconfirm, Tag, message } from 'antd';
import { RxDragHandleDots1 } from 'react-icons/rx';
import styled from 'styled-components';

type Props = {
  banner: Banner;
  refetch: () => void;
};

const BannerItem = ({ banner, refetch }: Props) => {
  const handleDelete = async () => {
    try {
      await BannerService.deleteBanner({ bannerId: banner.id });
      refetch();
      message.success('삭제되었습니다.');
    } catch (err) {
      message.error('에러가 발생하였습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleChangeVisibility = async () => {
    try {
      await BannerService.updateBannerVisibility({
        bannerId: banner.id,
        isShow: !banner.isShow,
      });
      refetch();
      message.success('변경되었습니다.');
    } catch (err) {
      message.error('에러가 발생하였습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <SBannerItem>
      <BannerListItemDragButton />
      <div style={{ textDecoration: 'underline' }}>
        <a target="_blank" href={banner.linkUrl} rel="noreferrer">
          {banner.name}
        </a>
      </div>
      <div className="banner-tag-wrapper">
        {banner.isShow && <Tag color="green">게시중</Tag>}
        {!banner.isShow && <Tag color="red">숨김</Tag>}
      </div>
      <div className="banner-image-wrapper">
        <img className="banner-image" src={banner.imageUrl} />
      </div>
      <div className="action-container">
        <Button onClick={handleChangeVisibility}>게시 상태 변경</Button>
        <Popconfirm title="정말 삭제하시겠습니까?" onConfirm={handleDelete} okText="삭제" cancelText="취소">
          <Button danger>삭제</Button>
        </Popconfirm>
      </div>
    </SBannerItem>
  );
};

export default BannerItem;

const SBannerItem = styled.div`
  position: relative;
  padding: 24px;
  background-color: #ffffff;
  margin-bottom: 10px;
  border-radius: 8px;

  font-size: 1.6rem;
  font-weight: bold;
  color: ${(props) => props.theme.mainColor};
  width:;

  .banner-tag-wrapper {
    margin-top: 8px;
    text-align: right;
  }

  .banner-image-wrapper {
    margin-top: 8px;
  }

  .banner-image {
    width: 150px;
    border-radius: 4px;
  }

  .action-container {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    font-size: 1.2rem;
    margin-top: 12px;
  }

  &:hover {
    .banner-list-item-drag-button {
      visibility: visible;
    }
  }

  .banner-list-item-drag-button {
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

const BannerListItemDragButton = () => {
  return (
    <button className="banner-list-item-drag-button">
      <RxDragHandleDots1 />
    </button>
  );
};
