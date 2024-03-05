import { Pass } from '@/entities/pass';
import React from 'react';

type Props = {
  pass: Pass;
};

const PassItem = ({ pass }: Props) => {
  return <div>{pass.title}</div>;
};

export default PassItem;
