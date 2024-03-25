import React from 'react';

import { APP_URL } from '../../constants/config';

import { GoLinkExternal } from 'react-icons/go';
import { smLayout } from '../../styles/VariablesStyles';

import styled from 'styled-components';

type Props = {
  title: string;
  subTitle?: string;
  link?: string;
  onClickTitle?: () => void;
};

const ProductShellTitle = ({ title, subTitle, link, onClickTitle }: Props) => {
  const onClickGoDataDetail = () => {
    window.open(`${APP_URL}/class/${link}`);
  };

  const handleTitleClick = () => {
    if (onClickTitle) {
      onClickTitle();
    }
  };

  return (
    <SProductShellTitle>
      <div className="title" onClick={handleTitleClick}>
        {title}
      </div>

      {subTitle && <div className="subTitle">{subTitle}</div>}

      {link && (
        <button className="link-button" onClick={onClickGoDataDetail}>
          <GoLinkExternal />
        </button>
      )}
    </SProductShellTitle>
  );
};

export default ProductShellTitle;

export const SProductShellTitle = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;

  ${smLayout} {
    flex-wrap: wrap;
    font-size: 1.1rem;
  }

  .subTitle {
    &::before {
      content: '';

      display: inline-block;
      margin: 0 15px 0 10px;

      width: 5px;
      height: 5px;

      top: -2px;
      position: relative;

      border-top: 1px solid #000000;
      border-right: 1px solid #000000;

      transform: rotate(45deg);
    }
  }

  .link-button {
    padding: 0 5px;

    display: inline-flex;
    align-items: center;

    opacity: 1;
    transition: opacity 0.3s;

    &:hover {
      opacity: 0.5;
    }
  }
`;
