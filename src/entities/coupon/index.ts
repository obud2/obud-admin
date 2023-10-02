export type Coupon = {
  id: string;
  name: string;
  isUsed: boolean;
  issueType: CouponIssueType;
  userId: string | null; // issueType === 'TO_USER'
  issueAmountType: CouponIssueAmountType;
  notificationType: CouponNotificationType;
  discountType: CouponDiscountType;
  discountAmount: number;
  maxDiscountAmount: number;
  minOrderPriceAmount: number;
  startDate: string; //YYYY-MM-DD
  endDate: string; //YYYY-MM-DD
  createdAt: string; //YYYY-MM-DDTHH:mm:ss.ssssss+09:00
  updatedAt: string; //YYYY-MM-DDTHH:mm:ss.ssssss+09:00
};

export enum CouponIssueType {
  BY_CODE = 'BY_CODE',
  TO_USER = 'TO_USER',
  TO_ALL_USERS = 'TO_ALL_USERS',
}

export enum CouponDiscountType {
  PERCENTAGE = 'PERCENTAGE',
  AMOUNT = 'AMOUNT',
}

export enum CouponIssueAmountType {
  NO_LIMIT = 'NO_LIMIT',
}

export enum CouponNotificationType {
  AT_START_DATE = 'AT_START_DATE',
}
