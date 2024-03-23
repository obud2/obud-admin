import { API_URL } from '../constants/config';

import axiosInstance from '../constants/axiosInstance';
import { Reservation, ReservationStatus } from '@/entities/reservation';
import { Place } from '@/entities/place';
import { Program } from '@/entities/program';

export type ListReservationsRequest = {
  startDate: string; // format: 2024-03-10
  endDate: string; // format: 2024-03-10
  sort?: 'USER_NAME' | 'PROGRAM_TITLE' | 'DATE'; // default: DATE
  sortType?: 'ASC' | 'DESC'; // default: DESC
  query?: string; // 검색어(이름 / 전화번호)
  status?: ReservationStatus;
  placeId?: Place['id'];
  programId?: Program['id'];
};

type ListReservationsResponse = {
  value: Reservation[];
};

const listReservations = async (req: ListReservationsRequest): Promise<ListReservationsResponse['value']> => {
  const searchParams = new URLSearchParams();
  searchParams.set('startDate', req.startDate);
  searchParams.set('endDate', req.endDate);

  if (req.sort) searchParams.set('sort', req.sort);
  if (req.sortType) searchParams.set('sortType', req.sortType);
  if (req.query) searchParams.set('query', req.query);
  if (req.status) searchParams.set('status', req.status);
  if (req.placeId) searchParams.set('placeId', req.placeId);
  if (req.programId) searchParams.set('programId', req.programId);

  const response = await axiosInstance.get<ListReservationsResponse>(`${API_URL}/reservation?${searchParams.toString()}`);

  return response.data.value;
};

type ListReservationsExcelListRequest = ListReservationsRequest;

const listReservationsExcelList = async (req: ListReservationsExcelListRequest) => {
  const reservations = await listReservations(req);

  return reservations.map((reservation) => ({
    status: reservation.status,
    id: reservation.id,
    reserveAt: reservation.reserveAt,
    userName: reservation.user.name,
    userPhone: reservation.user.phone,
    program: reservation.program?.title,
    place: reservation.place?.title,
    scheduleStartDate: reservation.schedule.startDate,
    payment: reservation.payment.merchandiseType,
    totalAmount: reservation.payment.totalAmount,
    payAmount: reservation.payment.payAmount,
  }));
};

type CancelReservationByPassRequest = {
  userPassReservationId: Reservation['id'];
};

const cancelReservationByPass = async (req: CancelReservationByPassRequest) => {
  await axiosInstance.post(`${API_URL}/reservation/pass/${req.userPassReservationId}/cancel`);
};

const ReservationService = {
  listReservations,
  listReservationsExcelList,

  cancelReservationByPass,
};

export default ReservationService;
