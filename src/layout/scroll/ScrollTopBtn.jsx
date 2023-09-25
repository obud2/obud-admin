import React from 'react';

import { BiArrowToTop } from 'react-icons/bi';

import { SScrollTopBtn } from './Scroll.styled';

const ScrollTopBtn = ({ active }) => {
  const scrollTop = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <SScrollTopBtn onClick={scrollTop} active={active}>
      <BiArrowToTop />
    </SScrollTopBtn>
  );
};

export default React.memo(ScrollTopBtn);
