import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQuery, useInfiniteQuery } from 'react-query';

import ProductService from '../../services/ProductService';

import { LIST_HEADER, FILTER, EXEL_HEADER } from './ProductStudio.option';

import ProductShellTitle from './ProductStudio';
import ProductClassDetail from './detail/ProductClassDetail';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import DataListTable from '../../components/dataTable/DataListTable';
import swal from 'sweetalert';

/**
 *
 * @returns 수업(Class) 페이지
 */
const ProductStudioPage = () => {
  const navigation = useNavigate();

  const { id } = useParams();

  const [detailId, setDetailId] = useState('');
  const [searchFilter, setSearchFilter] = useState({ value: '', filter: '' });
  const [isSortLoading, setIsSortLoading] = useState(false);

  const { data: studio } = useQuery(['product-studio-detail', id], () => ProductService?.getStudio(id));

  const fetchData = async (cursor) => {
    let res = await ProductService?.getLessons(id, cursor?.pageParam, searchFilter?.value || '');

    if (searchFilter?.filter) {
      res['value'] = res?.value.filter((a) => a?.lessonType === searchFilter?.filter);
    }

    return {
      result: res?.value || [],
      nextPage: res?.cursor,
      isLast: res?.cursor ? false : true,
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
    await ProductService.sortLesson(param);
    await setIsSortLoading(false);
    refetch();
  };

  const onClone = (id) => {
    swal({
      title: '상품을 복제하시겠습니까?',
      text: '',
      buttons: true,
      icon: 'info',
    }).then(async (willDelete) => {
      if (willDelete) {
        await ProductService?.cloneLesson(id);
        refetch();
      }
    });
  };

  const onDelete = async (id) => {
    swal({
      title: '상품을 삭제하시겠습니까?',
      text: '',
      buttons: true,
      icon: 'warning',
    }).then(async (willDelete) => {
      if (willDelete) {
        await ProductService?.deleteLesson(id);
        refetch();
      }
    });
  };

  const onLessonDetail = (data) => {
    navigation(`/pages/product/studio/${data?.studiosId || ''}/${data?.id || ''}`);
  };

  const useOption = [
    { label: '수정', onClick: (e, data) => onDetail(data) },
    { label: '복제', onClick: (e) => onClone(e) },
    { label: '삭제', onClick: (e) => onDelete(e) },
    { label: '일정목록', onClick: (e, data) => onLessonDetail(data) },
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
        resister={{ text: '수업등록', onClick: () => onDetail() }}
        filter={FILTER}
        title={<ProductShellTitle title={studio?.title || ''} link={studio?.id || ''} />}
        searchPlaceholder="수업명으로 검색하세요."
        isLoading={isAllLoading}
      />

      <DataListTable
        data={data || []}
        header={LIST_HEADER}
        onClick={onDetail}
        isFilterData={searchFilter?.length > 0 ? true : false}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isAllLoading}
        sorted={!searchFilter?.value && !searchFilter?.filter}
        sortApi={onSort}
        excel={true}
        useDetail={false}
        useOption={useOption}
        excelCols={EXEL_HEADER}
        onExcelListApi={() => ProductService?.getLessonsAll(id)}
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

export default ProductStudioPage;
