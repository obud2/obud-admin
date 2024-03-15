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
  status?: PaymentStatus;
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
  if (req.status) searchParams.set('status', req.status);
  if (req.placeId) searchParams.set('placeId', req.placeId);
  if (req.programId) searchParams.set('programId', req.programId);

  const response = await axiosInstance.get<ListPaymentsResponse>(`${API_URL}/payments`, {
    params: searchParams,
  });

  return response.data.value;
};

const PaymentService = {
  listPayments,
};

export default PaymentService;
