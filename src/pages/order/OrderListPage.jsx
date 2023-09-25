import React, { useState } from 'react';

import { useInfiniteQuery } from 'react-query';
import ReservationService from '../../services/ReservationService';

import { EXEL_HEADER, FILTER, LIST_HEADER } from './OrderListPage.option';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import DataListTable from '../../components/dataTable/DataListTable';
import OrderCancelModal from './OrderCancelModal';

const OrderListPage = () => {
  const [detail, setDetail] = useState({});
  const [searchFilter, setSearchFilter] = useState({ value: '', filter: 'basic' });

  const fetchList = async (cursor) => {
    let res = {};

    if (searchFilter?.filter === 'basic') {
      res = await ReservationService.getReservation(cursor?.pageParam || '', searchFilter?.value);
    } else {
      res = await ReservationService.getOldReservation(cursor?.pageParam || '', searchFilter?.value);
    }

    const list = res?.value?.sort((a, b) => a?.createdAt - b?.createdAt);

    return {
      result: list || [],
      nextPage: res?.cursor,
      isLast: res?.cursor ? false : true,
    };
  };

  const { data, isLoading, refetch, isRefetching, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['order-complete-list', searchFilter?.filter],
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
        doFilter={(e) => doSearch('filter', e)}
        doClear={doClear}
        filter={FILTER}
        title="예약내역"
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
        onExcelListApi={() => ReservationService.getReservationAll(searchFilter?.filter)}
      />

      <OrderCancelModal data={detail} isOpen={detail?.id} onClose={() => setDetail({})} refresh={refetch} />
    </React.Fragment>
  );
};

export default OrderListPage;
