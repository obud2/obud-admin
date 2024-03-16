import { API_URL } from '../constants/config';

import axiosInstance from '../constants/axiosInstance';
import { Reservation, ReservationStatus } from '@/entities/reservation';
import { Place } from '@/entities/place';
import { Program } from '@/entities/program';

const limit = 20;

const getReservationAll = (type: string) => {
  return new Promise((resolve) => {
    const typeTemp = type === 'pass' ? '/old' : '';

    axiosInstance.get(`${API_URL}/reservation/complete${typeTemp}`).then((response) => {
      resolve(response?.data?.value || []);
    });
  });
};

const getReservation = (cursor: any, keyword: any) => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/reservation/complete?limit=${limit}${cursorTemp}${keywordTemp}`).then((response) => {
      resolve(response?.data || {});
    });
  });
};

const getOldReservation = (cursor: any, keyword: any) => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/reservation/complete/old?limit=${limit}${cursorTemp}${keywordTemp}`).then((response) => {
      resolve(response?.data || {});
    });
  });
};

const getCancelReservationAll = (type: string) => {
  const typeTemp = type === 'canceling' ? 'canceling' : 'cancel';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/reservation/${typeTemp}`).then((response) => {
      resolve(response?.data?.value || []);
    });
  });
};

const getCancelReservation = (cursor: any, keyword: any) => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/reservation/cancel?limit=${limit}${cursorTemp}${keywordTemp}`).then((response) => {
      resolve(response?.data || {});
    });
  });
};

const getCancelingReservation = (cursor: any, keyword: any) => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/reservation/canceling?limit=${limit}${cursorTemp}${keywordTemp}`).then((response) => {
      resolve(response?.data || {});
    });
  });
};

const getRefusalReservation = (cursor: any, keyword: any) => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/reservation/refusal?limit=${limit}${cursorTemp}${keywordTemp}`).then((response) => {
      resolve(response?.data || []);
    });
  });
};

const getRefusalReservationAll = () => {
  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/reservation/refusal`).then((response) => {
      resolve(response?.data?.value || []);
    });
  });
};

/**
 *
 * @param {*} param  {
                        "orderItemId": "ODI202306230021",
                        "cancelAmount": 0
                      }
 * @returns
 */
const orderCancelCheck = (param: any) => {
  return new Promise((resolve) => {
    axiosInstance
      .put(`${API_URL}/order/cancel`, param)
      .then((response) => {
        resolve(response?.data || {});
      })
      .catch((res) => {
        resolve(res?.data || {});
      });
  });
};

/**
 *
 * @param {*} param  {
                        "orderItemId": "ODI202306230021",
                      }
 * @returns
 */
const orderRefusal = (param: any) => {
  return new Promise((resolve) => {
    axiosInstance
      .put(`${API_URL}/order/refusal`, param)
      .then((response) => {
        resolve(response?.data || {});
      })
      .catch((res) => {
        resolve(res?.data || {});
      });
  });
};

/**
 *
 * @param {*} param  {
                        "orderItemId": "ODI202306230021",
                      }
 * @returns
 */
const orderCanceling = (param: any) => {
  return new Promise((resolve) => {
    axiosInstance.put(`${API_URL}/order/canceling`, param).then((response) => {
      resolve(response?.data || {});
    });
  });
};

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
    placeProgram: `${reservation.place?.title ?? ''} ${reservation.program?.title ?? ''}`,
    scheduleStartDate: reservation.schedule.startDate,
    payment: reservation.payment.merchandiseType,
    paymentId: reservation.payment.key,
  }));
};

const ReservationService = {
  getReservationAll,
  getReservation,
  getOldReservation,

  getCancelReservationAll,
  getCancelReservation,
  getCancelingReservation,

  getRefusalReservation,
  getRefusalReservationAll,

  // Cancel
  orderCancelCheck,
  orderCanceling,

  // Refusal
  orderRefusal,

  listReservations,
  listReservationsExcelList,
};

export default ReservationService;
