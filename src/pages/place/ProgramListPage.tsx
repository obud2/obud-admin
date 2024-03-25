import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import ProductShellTitle from './ProductShellTitle';
import ProductClassDetailModal from './detail/ProductClassDetailModal';
import ProductStudioItem from '@/components/product/ProductStudioItem';

import DataTableHeader from '../../components/dataTable/DataTableHeader';

import { APP_URL } from '../../constants/config';

import swal from 'sweetalert';
import { getStudio } from '@/services/PlaceService';
import { cloneProgram, deleteProgram, programService, sortProgram } from '@/services/ProgramService';
import { Program } from '@/entities/program';
import FloatingBtn from '@/components/common/floatingBtn/FloatingBtn';
import { xlLayout, smLayout } from '../../styles/VariablesStyles';

import styled from 'styled-components';

import { ReactSortable } from 'react-sortablejs';
import { Spin } from 'antd';

const ProgramListPage = () => {
  const navigation = useNavigate();

  const { placeId } = useParams();

  const [detailId, setDetailId] = useState('');
  const [isSortLoading, setIsSortLoading] = useState(false);
  const [sortedPrograms, setSortedPrograms] = useState<Program[]>([]);

  const { data: place } = useQuery(['product-studio-detail', placeId], () => getStudio(placeId!), {
    enabled: !!placeId,
  });

  const fetchData = async (id: string) => {
    const res = await programService.listPrograms({ placeId: id });
    return res;
  };

  const {
    data: programs,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery(['product-studio-lesson-list', { placeId }], () => fetchData(placeId!), {
    enabled: !!placeId,
  });

  useEffect(() => {
    if (programs) {
      setSortedPrograms(programs);
    }
  }, [programs]);

  const setList = (e: Program[]) => {
    setSortedPrograms(e);
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

  const onProgramDetail = (data: Program) => {
    navigation(`/pages/places/${data.studiosId || ''}/programs/${data.id || ''}`);
  };

  const useOption = [
    { label: '프로그램 수정', onClick: (e: string, data: Program) => onDetail(data) },
    { label: '프로그램 복제', onClick: (e: string) => onClone(e) },
    { label: '프로그램 삭제', onClick: (e: string) => onDelete(e) },
    { label: '스케줄 목록', onClick: (e: string, data: Program) => onProgramDetail(data) },
  ];

  const onDetailClose = (refresh: boolean) => {
    if (refresh) refetch();

    setDetailId('');
  };

  const onEnd = async (e: any) => {
    const newDraggableIndex = e.newDraggableIndex;
    const oldDraggableIndex = e.oldDraggableIndex;

    const newItem = sortedPrograms[newDraggableIndex];
    const newIndex = newDraggableIndex;

    const oldItem = sortedPrograms[oldDraggableIndex];
    const oldIndex = oldDraggableIndex;

    if (newItem?.id !== oldItem?.id) {
      onSort(oldItem?.id, sortedPrograms[newIndex], sortedPrograms[oldIndex]);
    }
  };

  const onClickLink = (data: Program) => {
    window.open(`${APP_URL}/lesson/${data.id}`);
  };

  const isAllLoading = isLoading || isRefetching || isSortLoading;

  return (
    <React.Fragment>
      <DataTableHeader title={<ProductShellTitle title={place?.title || ''} link={place?.id || ''} />} isLoading={isAllLoading} />
      <SProgramList>
        {isAllLoading ? (
          <div className="product-loading-container">
            <Spin />
          </div>
        ) : (
          <ReactSortable
            className="product-shell-list-container"
            list={sortedPrograms}
            onEnd={onEnd}
            setList={setList}
            animation={200}
            delayOnTouchStart
            delay={1}
            handle=".product-shell-item-drag-button"
          >
            {sortedPrograms && sortedPrograms.length > 0 ? (
              sortedPrograms.map((item) => (
                <ProductStudioItem
                  key={item?.id}
                  data={item || {}}
                  sorted={true}
                  onClick={onProgramDetail}
                  useOption={useOption}
                  onClickLink={onClickLink}
                />
              ))
            ) : (
              <div className="empty-list">등록된 항목이 존재하지 않습니다.</div>
            )}
          </ReactSortable>
        )}
      </SProgramList>
      <ProductClassDetailModal
        id={detailId || ''}
        studiosId={placeId}
        open={detailId}
        onClose={() => onDetailClose(false)}
        refresh={() => onDetailClose(true)}
      />

      <FloatingBtn onClick={() => onDetail()} />
    </React.Fragment>
  );
};

export default ProgramListPage;

export const SProgramList = styled.article`
  width: 100%;
  padding: 25px 0;

  .product-loading-container {
    width: 100%;
    min-height: 450px;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .product-shell-list-container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);

    gap: 10.5px;

    ${xlLayout} {
      grid-template-columns: repeat(4, 1fr) !important;
    }

    ${smLayout} {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .empty-list {
    font-size: 1.4rem;
    color: #555555;
  }
`;
