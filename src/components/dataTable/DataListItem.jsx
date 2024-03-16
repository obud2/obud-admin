import { useEffect, useRef, useState } from 'react';

import { Button } from 'antd';
import { SDataListItem } from './DataListItem.styled';

import { RxDragHandleDots1 } from 'react-icons/rx';
import { IoMdMore } from 'react-icons/io';

const DataListItem = ({ data, onClick, option, isLoading, isSelect, hideDetail, useDetail, useOption, sorted, detailTitle }) => {
  const optionRef = useRef();

  const [isOptionOpen, setIsOptionOpen] = useState(false);

  useEffect(() => {
    const closeOption = (e) => {
      if (isOptionOpen && !optionRef.current?.contains(e.target)) setIsOptionOpen(false);
    };

    if (isOptionOpen) {
      window.addEventListener('click', closeOption);
    }

    return () => window.removeEventListener('click', closeOption);
  }, [isOptionOpen]);

  return (
    <SDataListItem className={`${isLoading ? 'disabled' : ''} ${isSelect?.id && (isSelect?.id === data?.id ? 'select' : '')}`}>
      {sorted && <DataListDragButton />}

      {option?.map((o) => (
        <div className="data-list-field" key={`data-lite-item-${o?.label}`} style={{ flex: o?.flex || 1, width: o?.width || 'auto' }}>
          {o?.customBodyRender ? o?.customBodyRender(data[o?.id], data, onClick) : data[o?.id] || '-'}
        </div>
      ))}

      {useDetail && !hideDetail?.(data) && (
        <div className="data-list-field">
          <Button onClick={() => onClick(data)} disabled={isLoading}>
            {detailTitle ?? '상세'}
          </Button>
        </div>
      )}
      {useDetail && hideDetail?.(data) && <div className="data-list-field" style={{ width: '200px' }} />}

      {useOption?.length > 0 && (
        <div className="data-list-field">
          <button className="data-list-field-option" ref={optionRef} onClick={() => setIsOptionOpen(true)}>
            <IoMdMore />
          </button>

          {isOptionOpen && (
            <ul className="data-list-option-container">
              {useOption?.map((item) => (
                <li key={item?.label} className="data-list-option-item" onClick={() => item?.onClick(data?.id, data) || ''}>
                  {item?.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </SDataListItem>
  );
};

const DataListDragButton = () => {
  return (
    <button className="data-list-item-drag-button">
      <RxDragHandleDots1 />
    </button>
  );
};

export default DataListItem;
