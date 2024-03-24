import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import { smLayout } from '@/styles/VariablesStyles';

type Props = {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

const FloatingBtn = ({ onClick, isLoading, disabled }: Props) => {
  return (
    <Container className="upload-button" onClick={onClick}>
      <Button
        disabled={isLoading}
        loading={isLoading}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: 'rgba(0, 0, 0, 0.2) 1px 1px 5px 1px',
          fontSize: '2.3rem',
        }}
      >
        +
      </Button>
    </Container>
  );
};

export default FloatingBtn;

const Container = styled.div`
  position: fixed;
  bottom: 9%;
  right: 2%;
`;
