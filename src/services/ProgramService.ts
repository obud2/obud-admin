/**
 *  *************************************
 *  Class Service
 *  *************************************
 */
import axiosInstance from '@/constants/axiosInstance';
import { API_URL } from '@/constants/config';
import { LegacyCommonResponse } from '@/entities/common';
import { LIMIT } from '@/services/ScheduleService';
import { Program } from '@/entities/program';
import { ScheduleTitlePreset } from '@/entities/schedule';

export const getProgramsAll = async (placeId?: string): Promise<Program[]> => {
  if (!placeId) {
    return [];
  }
  return axiosInstance.get<LegacyCommonResponse<Program[]>>(`${API_URL}/studios/lesson/all?studiosId=${placeId}`).then((response) => {
    return response.data?.value || [];
  });
};
export const getPrograms = async (studioId: string, keyword = '') => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';

  return axiosInstance
    .get<LegacyCommonResponse<Program[]>>(`${API_URL}/studios/lesson/all?studiosId=${studioId}&limit=${LIMIT}${keywordTemp}`)
    .then((response) => {
      return response.data.value || [];
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

/**
 * 회차 프리셋
 */
export const getProgramTitlePresets = async (programId: string) => {
  return axiosInstance
    .get<LegacyCommonResponse<ScheduleTitlePreset[]>>(`${API_URL}/v2/program/preset?programId=${programId}`)
    .then((response) => {
      return response.data.value || {};
    });
};

export const createProgramTitlePreset = async (body: { programId: string; title: string; description: string }) => {
  await axiosInstance.post(`${API_URL}/v2/program/preset`, body);
};

export const updateProgramTitlePreset = async (presetId: number, body: { title: string; description: string }) => {
  await axiosInstance.put(`${API_URL}/v2/program/preset/${presetId}`, body);
};

export const deleteProgramTitlePreset = async (presetId: number) => {
  await axiosInstance.delete(`${API_URL}/v2/program/preset/${presetId}`);
};
