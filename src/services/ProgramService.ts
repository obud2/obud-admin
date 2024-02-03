/**
 *  *************************************
 *  Class Service
 *  *************************************
 */
import axiosInstance from '@/constants/axiosInstance';
import { API_URL } from '@/constants/config';
import { LegacyCommonResponse } from '@/entities/common';
import { LIMIT } from '@/services/ScheduleService';

export const getProgramsAll = async (studioId: string) => {
  return axiosInstance.get<LegacyCommonResponse<any>>(`${API_URL}/studios/lesson/all?studiosId=${studioId}`).then((response) => {
    return response.data?.value || [];
  });
};
export const getPrograms = async (studioId: string, cursor: any, keyword = '') => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return axiosInstance
    .get<LegacyCommonResponse<any>>(`${API_URL}/studios/lesson/all?studiosId=${studioId}&limit=${LIMIT}${cursorTemp}${keywordTemp}`)
    .then((response) => {
      return response.data;
    });
};
export const getProgram = async (id: string) => {
  return axiosInstance.get<LegacyCommonResponse<any>>(`${API_URL}/studios/lesson/${id}`).then((response) => {
    return response?.data?.value || {};
  });
};
/**
 *
 * @param {*} param : Docs 참고
 * @returns
 */
export const setProgram = async (method: string, param: any) => {
  return axiosInstance
    .request({
      method: method === 'new' ? 'post' : 'put',
      url: `${API_URL}/studios/lesson`,
      data: param,
    })
    .then((response) => {
      return response?.data?.value || {};
    });
};
/**
 *
 * @param {*} param  {
 "id": test123,         게시글의 ID 값,
 "before": 5,           이동하기전 게시물의 sortOrder 값
 "after": 1             이동한후에 게시글의 sortOrder 값
 }
 * @returns
 */
export const sortProgram = async (param: any) => {
  return axiosInstance.post(`${API_URL}/studios/lesson/sort`, param).then((response) => {
    return response?.data?.value || {};
  });
};
export const cloneProgram = async (id: string) => {
  return axiosInstance.post(`${API_URL}/studios/lesson/clone/${id}`).then((response) => {
    return response?.data?.value || {};
  });
};
export const deleteProgram = async (id: string) => {
  return axiosInstance.delete(`${API_URL}/studios/lesson/${id}`).then((response) => {
    return response?.data?.value || {};
  });
};
