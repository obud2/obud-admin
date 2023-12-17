import axiosInstance from "@/constants/axiosInstance";
import { API_URL } from "@/constants/config";
import {
  Section,
  SectionItem,
  SectionItemType,
  SectionOrderItem,
  SectionWithItems,
} from "@/entities/place";

type ListSectionsResponse = {
  value: SectionWithItems[];
};

const listSections = async () => {
  const response = await axiosInstance.get<ListSectionsResponse>(
    `${API_URL}/v2/place/section`
  );

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

const listSectionItems = async (req: ListSectionItemsRequest) => {
  const response = await axiosInstance.get<ListSectionItemsResponse>(
    `${API_URL}/v2/place/section/items/search-candidates?keywords=${req.keyword}`,
    { params: req }
  );

  return response.data.value;
};

const updateSectionOrder = async (sectionOrders: SectionOrderItem[]) => {
  await axiosInstance.post(`${API_URL}/v2/place/section/order`, {
    sectionOrders,
  });
};

type UpdateSectionItemsRequest = {
  sectionId: Section["id"];
  items: {
    type: SectionItemType;
    id: string;
    order: number;
  }[];
};

const updateSectionItems = async (req: UpdateSectionItemsRequest) => {
  await axiosInstance.post(
    `${API_URL}/v2/place/section/${req.sectionId}/items`,
    {
      items: req.items,
    }
  );
};

const PlaceService = {
  listSections,
  listSectionItems,
  updateSectionOrder,
  updateSectionItems,
};

export default PlaceService;
