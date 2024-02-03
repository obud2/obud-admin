import React, { useContext, useState } from 'react';

import { UserContext } from '../../context/UserContext';

import { useQuery } from 'react-query';
import ProductService from '../../services/ProductService';

import { FILTER } from './ProductListPage.option';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import ProductStudioList from '../../components/product/ProductStudioList';

import ProductStudioDetail from './detail/ProductStudioDetail';

/**
 *
 * @returns 공간(Studio) 페이지
 */
const ProductListPage = () => {
  const { isAdmin } = useContext(UserContext);

  const [detailId, setDetailId] = useState('');

  const [isSortLoading, setIsSortLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState({ value: '', filter: '' });

  const fetchList = async () => {
    let response = await ProductService.getStudios(searchFilter?.value);

    if (searchFilter?.filter === 'show') {
      response = response.filter((a) => a?.isShow);
    } else if (searchFilter?.filter === 'hide') {
      response = response.filter((a) => !a?.isShow);
    }

    return response || [];
  };

  const { data, isLoading, refetch, isRefetching } = useQuery(['product-studio-list'], fetchList);

  const doSearch = async (type, e) => {
    await setSearchFilter((prev) => ({ ...prev, [type]: e }));
    refetch();
  };

  const onSort = async (id, after, before) => {
    const param = {
      id: id,
      after: after?.sortOrder,
      before: before?.sortOrder,
    };

    setIsSortLoading(true);
    await ProductService.sortStudio(param);
    await setIsSortLoading(false);
    refetch();
  };

  const onDetail = (item) => {
    setDetailId({ id: item?.id || 'new' });
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
        doSearch={(e) => doSearch('value', e)}
        doFilter={(e) => doSearch('filter', e)}
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

      <ProductStudioDetail
        id={detailId?.id || ''}
        open={detailId}
        onClose={() => onDetailClose(false)}
        refresh={() => onDetailClose(true)}
      />
    </React.Fragment>
  );
};

export default ProductListPage;
