import { CouponDiscountType } from '../coupon';

export type MerchandiseType = 'ONE_TIME_RESERVATION' | 'PASS';
export type PaymentStatus = 'COMPLETE' | 'CANCEL';

export type Payment = {
  key: string;
  status: PaymentStatus;
  date: string;
  payAt: string;
  cancelAt: string | null;
  user: {
    id: string;
    name: string;
    phone: string;
  };
  merchandiseType: MerchandiseType;
  place: {
    id: string;
    title: string;
  };
  // 패스 결제의 경우
  pass?: {
    id: number;
    title: string;
  };
  // 단건 결제의 경우
  program?: {
    id: string;
    title: string;
  };
  reservationCount: number;
  // 결제 금액
  payAmount: number;
  // 정가 금액
  totalAmount: number;
  // 할인 금액 (쿠폰)
  discountAmount: number;
  coupon?: {
    name: string;
    discountType: CouponDiscountType;
    discountAmount: number;
  };
  // 환불 금액
  cancelAmount: number;
};
