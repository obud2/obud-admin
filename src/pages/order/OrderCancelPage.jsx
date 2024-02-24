import React, { useState } from 'react';

import { useInfiniteQuery } from 'react-query';
import ReservationService from '../../services/ReservationService';

import { EXEL_HEADER, FILTER, LIST_HEADER } from './OrderCancelPage.option';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import DataListTable from '../../components/dataTable/DataListTable';
import OrderCancelModal from './OrderCancelModal';
import dayjs from 'dayjs';

const OrderCancelPage = () => {
  const [detail, setDetail] = useState({});
  const [searchFilter, setSearchFilter] = useState({ value: '', filter: 'canceled' });

  const fetchList = async (cursor) => {
    let res = {};

    if (searchFilter?.filter === 'basic') {
      res = await ReservationService.getCancelingReservation(cursor?.pageParam || '', searchFilter?.value);
    } else {
      res = await ReservationService.getCancelReservation(cursor?.pageParam || '', searchFilter?.value);
    }

    const list = res?.value?.sort((a, b) => dayjs(a?.cancelDate).diff(dayjs(b?.cancelDate)));

    return {
      result: list || [],
      nextPage: res?.cursor,
      isLast: !res?.cursor,
    };
  };

  const { data, isLoading, refetch, isRefetching, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['order-cancel-list', searchFilter?.filter],
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

  return (
    <React.Fragment>
      <DataTableHeader
        refresh={refetch}
        doSearch={(e) => doSearch('value', e)}
        doFilter={(e) => doSearch('filter', e)}
        doClear={doClear}
        filter={FILTER}
        title="취소내역"
        searchPlaceholder="주문번호 / 예약자명 검색"
        isLoading={isLoading || isRefetching}
      />

      <DataListTable
        data={data || []}
        header={LIST_HEADER}
        isFilterData={searchFilter?.length > 0}
        isLoading={isLoading || isRefetching}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        sorted={false}
        excel
        excelCols={EXEL_HEADER}
        useDetail={false}
        onExcelListApi={() => ReservationService.getCancelReservationAll(searchFilter?.filter)}
      />

      <OrderCancelModal data={detail} isOpen={detail?.id} onClose={() => setDetail({})} refresh={refetch} />
    </React.Fragment>
  );
};

export default OrderCancelPage;
