import React from 'react';

import { SScrollAction } from './Scroll.styled';

import ScrollTopBtn from './ScrollTopBtn';

const ScrollAction = ({ scrollBtn }) => {
  return (
    <SScrollAction>
      <ScrollTopBtn active={scrollBtn} />
    </SScrollAction>
  );
};

export default React.memo(ScrollAction);
