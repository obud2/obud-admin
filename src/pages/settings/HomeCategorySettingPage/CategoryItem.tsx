import { StudioCategory } from '@/entities/place';
import { Button } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import CategoryEditModal from './CategoryEditModal';

type Props = {
  categoryId: number;
  category: StudioCategory;
};

const CategoryItem = ({ categoryId, category }: Props) => {
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <SCategoryItem>
      <div>{category}</div>
      <div className="action-container">
        <Button onClick={() => setEditModalOpen(true)}>수정</Button>
      </div>
      <CategoryEditModal categoryId={categoryId} category={category} open={editModalOpen} onClose={() => setEditModalOpen(false)} />
    </SCategoryItem>
  );
};

export default CategoryItem;

const SCategoryItem = styled.div`
  position: relative;
  padding: 24px;
  background-color: #ffffff;
  margin-bottom: 10px;
  border-radius: 8px;

  font-size: 1.6rem;
  font-weight: bold;
  color: ${(props) => props.theme.mainColor};
  width:;

  .action-container {
    font-size: 1.2rem;
    margin-top: 12px;
    text-align: right;
  }
`;
