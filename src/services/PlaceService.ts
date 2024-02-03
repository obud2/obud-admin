import { API_URL } from '../constants/config';
import axiosInstance from '../constants/axiosInstance';
import { LegacyCommonResponse } from '@/entities/common';
import { Studio } from '@/entities/studio';

export const getStudios = async (keyword: string) => {
  const keywordTemp = keyword ? `?keyword=${keyword}` : '';

  return axiosInstance.get<LegacyCommonResponse<Studio[]>>(`${API_URL}/studios/all${keywordTemp}`).then((response) => {
    if (response.data && response.data.value) {
      const val = response.data.value.sort((a: { sortOrder: number }, b: { sortOrder: number }) => (a.sortOrder > b.sortOrder ? -1 : 1));

      return val;
    }
  });
};

export const getStudio = async (id: string) => {
  return axiosInstance.get<LegacyCommonResponse<Studio>>(`${API_URL}/studios/${id}`).then((response) => {
    return response.data.value;
  });
};

/**
 *
 * @param {*} param : Docs 참고
 * @returns
 */
export const setStudio = async (method: string, param: any) => {
  return axiosInstance
    .request({
      method: method === 'new' ? 'post' : 'put',
      url: `${API_URL}/studios`,
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
export const sortStudio = async (param: any) => {
  return axiosInstance
    .post(`${API_URL}/studios/sort`, param)
    .then((response) => {
      return response?.data?.value || {};
    })
    .catch(() => {
      return {};
    });
};

export const cloneStudio = async (id: string) => {
  return axiosInstance
    .post(`${API_URL}/studios/clone/${id}`)
    .then((response) => {
      return response?.data?.value || {};
    })
    .catch(() => {
      return {};
    });
};

export const deleteStudio = async (id: string) => {
  return axiosInstance.delete(`${API_URL}/studios/${id}`);
};

/**
 *  *************************************
 *  Specail Service
 *  *************************************
 */

export const getSpecialList = async (keyword = '') => {
  const keywordTemp = keyword ? `?keyword=${keyword}` : '';

  return axiosInstance
    .get<LegacyCommonResponse<any>>(`${API_URL}/studios/lesson/special/all${keywordTemp}`)
    .then((response) => {
      const val = response?.data?.value?.sort((a: { specialSort: number }, b: { specialSort: number }) =>
        a.specialSort > b.specialSort ? -1 : 1,
      );

      return val;
    })
    .catch(() => {
      return [];
    });
};

export const sortSpecial = async (param: any) => {
  return axiosInstance.post(`${API_URL}/studios/lesson/sort/special`, param).then((response) => {
    return response?.data?.value || {};
  });
};
