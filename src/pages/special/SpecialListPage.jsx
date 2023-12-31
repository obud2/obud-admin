import React, { useContext, useState } from 'react';

import { UserContext } from '../../context/UserContext';

import { useQuery } from 'react-query';
import ProductService from '../../services/ProductService';

import { FILTER } from './SpecialListPage.option';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import ProductStudioList from '../../components/product/ProductStudioList';

/**
 *
 * @returns 스페셜리스트 페이지
 */
const SpecialListPage = () => {
  const { isAdmin } = useContext(UserContext);

  const [isSortLoading, setIsSortLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState({ value: '', filter: '' });

  const fetchList = async () => {
    let response = await ProductService.getSpecialList(searchFilter?.value);

    if (searchFilter?.filter === 'show') {
      response = response.filter((a) => a?.isShow);
    } else if (searchFilter?.filter === 'hide') {
      response = response.filter((a) => !a?.isShow);
    }

    return response || [];
  };

  const { data, isLoading, refetch, isRefetching } = useQuery(['product-specail-list'], fetchList);

  const doSearch = async (type, e) => {
    await setSearchFilter((prev) => ({ ...prev, [type]: e }));
    refetch();
  };

  const onSort = async (id, after, before) => {
    const param = {
      id: id,
      before: before?.specialSort,
      after: after?.specialSort,
    };

    setIsSortLoading(true);
    await ProductService.sortSpecial(param);
    await setIsSortLoading(false);
    refetch();
  };

  const isAllLoading = isLoading || isRefetching || isSortLoading;

  return (
    <React.Fragment>
      <DataTableHeader
        refresh={refetch}
        doSearch={(e) => doSearch('value', e)}
        doFilter={(e) => doSearch('filter', e)}
        title="Special"
        filter={FILTER}
        searchPlaceholder="상품명으로 검색하세요."
        isLoading={isAllLoading}
      />

      <ProductStudioList
        data={data || []}
        sorted={!searchFilter?.value && !searchFilter?.filter && isAdmin}
        sortApi={onSort}
        isLoading={isLoading}
        refetch={refetch}
      />
    </React.Fragment>
  );
};

export default SpecialListPage;
