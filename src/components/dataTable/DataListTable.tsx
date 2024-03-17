// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect } from 'react';

import { Spin } from 'antd';
import { SDataListTable } from './DataListTable.styled';

import FileDownload from '../fileDownload/FileDownload';

import DataListItem from './DataListItem';

import { ReactSortable } from 'react-sortablejs';
import InfiniteScrollAction from './InfiniteScrollAction';

/**
 *
 * @param {Array} data : 데이터 리스트 - useQuery , useInfiniteQuery 사용한 리스트 둘다 가능  { result : [] }
 * @param {Array} header : 데이터 표시 될 옵션값
 * @param {Event} onClick : 데이터 상세 버튼 클릭 이벤트
 * @param {boolean} useDetail : 데이터 상세 버튼 표시
 * @param {Array} useOption : 데이터 상세 버튼 옵션으로 추가 - [{ label : 수정, onClick: function() }]
 *
 * @param {boolean} isLoading : 데이터 호출 Loading
 *
 * @param {Event} fetchNextPage : limit 걸려있는 Api 호출 시 다음 페이지 호출 이벤트
 * @param {boolean} isFetchingNextPage : 다음 페이지 호출 체크 Loading
 *
 * @param {boolean} sorted : 정렬 on / off
 * @param {Promise} sortApi : 정렬 저장 API
 * @param {String} sortId : 정렬 Key
 *
 * @param {boolean} excel : 엑셀 다운 on / off
 * @param {Array} excelCols : 엑셀 노출 컬럼
 * @param {Promise} onExcelListApi : 전체 리스트 API
 *
 */
const DataListTable = ({
  data,
  header,
  onClick,
  useDetail = true,
  hideDetail,
  detailTitle,
  useOption,
  isLoading,
  fetchNextPage,
  isFetchingNextPage,
  excel,
  excelCols,
  onExcelListApi,
  sorted,
  sortApi,
  sortId = 'sortOrder',
}: {
  data: any;
  header: any;
  onClick: any;
  useDetail?: boolean;
  hideDetail?: (data: any) => boolean;
  detailTitle?: string; // 상세 버튼 타이틀
  useOption?: any;
  isLoading: boolean;
  fetchNextPage?: any;
  isFetchingNextPage?: boolean;
  excel?: boolean;
  excelCols?: any;
  onExcelListApi?: any;
  sorted?: boolean;
  sortApi?: any;
  sortId?: string;
}) => {
  const [select, setSelect] = useState('');
  const [datas, setDatas] = useState('');

  useEffect(() => {
    if (Array.isArray(data) || data?.pages) {
      const copyArr = [];

      if (data?.pages) {
        data?.pages?.forEach((page) =>
          page?.result?.forEach((a) => {
            copyArr.push(a);
          }),
        );
      } else {
        data?.forEach((a) => {
          copyArr.push(a);
        });
      }

      // if sortId field is not exist, then show data by given order
      copyArr?.sort((a, b) => (a?.[sortId] > b?.[sortId] ? -1 : 1));

      setDatas(copyArr);
    }
  }, [data]);

  const setList = (e) => {
    setDatas(e);
  };

  const onEnd = (e) => {
    const newDraggableIndex = e.newDraggableIndex;
    const oldDraggableIndex = e.oldDraggableIndex;

    const newItem = datas[newDraggableIndex];
    const newIndex = newDraggableIndex;

    const oldItem = datas[oldDraggableIndex];
    const oldIndex = oldDraggableIndex;

    if (newItem?.id !== oldItem?.id && sortApi) {
      sortApi(oldItem?.id, datas[newIndex], datas[oldIndex]);
    }
  };

  const onClickListItem = (data) => {
    setSelect(data);
    onClick(data);
  };

  const isSomeLoading = !isFetchingNextPage && isLoading;

  return (
    <SDataListTable>
      <div className="data-option-container">
        {/* 엑셀 다운로드 */}
        {excel && <FileDownload cols={excelCols} listApi={onExcelListApi} />}
      </div>

      {/* Data List Header 영역 */}
      <ul className="data-list-header">
        {header?.map((head) => (
          <li
            className="data-list-header-field"
            key={`data-list-${head?.label}`}
            style={{ flex: head?.flex || 1, width: head?.width || 'auto' }}
          >
            {head?.label}
          </li>
        ))}

        {useDetail && <li className="data-list-header-field" aria-label="상세 버튼을 위한 공백" />}
        {useOption && <li className="data-list-header-field" aria-label="상세 옵션버튼을 위한 공백" />}
      </ul>

      {/* 로딩 영역 */}
      {isSomeLoading && (
        <div className="data-list-loading">
          <Spin />
        </div>
      )}

      {/* Data List Body 영역 */}
      <InfiniteScrollAction data={data || []} fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage}>
        <ReactSortable
          className={`data-list-container ${isSomeLoading ? 'loading' : ''}`}
          onEnd={onEnd}
          list={datas}
          setList={setList}
          animation={200}
          delayOnTouchStart
          delay={1}
          handle=".data-list-item-drag-button"
        >
          {datas && datas?.length > 0
            ? datas.map((a, i) => (
                <DataListItem
                  key={`data-list-item-${a?.id || i}`}
                  data={a}
                  onClick={onClickListItem}
                  option={header}
                  dataList={datas}
                  setDatas={setDatas}
                  isLoading={isLoading}
                  isSelect={select}
                  sorted={sorted}
                  hideDetail={hideDetail}
                  detailTitle={detailTitle}
                  useDetail={useDetail}
                  useOption={useOption}
                />
              ))
            : !isSomeLoading && <p className="empty-list-item">조회 된 데이터가 없습니다.</p>}
        </ReactSortable>
      </InfiniteScrollAction>
    </SDataListTable>
  );
};

export default DataListTable;
