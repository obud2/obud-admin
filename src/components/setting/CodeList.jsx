import React from 'react';

import { SCodeList } from './CodeList.styled';
import swal from 'sweetalert';

import { RxDragHandleVertical } from 'react-icons/rx';
import { ReactSortable } from 'react-sortablejs';

const HEADER = ['', '항목', '설정'];

const CodeList = ({ list, onClickEdit, onChange, isLoading }) => {
  const onClickDeleteCode = (i) => {
    swal({
      title: '삭제하시겠습니까?',
      text: '삭제 후 복구가 불가능합니다.',
      buttons: true,
      icon: 'warning',
    }).then((willDelete) => {
      if (willDelete) {
        const temp = [...list];

        temp?.splice(i, 1);

        onChange(temp);
      }
    });
  };

  return (
    <SCodeList>
      {isLoading && <div className="code-list-isLoading" />}

      <ul className="code-list-header">
        {HEADER?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <ReactSortable
        className="code-list-container"
        list={list}
        setList={onChange}
        animation={200}
        delayOnTouchStart={true}
        delay={1}
        handle=".code-list-item-drag-button"
      >
        {list && list?.length > 0 ? (
          list?.map((item, i) => (
            <ul key={item?.title} className="code-list-item">
              <li className="code-list-item-drag-button">
                <RxDragHandleVertical />
              </li>
              <li>{item?.title}</li>
              <li>
                <button className="edit-btn" onClick={() => onClickEdit(item?.type, item)} disabled={item?.disabled}>
                  수정
                </button>
                <button className="delete-btn" onClick={() => onClickDeleteCode(i)} disabled={item?.disabled}>
                  삭제
                </button>
              </li>
            </ul>
          ))
        ) : (
          <div className="empty-list">등록된 항목이 존재하지 않습니다.</div>
        )}
      </ReactSortable>
    </SCodeList>
  );
};

export default CodeList;
