import DataTableHeader from "@/components/dataTable/DataTableHeader";
import { StudioCategory } from "@/entities/place";
import { ReactSortable } from "react-sortablejs";
import styled from "styled-components";
import CategoryItem from "./CategoryItem";

const CategoryItems = [
  {
    id: 1,
    name: StudioCategory.YOGA,
  },
  {
    id: 2,
    name: StudioCategory.TEA,
  },
  {
    id: 3,
    name: StudioCategory.MEDITATION,
  },
  {
    id: 4,
    name: StudioCategory.ETC,
  },
];

const HomeCategorySettingPage = () => {
  return (
    <div>
      <DataTableHeader title="홈 화면 카테고리 관리" />
      <ItemWrapper>
        {CategoryItems.map((item) => (
          <CategoryItem
            key={item.id}
            categoryId={item.id}
            category={item.name}
          />
        ))}
      </ItemWrapper>
    </div>
  );
};

export default HomeCategorySettingPage;

const ItemWrapper = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;
