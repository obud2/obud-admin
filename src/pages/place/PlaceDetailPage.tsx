import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQuery } from 'react-query';

import { LIST_HEADER, EXEL_HEADER } from './ProductStudio.option';

import ProductShellTitle from './ProductStudio';
import ProductClassDetailModal from './detail/ProductClassDetailModal';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import DataListTable from '../../components/dataTable/DataListTable';
import swal from 'sweetalert';
import { getStudio } from '@/services/PlaceService';
import { cloneProgram, deleteProgram, getPrograms, getProgramsAll, sortProgram } from '@/services/ProgramService';
import { Program } from '@/entities/program';

const PlaceDetailPage = () => {
  const navigation = useNavigate();

  const { placeId } = useParams();

  const [detailId, setDetailId] = useState('');
  const [searchFilter, setSearchFilter] = useState({ value: '', filter: '' });
  const [isSortLoading, setIsSortLoading] = useState(false);

  const { data: studio } = useQuery(['product-studio-detail', placeId], () => getStudio(placeId!), {
    enabled: !!placeId,
  });

  const fetchData = async (id: string) => {
    const res = await getPrograms(id, searchFilter?.value || '');

    return searchFilter?.filter ? res.filter((a) => a.lessonType === searchFilter.filter) : res;
  };

  const { data, isLoading, refetch, isRefetching } = useQuery(['product-studio-lesson-list', { placeId }], () => fetchData(placeId!), {
    enabled: !!placeId,
  });

  const doSearch = async (type: 'value' | 'filter', e: string) => {
    await setSearchFilter((prev) => ({ ...prev, [type]: e }));
    refetch();
  };

  const onDetail = (item?: { id: string }) => {
    if (!item) {
      return setDetailId('new');
    }
    navigation(`/pages/places/${placeId}/programs/${item.id}`);
  };

  const onSort = async (borderId: string, after: { sortOrder: number }, before: { sortOrder: number }) => {
    const param = {
      id: borderId,
      studiosId: placeId,
      after: after?.sortOrder,
      before: before?.sortOrder,
    };

    setIsSortLoading(true);
    await sortProgram(param);
    await setIsSortLoading(false);
    refetch();
  };

  const onClone = (id: string) => {
    swal({
      title: '프로그램을 복제하시겠습니까?',
      text: '',
      buttons: [true, true],
      icon: 'info',
    }).then(async (willDelete) => {
      if (willDelete) {
        await cloneProgram(id);
        refetch();
      }
    });
  };

  const onDelete = async (id: string) => {
    swal({
      title: '프로그램을 삭제하시겠습니까?',
      text: '',
      buttons: [true, true],
      icon: 'warning',
    }).then(async (willDelete) => {
      if (willDelete) {
        await deleteProgram(id);
        refetch();
      }
    });
  };

  const onLessonDetail = (data: Program) => {
    navigation(`/pages/places/${data.studiosId || ''}/programs/${data.id || ''}/schedules`);
  };

  const useOption = [
    { label: '프로그램 수정', onClick: (e: string, data: Program) => onDetail(data) },
    { label: '프로그램 복제', onClick: (e: string) => onClone(e) },
    { label: '프로그램 삭제', onClick: (e: string) => onDelete(e) },
    { label: '스케줄 목록', onClick: (e: string, data: Program) => onLessonDetail(data) },
  ];

  const onDetailClose = (refresh: boolean) => {
    if (refresh) refetch();

    setDetailId('');
  };

  const isAllLoading = isLoading || isRefetching || isSortLoading;

  return (
    <React.Fragment>
      <DataTableHeader
        doSearch={(e) => doSearch('value', e)}
        doFilter={(e) => doSearch('filter', e)}
        register={{ text: '프로그램 등록', onClick: () => onDetail() }}
        title={<ProductShellTitle title={studio?.title || ''} link={studio?.id || ''} subTitle={undefined} />}
        searchPlaceholder="프로그램명으로 검색하세요."
        isLoading={isAllLoading}
      />

      <DataListTable
        data={data || []}
        header={LIST_HEADER}
        onClick={onDetail}
        isLoading={isAllLoading}
        sorted={!searchFilter?.value && !searchFilter?.filter}
        sortApi={onSort}
        excel
        useDetail={false}
        useOption={useOption}
        excelCols={EXEL_HEADER}
        onExcelListApi={() => getProgramsAll(placeId)}
        fetchNextPage={refetch}
        isFetchingNextPage={isRefetching}
      />

      <ProductClassDetailModal
        id={detailId || ''}
        studiosId={placeId}
        open={detailId}
        onClose={() => onDetailClose(false)}
        refresh={() => onDetailClose(true)}
      />
    </React.Fragment>
  );
};

export default PlaceDetailPage;
