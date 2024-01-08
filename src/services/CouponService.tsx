import { API_URL } from "../constants/config";

import axiosInstance from "../constants/axiosInstance";
import {
  Coupon,
  CouponDiscountType,
  CouponIssueType,
  CouponStatus,
} from "../entities/coupon";

export type RegisterCouponRequest = {
  name: Coupon["name"];
  code: Coupon["code"];
  issueType: CouponIssueType;
  discountType: CouponDiscountType;
  discountAmount: Coupon["discountAmount"];
  maxDiscountAmount: Coupon["maxDiscountAmount"];
  minOrderPriceAmount: Coupon["minOrderPriceAmount"];
  // YYYY-MM-DD (시간 X, 날짜만)
  startDate: Coupon["startDate"];
  // YYYY-MM-DD (시간 X, 날짜만)
  endDate: Coupon["endDate"];
  // 동일 회원의 중복 발급 가능 여부
  allowDuplicatePerUser: Coupon["allowDuplicatePerUser"];
  // 적용 대상 장소/프로그램
  placeAllowList: Coupon["placeAllowList"];
  programAllowList: Coupon["programAllowList"];
  // 적용 제외 장소/프로그램
  placeBlockList: Coupon["placeBlockList"];
  programBlockList: Coupon["programBlockList"];
  // 쿠폰 지급해줄 유저 id 리스트
  userId: string | null;
  userIds: string[];
};

const registerCoupon = async (params: RegisterCouponRequest) => {
  try {
    await axiosInstance.post(`${API_URL}/coupon`, params);
  } catch (error) {
    throw error;
  }
};

type ListCouponsRequest = {
  page?: number;
  status?: CouponStatus;
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
  value: UserResult[];
};

export type UserResult = {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
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
  } catch (error) {
    return [];
  }
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
