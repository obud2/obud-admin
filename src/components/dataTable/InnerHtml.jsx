import React from 'react';
import { SInnerHtml } from './InnerHtml.styled';

const InnerHtml = ({ value }) => {
  return <SInnerHtml dangerouslySetInnerHTML={{ __html: value || '' }} />;
};

export default InnerHtml;
