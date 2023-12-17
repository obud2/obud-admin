import axiosInstance from "@/constants/axiosInstance";
import { API_URL } from "@/constants/config";
import {
  SectionItem,
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

const PlaceService = {
  listSections,
  listSectionItems,
  updateSectionOrder,
};

export default PlaceService;
