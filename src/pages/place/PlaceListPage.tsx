// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '@/context/UserContext.tsx';
import { useQuery } from 'react-query';

import { Place } from '@/entities/place';

import { FILTER } from './ProductListPage.option';
import DataTableHeader from '../../components/dataTable/DataTableHeader';
import PlaceDetail from './detail/PlaceDetail';
import ProductStudioItem from '@/components/product/ProductStudioItem';

import { useNavigate } from 'react-router-dom';

import { getStudios, sortStudio, cloneStudio, deleteStudio } from '@/services/PlaceService';
import FloatingBtn from '@/components/common/floatingBtn/FloatingBtn';

import styled from 'styled-components';
import { xlLayout, smLayout } from '../../styles/VariablesStyles';

import { ReactSortable } from 'react-sortablejs';

import { Spin } from 'antd';

const PlaceListPage = () => {
  const navigation = useNavigate();

  const { isAdmin } = useContext(UserContext);
  const [detailId, setDetailId] = useState('');
  const [isSortLoading, setIsSortLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState({ value: '', filter: '' });
  const [sortedPlaces, setSortedPlaces] = useState([]);

  const fetchList = async () => {
    let response = await getStudios(searchFilter.value);

    if (searchFilter.filter === 'show') {
      response = response.filter((a) => a?.isShow);
    } else if (searchFilter.filter === 'hide') {
      response = response.filter((a) => !a?.isShow);
    }

    return response || [];
  };

  const { data: places, isLoading, refetch, isRefetching } = useQuery(['product-studio-list'], fetchList);

  useEffect(() => {
    if (places) {
      setSortedPlaces(places);
    }
  }, [places]);

  const setList = (e: Place[]) => {
    setSortedPlaces(e);
  };

  const doSearch = async (type: 'value' | 'filter', value: string) => {
    await setSearchFilter((prev) => ({ ...prev, [type]: value }));
    refetch();
  };

  const onDetail = (item) => {
    setDetailId(item?.id || 'new');
  };

  const onDetailClose = (refresh) => {
    if (refresh) refetch();
    setDetailId('');
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

  const onEnd = async (e) => {
    const newDraggableIndex = e.newDraggableIndex;
    const oldDraggableIndex = e.oldDraggableIndex;

    const newItem = sortedPlaces[newDraggableIndex];
    const newIndex = newDraggableIndex;

    const oldItem = sortedPlaces[oldDraggableIndex];
    const oldIndex = oldDraggableIndex;

    if (newItem?.id !== oldItem?.id && sortStudio) {
      onSort(oldItem?.id, sortedPlaces[newIndex], sortedPlaces[oldIndex]);
    }
  };

  const onClone = (id: string) => {
    swal({
      title: '장소를 복제하시겠습니까?',
      text: '',
      buttons: [true, true],
      icon: 'info',
    }).then(async (willCopy) => {
      if (willCopy) {
        await cloneStudio(id);
        refetch();
      }
    });
  };

  const onDelete = async (id: string) => {
    swal({
      title: '장소를 삭제하시겠습니까?',
      text: '',
      buttons: [true, true],
      icon: 'warning',
    }).then(async (willDelete) => {
      if (willDelete) {
        await deleteStudio(id);
        refetch();
      }
    });
  };

  const onProgramList = (data) => {
    navigation(`/pages/places/${data?.id}`);
  };

  const useOption = [
    { label: '장소 수정', onClick: (e: string, data: Place) => onDetail(data) },
    { label: '장소 복제', onClick: (e: string) => onClone(e) },
    { label: '장소 삭제', onClick: (e: string) => onDelete(e) },
    { label: '프로그램 목록', onClick: (e: string, data: Place) => onProgramList(data) },
  ];

  const isAllLoading = isLoading || isRefetching || isSortLoading;

  return (
    <React.Fragment>
      <DataTableHeader
        refresh={refetch}
        doSearch={(v) => doSearch('value', v)}
        doFilter={(v) => doSearch('filter', v)}
        title="장소별 수업/일정 관리"
        filter={FILTER}
        searchPlaceholder="장소명으로 검색하세요."
        isLoading={isAllLoading}
      />
      <SPlaceList>
        {isAllLoading ? (
          <div className="product-loading-container">
            <Spin />
          </div>
        ) : (
          <ReactSortable
            className="product-shell-list-container"
            list={sortedPlaces}
            onEnd={onEnd}
            setList={setList}
            animation={200}
            delayOnTouchStart
            delay={1}
            handle=".product-shell-item-drag-button"
          >
            {sortedPlaces && sortedPlaces.length > 0 ? (
              sortedPlaces.map((item) => (
                <ProductStudioItem
                  key={item?.id}
                  data={item || {}}
                  sorted={!searchFilter?.value && !searchFilter?.filter && isAdmin}
                  onClick={onProgramList}
                  useOption={useOption}
                />
              ))
            ) : (
              <div className="empty-list">등록된 항목이 존재하지 않습니다.</div>
            )}
          </ReactSortable>
        )}
      </SPlaceList>

      <PlaceDetail id={detailId} open={!!detailId} onClose={() => onDetailClose(false)} refresh={() => onDetailClose(true)} />
      <FloatingBtn onClick={() => onDetail()} isLoading={isAllLoading} />
    </React.Fragment>
  );
};

export default PlaceListPage;

export const SPlaceList = styled.article`
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
