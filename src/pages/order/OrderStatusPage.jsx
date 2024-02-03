import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useQuery } from 'react-query';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import ProductStudioList from '../../components/product/ProductStudioList';
import { getStudios } from '@/services/PlaceService.ts';

/**
 *
 * @returns 예약현황 페이지
 */
const OrderStatusPage = () => {
  const navigation = useNavigate();

  const fetchList = async () => {
    const response = await getStudios();

    return response || [];
  };

  const { data, isLoading } = useQuery(['order-status-studio-list'], fetchList);

  const onDetail = (item) => {
    navigation(`/pages/order-status/${item?.id}`);
  };

  return (
    <React.Fragment>
      <DataTableHeader title="예약현황" subTitle="장소를 선택해주세요." />

      <ProductStudioList data={data || []} onClick={onDetail} isLoading={isLoading} />
    </React.Fragment>
  );
};

export default OrderStatusPage;
