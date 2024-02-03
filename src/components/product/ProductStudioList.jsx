import React, { useEffect, useState } from 'react';

import { Spin } from 'antd';

import { SProductStudioList } from './ProductStudioList.styled';
import ProductStudioItem from './ProductStudioItem';

import { ReactSortable } from 'react-sortablejs';

const ProductStudioList = ({ data, isLoading, option, sorted, sortApi, onClick, onDetail, refetch }) => {
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    setDatas(data || []);
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

  return (
    <SProductStudioList>
      {isLoading && (
        <div className="product-loading-container">
          <Spin />
        </div>
      )}

      {!isLoading && (
        <ReactSortable
          className="product-shell-list-container"
          onEnd={onEnd}
          list={datas}
          setList={setList}
          animation={200}
          delayOnTouchStart
          delay={1}
          handle=".product-shell-item-drag-button"
        >
          {datas && datas.length > 0 ? (
            datas.map((item) => (
              <ProductStudioItem
                key={item?.id}
                data={item || {}}
                option={option}
                sorted={sorted}
                onClick={onClick}
                onDetail={onDetail}
                refetch={refetch}
              />
            ))
          ) : (
            <div className="empty-list">등록된 항목이 존재하지 않습니다.</div>
          )}
        </ReactSortable>
      )}
    </SProductStudioList>
  );
};

export default ProductStudioList;
