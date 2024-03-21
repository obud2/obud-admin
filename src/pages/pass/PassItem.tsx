import { Pass } from '@/entities/pass';
import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { RxDragHandleDots1 } from 'react-icons/rx';

type Props = {
  pass: Pass;
  onDetail: (pass: Pass | null) => void;
};

const PassItem = ({ pass, onDetail }: Props) => {
  return (
    <Wrapper>
      <button className="item-drag-button">
        <RxDragHandleDots1 />
      </button>
      <Title>{pass.title}</Title>
      <Description>{pass.durationInDays}일</Description>
      <Price>{pass.price.toLocaleString()}원</Price>
      <ButtonWrapper>
        <Button size="small" type="primary" onClick={() => onDetail(pass)}>
          수정
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default PassItem;

const Wrapper = styled.div`
  position: relative;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  background: white;
  font-size: 14px;
`;

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const Description = styled.div``;

const Price = styled.div`
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
`;

const ButtonWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;
