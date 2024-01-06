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

const CouponService = {
  registerCoupon,
  listCoupons,
};

export default CouponService;
