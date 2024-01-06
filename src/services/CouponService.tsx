import { API_URL } from "../constants/config";

import axiosInstance from "../constants/axiosInstance";
import { Coupon } from "../entities/coupon";

type RegisterCouponRequest = {
  name: Coupon["name"];
  issueType: Coupon["issueType"];
  discountType: Coupon["discountType"];
  discountAmount: Coupon["discountAmount"];
  maxDiscountAmount: Coupon["maxDiscountAmount"];
  minOrderPriceAmount: Coupon["minOrderPriceAmount"];
  startDate: Coupon["startDate"];
  endDate: Coupon["endDate"];
};

const registerCoupon = async (params: RegisterCouponRequest) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/coupon`, params);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

type ListCouponsRequest = {
  page?: number;
  status?: "PENDING" | "IN_PROGRESS" | "FINISHED" | "";
  name?: string;
};

type ListCouponsResponse = {
  value: {
    data: Coupon[];
    meta: {
      total: number;
      page: number;
      lastPage: number;
    };
  };
};

const listCoupons = async (req: ListCouponsRequest) => {
  try {
    const searchParams = new URLSearchParams();

    if (req.page) {
      searchParams.set("page", req.page.toString());
    } else {
      searchParams.set("page", "1");
    }
    if (req.status) searchParams.set("status", req.status);
    if (req.name) searchParams.set("name", req.name);

    const response = await axiosInstance.get<ListCouponsResponse>(
      `${API_URL}/coupon`,
      {
        params: searchParams,
      }
    );

    return response.data.value.data;
  } catch (error) {}
};

type SearchUserRequest = {
  query: string;
};

type SearchUserResponse = {
  value: {
    id: string;
    name: string;
    phone: string;
    email: string;
    createdAt: string;
  }[];
};

const searchUser = async (req: SearchUserRequest) => {
  try {
    const searchParams = new URLSearchParams();

    if (req.query) searchParams.set("query", req.query);

    const response = await axiosInstance.get<SearchUserResponse>(
      `${API_URL}/coupon/user/search`,
      {
        params: searchParams,
      }
    );

    return response.data.value;
  } catch (error) {}
};

type SearchPlaceRequest = {
  query: string;
};

type SearchPlaceResponse = {
  value: PlaceResult[];
};

export type PlaceResult = {
  id: string;
  name: string;
  programs: {
    id: string;
    name: string;
  }[];
};

const searchPlace = async (req: SearchPlaceRequest) => {
  try {
    const searchParams = new URLSearchParams();

    if (req.query) searchParams.set("query", req.query);

    const response = await axiosInstance.get<SearchPlaceResponse>(
      `${API_URL}/coupon/place/search`,
      {
        params: searchParams,
      }
    );

    return response.data.value;
  } catch (error) {
    return [];
  }
};

const CouponService = {
  registerCoupon,
  listCoupons,
  searchUser,
  searchPlace,
};

export default CouponService;
