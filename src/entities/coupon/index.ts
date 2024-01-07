export type Coupon = {
  id: string;
  name: string;
  code: string | null;
  userCoupons: {
    id: string;
    userId: string;
    isUsed: boolean;
    usedAt: string | null;
    createdAt: string;
  }[];
  issueType: CouponIssueType;
  discountType: CouponDiscountType;
  discountAmount: number;
  maxDiscountAmount: number;
  minOrderPriceAmount: number;
  startDate: string;
  endDate: string;
  allowDuplicatePerUser: boolean;
  placeAllowList: string[];
  programAllowList: string[];
  placeBlockList: string[];
  programBlockList: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
};

export enum CouponIssueType {
  BY_CODE = "BY_CODE",
  TO_USER = "TO_USER",
  TO_ALL_USERS = "TO_ALL_USERS",
  WHEN_SIGNUP = "WHEN_SIGNUP",
}

export enum CouponDiscountType {
  PERCENTAGE = "PERCENTAGE",
  AMOUNT = "AMOUNT",
}

export enum CouponApplyType {
  ALL = "ALL",
  PARTIAL = "PARTIAL",
}

export type CouponStatus = "PENDING" | "IN_PROGRESS" | "FINISHED" | "";
