// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQuery, useInfiniteQuery } from 'react-query';

import { LIST_HEADER, EXEL_HEADER } from './ProductStudio.option';

import ProductShellTitle from './ProductStudio';
import ProductClassDetail from './detail/ProductClassDetail';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import DataListTable from '../../components/dataTable/DataListTable';
import swal from 'sweetalert';
import { sortLesson, cloneLesson, getStudio, deleteLesson, getLessons, getLessonsAll } from '@/services/PlaceService';

const PlaceDetailPage = () => {
  const navigation = useNavigate();

  const { id } = useParams();

  const [detailId, setDetailId] = useState('');
  const [searchFilter, setSearchFilter] = useState({ value: '', filter: '' });
  const [isSortLoading, setIsSortLoading] = useState(false);

  const { data: studio } = useQuery(['product-studio-detail', id], () => getStudio(id));

  const fetchData = async (cursor) => {
    const res = await getLessons(id, cursor?.pageParam, searchFilter?.value || '');

    if (searchFilter?.filter) {
      res.value = res?.value.filter((a) => a?.lessonType === searchFilter?.filter);
    }

    return {
      result: res?.value || [],
      nextPage: res?.cursor,
      isLast: !res?.cursor,
    };
  };

  const { data, isLoading, refetch, isRefetching, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['product-studio-lesson-list', id],
    fetchData,
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

  const onDetail = (item) => {
    setDetailId({ id: item?.id || 'new' });
  };

  const onSort = async (borderId, after, before) => {
    const param = {
      id: borderId,
      studiosId: id,
      after: after?.sortOrder,
      before: before?.sortOrder,
    };

    setIsSortLoading(true);
    await sortLesson(param);
    await setIsSortLoading(false);
    refetch();
  };

  const onClone = (id: string) => {
    swal({
      title: '상품을 복제하시겠습니까?',
      text: '',
      buttons: true,
      icon: 'info',
    }).then(async (willDelete) => {
      if (willDelete) {
        await cloneLesson(id);
        refetch();
      }
    });
  };

  const onDelete = async (id: string) => {
    swal({
      title: '상품을 삭제하시겠습니까?',
      text: '',
      buttons: true,
      icon: 'warning',
    }).then(async (willDelete) => {
      if (willDelete) {
        await deleteLesson(id);
        refetch();
      }
    });
  };

  const onLessonDetail = (data) => {
    navigation(`/pages/places/${data?.studiosId || ''}/programs/${data?.id || ''}`);
  };

  const useOption = [
    { label: '프로그램 수정', onClick: (e, data) => onDetail(data) },
    { label: '프로그램 복제', onClick: (e) => onClone(e) },
    { label: '프로그램 삭제', onClick: (e) => onDelete(e) },
    { label: '스케줄 목록', onClick: (e, data) => onLessonDetail(data) },
  ];

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
        resister={{ text: '프로그램 등록', onClick: () => onDetail() }}
        title={<ProductShellTitle title={studio?.title || ''} link={studio?.id || ''} />}
        searchPlaceholder="프로그램명으로 검색하세요."
        isLoading={isAllLoading}
      />

      <DataListTable
        data={data || []}
        header={LIST_HEADER}
        onClick={onDetail}
        isFilterData={searchFilter?.length > 0}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isAllLoading}
        sorted={!searchFilter?.value && !searchFilter?.filter}
        sortApi={onSort}
        excel
        useDetail={false}
        useOption={useOption}
        excelCols={EXEL_HEADER}
        onExcelListApi={() => getLessonsAll(id)}
      />

      <ProductClassDetail
        id={detailId?.id || ''}
        studiosId={id}
        open={detailId}
        onClose={() => onDetailClose(false)}
        refresh={() => onDetailClose(true)}
      />
    </React.Fragment>
  );
};

export default PlaceDetailPage;
