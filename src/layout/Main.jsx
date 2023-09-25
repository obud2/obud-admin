import React from 'react';

import { SMain } from './Main.styled';

const Main = (props) => {
  const { open } = props;

  return <SMain open={open}>{props.children}</SMain>;
};

export default Main;
