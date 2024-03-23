import axiosInstance from '@/constants/axiosInstance';
import { API_URL } from '@/constants/config';
import { LegacyCommonResponse } from '@/entities/common';
import { Schedule } from '@/entities/schedule';
import { Reservation } from '@/entities/reservation';

export const LIMIT = 20;

export const getMonthPlans = async (lessonId: string, month: string, keyword = '') => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';

  return axiosInstance
    .get<LegacyCommonResponse<Schedule[]>>(`${API_URL}/studios/plan/month/all?lessonId=${lessonId}&date=${month}${keywordTemp}`)
    .then((response) => {
      return response.data.value || [];
    });
};
export const getPlan = async (id: string) => {
  return await axiosInstance
    .get<LegacyCommonResponse<Schedule & { reservations: Reservation[] }>>(`${API_URL}/studios/plan/${id}`)
    .then((response): Schedule => response.data.value);
};
/**
 *
 * @param {*} param : Docs 참고
 * @returns
 */
export const setPlan = async (method: string, param: any) => {
  return axiosInstance
    .request({
      method: method === 'new' ? 'post' : 'put',
      url: `${API_URL}/studios/plan`,
      data: param,
    })
    .then((response) => {
      if (response.data?.status < 300 && response.data?.status >= 200) {
        return response.data?.value || {};
      } else {
        throw new Error(response.data.error || response.data.message || response.data.meat || response.data);
      }
    });
};
export const setMultiPlan = async (body: any) => {
  return axiosInstance.post(`${API_URL}/studios/plan/multi`, body).then((response) => {
    if (response?.data?.status === 200) {
      return response?.data?.value || {};
    } else {
      throw new Error(response.data.error || response.data.message || response.data.meat || response.data);
    }
  });
};
export const deletePlan = async (id: string) => {
  return axiosInstance.delete(`${API_URL}/studios/plan/${id}`).then((response) => {
    return response?.data?.value || {};
  });
};
export const clonePlan = async (id: string) => {
  return axiosInstance.post(`${API_URL}/studios/plan/clone/${id}`).then((response) => {
    return response?.data?.value || {};
  });
};
/**
 *  *************************************
 *  Order Status Service
 *  *************************************
 */
export const getPlanCaledar = async (studiosId: number, date: string, lessonId: number) => {
  const lessonIdTemp = lessonId ? `&lessonId=${lessonId}` : '';

  return axiosInstance
    .get<LegacyCommonResponse<any>>(`${API_URL}/studios/plan/calendar?studiosId=${studiosId}&date=${date}&=${lessonIdTemp}`)
    .then((response) => {
      return response?.data?.value || {};
    });
};
export const getPlanCaledarDayInfo = async (studiosId: number, date: string) => {
  return axiosInstance
    .get<LegacyCommonResponse<any>>(`${API_URL}/studios/plan/calendar/dayInfo?studiosId=${studiosId}&date=${date}`)
    .then((response) => {
      return response?.data?.value || {};
    });
};
/**
 *  *************************************
 *  Plan Service
 *  *************************************
 */

export const updateReservationAttendance = async (reservationId: string, attendance: boolean) => {
  return axiosInstance.put(`${API_URL}/reservation/${reservationId}/attendance`, { attendance });
};
export const onComment = async (param: any) => {
  return axiosInstance.put(`${API_URL}/studios/plan/comment`, param).then((response) => {
    return response?.data?.value || {};
  });
};
