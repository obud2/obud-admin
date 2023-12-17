import axiosInstance from "@/constants/axiosInstance";
import { API_URL } from "@/constants/config";
import { Section, SectionItem, SectionOrderItem } from "@/entities/place";

type ListSectionsResponse = {
  value: {
    section: Section;
    items: SectionItem[];
  }[];
};

const listSections = async () => {
  const response = await axiosInstance.get<ListSectionsResponse>(
    `${API_URL}/v2/place/section`
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
  updateSectionOrder,
};

export default PlaceService;
