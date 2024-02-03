import { API_URL } from '../constants/config';
import axiosInstance from '../constants/axiosInstance';

export const getStudios = async (keyword: string) => {
  const keywordTemp = keyword ? `?keyword=${keyword}` : '';

  return axiosInstance.get(`${API_URL}/studios/all${keywordTemp}`).then((response) => {
    if (response.data && response.data.value) {
      const val = response.data.value.sort((a: { sortOrder: number }, b: { sortOrder: number }) => (a.sortOrder > b.sortOrder ? -1 : 1));

      return val;
    }
  });
};

export const getStudio = async (id: string) => {
  return axiosInstance
    .get(`${API_URL}/studios/${id}`)
    .then((response) => {
      return response?.data?.value || {};
    })
    .catch(() => {
      return {};
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
    .get(`${API_URL}/studios/lesson/special/all${keywordTemp}`)
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

/**
 *  *************************************
 *  Class Service
 *  *************************************
 */

/**
 *
 * @param {*} studioId : 공간 ID
 * @param {*} cursor : 다음 페이지
 * @param {*} keyword : 검색 keyword
 * @returns
 */
const limit = 20;
export const getLessonsAll = async (studioId: string) => {
  return axiosInstance.get(`${API_URL}/studios/lesson/all?studiosId=${studioId}`).then((response) => {
    return response.data?.value || [];
  });
};

export const getLessons = async (studioId: string, cursor: any, keyword = '') => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return axiosInstance
    .get(`${API_URL}/studios/lesson/all?studiosId=${studioId}&limit=${limit}${cursorTemp}${keywordTemp}`)
    .then((response) => {
      return response.data;
    });
};

export const getLesson = async (id: string) => {
  return axiosInstance.get<{ value: object }>(`${API_URL}/studios/lesson/${id}`).then((response) => {
    return response?.data?.value || {};
  });
};

/**
 *
 * @param {*} param : Docs 참고
 * @returns
 */
export const setLesson = async (method: string, param: any) => {
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
export const sortLesson = async (param: any) => {
  return axiosInstance.post(`${API_URL}/studios/lesson/sort`, param).then((response) => {
    return response?.data?.value || {};
  });
};

export const cloneLesson = async (id: string) => {
  return axiosInstance.post(`${API_URL}/studios/lesson/clone/${id}`).then((response) => {
    return response?.data?.value || {};
  });
};

export const deleteLesson = async (id: string) => {
  return axiosInstance.delete(`${API_URL}/studios/lesson/${id}`).then((response) => {
    return response?.data?.value || {};
  });
};

/**
 *  *************************************
 *  Plan Service
 *  *************************************
 */

/**
 *
 * @param {*} lessonId : 클래스 ID
 * @param {*} cursor : 다음 페이지
 * @param {*} keyword : 검색 keyword
 * @returns
 */

export const getPlans = async (lessonId: string, cursor: any, keyword = '') => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return axiosInstance
    .get(`${API_URL}/studios/plan/all?lessonId=${lessonId}&limit=${limit}${cursorTemp}${keywordTemp}`)
    .then((response) => {
      return response.data;
    });
};

export const getMonthPlans = async (lessonId: string, month: string, keyword = '') => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';

  return axiosInstance.get(`${API_URL}/studios/plan/month/all?lessonId=${lessonId}&date=${month}${keywordTemp}`).then((response) => {
    return response.data;
  });
};

export const getPlan = async (id: string) => {
  return await axiosInstance.get(`${API_URL}/studios/plan/${id}`).then((response) => response.data.value || {});
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

export const onAttendance = async (param: any) => {
  return axiosInstance.put(`${API_URL}/studios/plan/attendance`, param).then((response) => {
    return response?.data?.value || {};
  });
};

export const onComment = async (param: any) => {
  return axiosInstance.put(`${API_URL}/studios/plan/comment`, param).then((response) => {
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

  return axiosInstance.get(`${API_URL}/studios/plan/calendar?studiosId=${studiosId}&date=${date}&=${lessonIdTemp}`).then((response) => {
    return response?.data?.value || {};
  });
};

export const getPlanCaledarDayInfo = async (studiosId: number, date: string) => {
  return axiosInstance.get(`${API_URL}/studios/plan/calendar/dayInfo?studiosId=${studiosId}&date=${date}`).then((response) => {
    return response?.data?.value || {};
  });
};
