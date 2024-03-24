// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useContext, useState, useEffect } from 'react';

import { UserContext } from '../../context/UserContext';

import { useQuery } from 'react-query';

import { FILTER } from './SpecialListPage.option';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import ProductStudioItem from '@/components/product/ProductStudioItem';

import styled from 'styled-components';
import { xlLayout, smLayout } from '../../styles/VariablesStyles';

import { getSpecialList, sortSpecial } from '@/services/PlaceService.ts';
import { Program } from '@/entities/program';
import { useNavigate } from 'react-router-dom';

import { ReactSortable } from 'react-sortablejs';

import { Spin } from 'antd';

/**
 *
 * @returns 스페셜리스트 페이지
 */

const SpecialListPage = () => {
  const { isAdmin } = useContext(UserContext);

  const [isSortLoading, setIsSortLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState({ value: '', filter: '' });
  const [sortedSpecialPrograms, setSortedSpecialPrograms] = useState([]);

  const navigation = useNavigate();

  const fetchList = async () => {
    let response = await getSpecialList(searchFilter?.value);

    if (searchFilter?.filter === 'show') {
      response = response.filter((a) => a?.isShow);
    } else if (searchFilter?.filter === 'hide') {
      response = response.filter((a) => !a?.isShow);
    }

    return response || [];
  };

  const { data: specialPrograms, isLoading, refetch, isRefetching } = useQuery(['product-special-list'], fetchList);

  useEffect(() => {
    if (specialPrograms) {
      setSortedSpecialPrograms(specialPrograms);
    }
  }, [specialPrograms]);

  const setList = (e: Program[]) => {
    setSortedSpecialPrograms(e);
  };

  const doSearch = async (type, e) => {
    await setSearchFilter((prev) => ({ ...prev, [type]: e }));
    refetch();
  };

  const onSort = async (id, after, before) => {
    const param = {
      id,
      before: before?.specialSort,
      after: after?.specialSort,
    };

    setIsSortLoading(true);
    await sortSpecial(param);
    await setIsSortLoading(false);
    refetch();
  };

  const onEnd = async (e) => {
    const newDraggableIndex = e.newDraggableIndex;
    const oldDraggableIndex = e.oldDraggableIndex;

    const newItem = sortedSpecialPrograms[newDraggableIndex];
    const newIndex = newDraggableIndex;

    const oldItem = sortedSpecialPrograms[oldDraggableIndex];
    const oldIndex = oldDraggableIndex;

    if (newItem?.id !== oldItem?.id && sortSpecial) {
      onSort(oldItem?.id, sortedSpecialPrograms[newIndex], sortedSpecialPrograms[oldIndex]);
    }
  };

  const onProgramDetail = (data) => {
    navigation(`/pages/places/${data?.studiosId}/programs/${data?.id}`);
  };

  const isAllLoading = isLoading || isRefetching || isSortLoading;

  return (
    <React.Fragment>
      <DataTableHeader
        refresh={refetch}
        doSearch={(e) => doSearch('value', e)}
        doFilter={(e) => doSearch('filter', e)}
        title="특별 프로그램 관리"
        filter={FILTER}
        searchPlaceholder="프로그램 명으로 검색하세요."
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
            list={sortedSpecialPrograms}
            onEnd={onEnd}
            setList={setList}
            animation={200}
            delayOnTouchStart
            delay={1}
            handle=".product-shell-item-drag-button"
          >
            {sortedSpecialPrograms && sortedSpecialPrograms.length > 0 ? (
              sortedSpecialPrograms.map((item) => (
                <ProductStudioItem
                  key={item?.id}
                  data={item || {}}
                  sorted={!searchFilter?.value && !searchFilter?.filter && isAdmin}
                  onClick={onProgramDetail}
                />
              ))
            ) : (
              <div className="empty-list">등록된 항목이 존재하지 않습니다.</div>
            )}
          </ReactSortable>
        )}
      </SPlaceList>
    </React.Fragment>
  );
};

export default SpecialListPage;

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
