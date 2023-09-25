import React from 'react';

import { ErrorBoundary as Error } from 'react-error-boundary';

import { SErrorFallback } from './ErrorBoundary.styled';

const ErrorFallback = () => {
  return (
    <SErrorFallback>
      <h1>Data Error</h1>

      <p>데이터를 불러오는 중 오류가 발생하였습니다.</p>
    </SErrorFallback>
  );
};

const ErrorBoundary = ({ children }) => {
  return (
    <Error fallback={<ErrorFallback />} onError={(err, info) => console.log(info)}>
      {children}
    </Error>
  );
};

export default ErrorBoundary;
