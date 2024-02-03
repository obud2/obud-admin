// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useContext, useState } from 'react';

import { UserContext } from '../../context/UserContext';

import { useQuery } from 'react-query';

import { FILTER } from './ProductListPage.option';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import ProductStudioList from '../../components/product/ProductStudioList';

import ProductStudioDetail from './detail/ProductStudioDetail';
import { getStudios, sortStudio } from '@/services/PlaceService';

/**
 *
 * @returns 공간(Studio) 페이지
 */
const PlaceListPage = () => {
  const { isAdmin } = useContext(UserContext);

  const [detailId, setDetailId] = useState('');

  const [isSortLoading, setIsSortLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState({ value: '', filter: '' });

  const fetchList = async () => {
    let response = await getStudios(searchFilter.value);

    if (searchFilter.filter === 'show') {
      response = response.filter((a) => a?.isShow);
    } else if (searchFilter.filter === 'hide') {
      response = response.filter((a) => !a?.isShow);
    }

    return response || [];
  };

  const { data, isLoading, refetch, isRefetching } = useQuery(['product-studio-list'], fetchList);

  const doSearch = async (type: 'value' | 'filter', value: string) => {
    await setSearchFilter((prev) => ({ ...prev, [type]: value }));
    refetch();
  };

  const onSort = async (id: string, after: number, before: number) => {
    const param = {
      id,
      after: after?.sortOrder,
      before: before?.sortOrder,
    };

    setIsSortLoading(true);
    await sortStudio(param);
    await setIsSortLoading(false);
    refetch();
  };

  const onDetail = (item) => {
    setDetailId(item?.id || 'new');
  };

  const onDetailClose = (refresh) => {
    if (refresh) refetch();

    setDetailId('');
  };

  const isAllLoading = isLoading || isRefetching || isSortLoading;

  return (
    <React.Fragment>
      <DataTableHeader
        refresh={refetch}
        doSearch={(v) => doSearch('value', v)}
        doFilter={(v) => doSearch('filter', v)}
        resister={{ text: '장소 신규등록', onClick: () => onDetail() }}
        title="장소별 프로그램/스케줄 관리"
        filter={FILTER}
        searchPlaceholder="장소명으로 검색하세요."
        isLoading={isAllLoading}
      />

      <ProductStudioList
        option
        data={data || []}
        onDetail={onDetail}
        sorted={!searchFilter?.value && !searchFilter?.filter && isAdmin}
        sortApi={onSort}
        isLoading={isLoading}
        refetch={refetch}
      />

      <ProductStudioDetail id={detailId} open={!!detailId} onClose={() => onDetailClose(false)} refresh={() => onDetailClose(true)} />
    </React.Fragment>
  );
};

export default PlaceListPage;
