import { API_URL } from "../constants/config";

import axiosInstance from "../constants/axiosInstance";
import { Banner, BannerOrderItem } from "@/entities/banner";

const info = (id: any) => {
  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/banner/${id}`).then((response) => {
      resolve(response?.data?.value || {});
    });
  });
};

const saveItem = (type: string, param: { createdAt: any }) => {
  return new Promise((resolve, reject) => {
    if (param.createdAt) delete param.createdAt;
    axiosInstance
      .request({
        method: type === "new" ? "post" : "put",
        url: `${API_URL}/banner/`,
        data: param,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

type ListBannersResponse = {
  value: Banner[];
};

const listBanners = async () => {
  const response = await axiosInstance.get<ListBannersResponse>(
    `${API_URL}/v2/banner`
  );
  return response.data.value;
};

type CreateBannerRequest = {
  name: string;
  imageUrl: string;
  order: number;
};

const createBanner = async (request: CreateBannerRequest) => {
  const response = await axiosInstance.post(`${API_URL}/v2/banner`, request);
};

type DeleteBannerRequest = {
  bannerId: number;
};

const deleteBanner = async (request: DeleteBannerRequest) => {
  await axiosInstance.delete(`${API_URL}/v2/banner/${request.bannerId}`);
};

type UpdateBannerOrderRequest = {
  bannerOrders: BannerOrderItem[];
};

const updateBannerOrder = async (request: UpdateBannerOrderRequest) => {
  await axiosInstance.post(`${API_URL}/v2/banner/order`, request);
};

type UpdateBannerVisibilityRequest = {
  bannerId: number;
  isShow: boolean;
};

const updateBannerVisibility = async (
  request: UpdateBannerVisibilityRequest
) => {
  await axiosInstance.put(`${API_URL}/v2/banner/${request.bannerId}`, {
    isShow: request.isShow,
  });
};

const BannerService = {
  info,
  saveItem,
  listBanners,
  createBanner,
  deleteBanner,
  updateBannerOrder,
  updateBannerVisibility,
};

export default BannerService;
