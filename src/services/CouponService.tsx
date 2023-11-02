import { API_URL } from "../constants";

import axiosInstance from "../constants/axiosInstance";
import { Coupon } from "../entities/coupon";

type RegisterCouponRequest = {
  name: Coupon["name"];
  issueType: Coupon["issueType"];
  userId: Coupon["userId"];
  issueAmountType: Coupon["issueAmountType"];
  notificationType: Coupon["notificationType"];
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
  page: number;
  // pageSize default to 20
};

const listCoupons = async (req: ListCouponsRequest) => {
  try {
    const params = new URLSearchParams();
    params.append("page", req.page.toString() || "1");
    const response = await axiosInstance.get(`${API_URL}/coupon`, {
      params,
    });
    return response?.data;
  } catch (error) {}
};

const CouponService = {
  registerCoupon,
  listCoupons,
};

export default CouponService;
