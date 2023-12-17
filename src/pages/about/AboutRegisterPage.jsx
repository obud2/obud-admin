import React, { useState } from 'react';

import { useQuery } from 'react-query';
import { EXEL_HEADER, FILTER, LIST_HEADER } from './AboutRegisterPage.option';

import AboutService from '../../services/AboutService';

import DataTableHeader, { dataFilter, tabFilter } from '../../components/dataTable/DataTableHeader';
import DataListTable from '../../components/dataTable/DataListTable';
import AboutRegisterDetail from './AboutRegisterDetail';

const AboutRegisterPage = () => {
  const [searchFilter, setSearchFilter] = useState({ value: '', filter: '' });
  const [detailId, setDetailId] = useState('');

  const fetchList = async () => {
    const response = await AboutService.getListByType('register');

    let list = await dataFilter(searchFilter?.value, response, 'representative');
    list = await tabFilter(searchFilter?.filter, list, 'process');

    return list || [];
  };

  const { data, isLoading, refetch, isRefetching } = useQuery(['support-about-list'], fetchList);

  const doSearch = async (type, e) => {
    await setSearchFilter((prev) => ({ ...prev, [type]: e }));
    refetch();
  };

  const doClear = async () => {
    await setSearchFilter({ value: '', filter: '' });
    refetch();
  };

  const onDetail = (item) => {
    setDetailId({ id: item?.id });
  };

  const onDetailClose = (refresh) => {
    if (refresh) refetch();

    setDetailId('');
  };

  return (
    <React.Fragment>
      <DataTableHeader
        refresh={refetch}
        doSearch={(e) => doSearch('value', e)}
        doFilter={(e) => doSearch('filter', e)}
        doClear={doClear}
        filter={FILTER}
        title="입점 문의"
        searchPlaceholder="이름 검색"
        isLoading={isLoading || isRefetching}
      />

      <DataListTable
        data={data || []}
        header={LIST_HEADER}
        onClick={onDetail}
        isFilterData={searchFilter?.length > 0 ? true : false}
        isLoading={isLoading || isRefetching}
        sorted={false}
        excel={true}
        excelCols={EXEL_HEADER}
        onExcelListApi={() => AboutService.getListByType('register')}
      />

      <AboutRegisterDetail
        id={detailId?.id || ''}
        open={detailId}
        onClose={() => onDetailClose(false)}
        refresh={() => onDetailClose(true)}
      />
    </React.Fragment>
  );
};

export default AboutRegisterPage;
