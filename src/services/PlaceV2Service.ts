import axiosInstance from '@/constants/axiosInstance';
import { API_URL } from '@/constants/config';
import { Place, Section, SectionItem, SectionItemType, SectionOrderItem, SectionWithItems } from '@/entities/place';

type ListSectionsResponse = {
  value: SectionWithItems[];
};

export const listSections = async () => {
  const response = await axiosInstance.get<ListSectionsResponse>(`${API_URL}/v2/place/section`);

  return response.data.value?.map((sectionWithItems) => ({
    ...sectionWithItems,
    id: sectionWithItems.section.id,
  }));
};

type ListSectionItemsRequest = {
  keyword: string;
};

type ListSectionItemsResponse = {
  value: SectionItem[];
};

export const listSectionItems = async (req: ListSectionItemsRequest) => {
  const response = await axiosInstance.get<ListSectionItemsResponse>(
    `${API_URL}/v2/place/section/items/search-candidates?keywords=${req.keyword}`,
    { params: req },
  );

  return response.data.value;
};

export const updateSectionOrder = async (sectionOrders: SectionOrderItem[]) => {
  await axiosInstance.post(`${API_URL}/v2/place/section/order`, {
    sectionOrders,
  });
};

type UpdateSectionItemsRequest = {
  sectionId: Section['id'];
  items: {
    type: SectionItemType;
    id: string;
    order: number;
  }[];
};

export const updateSectionItems = async (req: UpdateSectionItemsRequest) => {
  await axiosInstance.post(`${API_URL}/v2/place/section/${req.sectionId}/items`, {
    items: req.items,
  });
};

type ListPlaceByCategoryResponse = {
  value: Place[];
};

export const listPlaceByCategory = async (categoryId: Place['studioCategoryId']) => {
  const result = await axiosInstance.get<ListPlaceByCategoryResponse>(`${API_URL}/v2/place?categoryId=${categoryId}`);

  return result.data.value;
};

type UpdateCategoryItemsRequest = {
  categoryId: Place['studioCategoryId'];
  placeIds: Place['id'][];
};

export const updateCategoryItems = async (req: UpdateCategoryItemsRequest) => {
  await axiosInstance.post(`${API_URL}/v2/place/category/${req.categoryId}/add-studios`, {
    placeIds: req.placeIds,
  });
};
