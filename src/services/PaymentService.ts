import axiosInstance from '@/constants/axiosInstance';
import { API_URL } from '@/constants/config';
import { MerchandiseType, Payment, PaymentStatus } from '@/entities/payment';
import { Place } from '@/entities/place';
import { Program } from '@/entities/program';

export type ListPaymentsRequest = {
  startDate: string; // format: 2024-03-10
  endDate: string; // format: 2024-03-10
  query?: string; // 이름 or 전화번호
  merchandiseType?: MerchandiseType;
  paymentStatus?: PaymentStatus;
  placeId?: Place['id'];
  programId?: Program['id'];
};

type ListPaymentsResponse = {
  value: Payment[];
};

const listPayments = async (req: ListPaymentsRequest): Promise<ListPaymentsResponse['value']> => {
  const searchParams = new URLSearchParams();
  searchParams.set('startDate', req.startDate);
  searchParams.set('endDate', req.endDate);

  if (req.query) searchParams.set('query', req.query);
  if (req.merchandiseType) searchParams.set('merchandiseType', req.merchandiseType);
  if (req.paymentStatus) searchParams.set('paymentStatus', req.paymentStatus);
  if (req.placeId) searchParams.set('placeId', req.placeId);
  if (req.programId) searchParams.set('programId', req.programId);

  const response = await axiosInstance.get<ListPaymentsResponse>(`${API_URL}/payments`, {
    params: searchParams,
  });

  return response.data.value;
};

type ListPaymentsExcelListRequest = ListPaymentsRequest;

const listPaymentsExcelListRequest = async (req: ListPaymentsExcelListRequest) => {
  const response = await listPayments(req);

  return response.map((payments) => {
    let passProgram;
    if (payments.merchandiseType === 'ONE_TIME_RESERVATION') {
      passProgram = payments.program?.title;
    } else {
      passProgram = payments.pass?.title;
    }

    return {
      status: payments.status,
      key: payments.key,
      payAt: payments.payAt,
      userName: payments.user.name,
      userPhone: payments.user.phone,
      merchandiseType: payments.merchandiseType,
      passProgram,
      place: payments.place?.title,
      totalAmount: payments.totalAmount,
      discountAmount: payments.discountAmount,
      payAmount: payments.payAmount,
      cancelAmount: payments.cancelAmount,
    };
  });
};

type RefundPaymentRequest = {
  paymentKey?: Payment['key'];
  refundAmount: number;
};

const refundPayment = async (req: RefundPaymentRequest) => {
  await axiosInstance.post(`${API_URL}/payments/${req.paymentKey}/refund/admin`, req);
};

const PaymentService = {
  listPayments,
  listPaymentsExcelListRequest,
  refundPayment,
};

export default PaymentService;
