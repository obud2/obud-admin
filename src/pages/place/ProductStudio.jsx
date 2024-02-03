import React from 'react';

import { APP_URL } from '../../constants/config';

import { GoLinkExternal } from 'react-icons/go';
import { SProductStudio } from './ProductStudio.styled';

const ProductStudio = ({ title, subTitle, link }) => {
  const onClickGoDataDetail = () => {
    window.open(`${APP_URL}/class/${link}`);
  };

  return (
    <SProductStudio>
      {title}

      {subTitle && <div className="subTitle">{subTitle}</div>}

      {link && (
        <button className="link-button" onClick={onClickGoDataDetail}>
          <GoLinkExternal />
        </button>
      )}
    </SProductStudio>
  );
};

export default ProductStudio;
