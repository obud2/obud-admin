import axiosInstance from "@/constants/axiosInstance";
import { API_URL } from "@/constants/config";
import { PlaceSection } from "@/entities/place";

type GetPlaceSectionsResponse = {
  value: PlaceSection[];
};

const getPlaceSections = async () => {
  const response = await axiosInstance.get<GetPlaceSectionsResponse>(
    `${API_URL}/v2/place/section`
  );
  return response.data.value;
};

const PlaceService = {
  getPlaceSections,
};

export default PlaceService;
