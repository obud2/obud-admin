import React, { useState } from 'react';

import { useInfiniteQuery } from 'react-query';
import ReservationService from '../../services/ReservationService';

import { EXEL_HEADER, LIST_HEADER } from './OrderRefusalPage.option';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import DataListTable from '../../components/dataTable/DataListTable';
import OrderCancelModal from './OrderCancelModal_legacy';

const OrderRefusalPage = () => {
  const [detail, setDetail] = useState({});
  const [searchFilter, setSearchFilter] = useState({ value: '', filter: 'basic' });

  const fetchList = async (cursor) => {
    const res = await ReservationService.getRefusalReservation(cursor?.pageParam || '', searchFilter?.value);

    const list = res?.value?.sort((a, b) => a?.createdAt - b?.createdAt);

    return {
      result: list || [],
      nextPage: res?.cursor,
      isLast: res?.cursor ? false : true,
    };
  };

  const { data, isLoading, refetch, isRefetching, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['order-refusal-list', searchFilter?.filter],
    fetchList,
    {
      getNextPageParam: (lastPage) => {
        let result;
        if (!lastPage?.isLast) result = lastPage.nextPage;
        else result = undefined;
        return result;
      },
    },
  );

  const doSearch = async (type, e) => {
    await setSearchFilter((prev) => ({ ...prev, [type]: e }));
    refetch();
  };

  const doClear = async () => {
    await setSearchFilter({ value: '', filter: '' });
    refetch();
  };

  const onCancel = (item) => {
    setDetail(item);
  };

  const useOption = [{ label: '취소처리', onClick: (_, data) => onCancel(data) }];

  return (
    <React.Fragment>
      <DataTableHeader
        refresh={refetch}
        doSearch={(e) => doSearch('value', e)}
        doClear={doClear}
        title="거절내역"
        searchPlaceholder="주문번호 / 예약자명 검색"
        isLoading={isLoading || isRefetching}
      />

      <DataListTable
        data={data || []}
        header={LIST_HEADER}
        isFilterData={searchFilter?.length > 0 ? true : false}
        isLoading={isLoading || isRefetching}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        sorted={false}
        excel={true}
        excelCols={EXEL_HEADER}
        useDetail={false}
        useOption={useOption}
        onExcelListApi={() => ReservationService.getRefusalReservationAll()}
      />

      <OrderCancelModal data={detail} isOpen={detail?.id} onClose={() => setDetail({})} refresh={refetch} />
    </React.Fragment>
  );
};

export default OrderRefusalPage;
