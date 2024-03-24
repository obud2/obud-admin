import React, { useEffect, useRef, useState } from 'react';

import { setCreatedAt } from '../../constants/config';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RxDragHandleDots1 } from 'react-icons/rx';

import { SProductStudioItem } from './ProductStudioItem.styled';
import { GoLinkExternal } from 'react-icons/go';

const ProductStudioItem = ({ data, sorted, onClick, useOption, onClickLink }) => {
  const handleOnClickLink = () => {
    if (onClickLink) {
      onClickLink(data);
    }
  };

  return (
    <SProductStudioItem className="sorted-product-shell">
      <div className="product-shell-item-image-container">
        <img
          className="product-shell-item-images"
          src={data?.images?.[0]?.url || ''}
          alt={data?.title}
          onError={(e) => {
            e.target.src = '/img/noImg.png';
          }}
          onClick={() => onClick(data)}
        />

        {sorted && <ProductShellDragButton />}

        {useOption && <ProductShellItemOption data={data} useOption={useOption} />}
      </div>

      <div className="product-shell-item-contents-container">
        <p className="product-shell-item-createdAt">{setCreatedAt(data?.createdAt || '', '-')}</p>
        <p className="product-shell-item-title" onClick={() => onClick(data)}>
          {data?.title || ''}
        </p>
        <p className="product-shell-item-title">{onClickLink && <GoLinkExternal onClick={handleOnClickLink} />}</p>
        <div className={`product-shell-item-isShow ${data?.isShow ? 'point-text' : 'disabled-text'}`}>
          {data?.isShow ? '게시중' : '숨김'}
        </div>
      </div>
    </SProductStudioItem>
  );
};

const ProductShellDragButton = () => {
  return (
    <button className="product-shell-item-drag-button">
      <RxDragHandleDots1 />
    </button>
  );
};

const ProductShellItemOption = ({ data, useOption }) => {
  const optionRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closeOption = (e) => {
      if (isOpen && !optionRef.current?.contains(e.target)) setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener('click', closeOption);
    }

    return () => window.removeEventListener('click', closeOption);
  }, [isOpen]);

  const onClickToggleOption = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="product-shell-item-option-container" ref={optionRef}>
      <button className="product-shell-item-option-button" onClick={onClickToggleOption}>
        <BsThreeDotsVertical />
      </button>

      <ul className={`product-shell-item-option ${isOpen ? 'active' : ''}`}>
        {useOption?.map((option) => (
          <li
            key={option.label}
            className="option-item"
            onClick={() => {
              option?.onClick(data?.id, data) || '';
              setIsOpen(false);
            }}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductStudioItem;
