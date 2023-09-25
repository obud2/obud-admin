import { API_URL } from '../constants';
import axiosInstance from '../constants/axiosInstance';

/**
 *
 * @param {*} cursor : 다음 페이지
 * @param {*} keyword : 검색 keyword
 * @returns
 */
const getStudios = (keyword) => {
  const keywordTemp = keyword ? `?keyword=${keyword}` : '';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/studios/all${keywordTemp}`).then((response) => {
      if (response.data && response.data.value) {
        const val = response.data.value.sort((a, b) => (a.sortOrder > b.sortOrder ? -1 : 1));

        resolve(val);
      }
    });
  });
};

const getStudio = (id) => {
  return new Promise((resolve) => {
    axiosInstance
      .get(`${API_URL}/studios/${id}`)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
  });
};

/**
 *
 * @param {*} param : Docs 참고
 * @returns
 */
const setStudio = (method, param) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: method === 'new' ? 'post' : 'put',
        url: `${API_URL}/studios`,
        data: param,
      })
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch((error) => {
        reject(error);
      });
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
const sortStudio = (param) => {
  return new Promise((resolve) => {
    axiosInstance
      .post(`${API_URL}/studios/sort`, param)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
  });
};

const cloneStudio = (id) => {
  return new Promise((resolve) => {
    axiosInstance
      .post(`${API_URL}/studios/clone/${id}`)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
  });
};

const deleteStudio = (id) => {
  return new Promise((resolve) => {
    axiosInstance
      .delete(`${API_URL}/studios/${id}`)
      .then((response) => {
        resolve(response?.data);
      })
      .catch(() => {
        resolve({});
      });
  });
};

/**
 *  *************************************
 *  Specail Service
 *  *************************************
 */

const getSpecialList = (keyword) => {
  const keywordTemp = keyword ? `?keyword=${keyword}` : '';

  return new Promise((resolve) => {
    axiosInstance
      .get(`${API_URL}/studios/lesson/special/all${keywordTemp}`)
      .then((response) => {
        const val = response?.data?.value?.sort((a, b) => (a.specialSort > b.specialSort ? -1 : 1));

        resolve(val);
      })
      .catch(() => {
        resolve([]);
      });
  });
};

const sortSpecial = (param) => {
  return new Promise((resolve) => {
    axiosInstance
      .post(`${API_URL}/studios/lesson/sort/special`, param)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
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
const getLessonsAll = (studioId) => {
  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/studios/lesson/all?studiosId=${studioId}`).then((response) => {
      resolve(response.data?.value || []);
    });
  });
};

const getLessons = (studioId, cursor, keyword) => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/studios/lesson/all?studiosId=${studioId}&limit=${limit}${cursorTemp}${keywordTemp}`).then((response) => {
      resolve(response.data);
    });
  });
};

const getLesson = (id) => {
  return new Promise((resolve) => {
    axiosInstance
      .get(`${API_URL}/studios/lesson/${id}`)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
  });
};

/**
 *
 * @param {*} param : Docs 참고
 * @returns
 */
const setLesson = (method, param) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: method === 'new' ? 'post' : 'put',
        url: `${API_URL}/studios/lesson`,
        data: param,
      })
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch((error) => {
        reject(error);
      });
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
const sortLesson = (param) => {
  return new Promise((resolve) => {
    axiosInstance
      .post(`${API_URL}/studios/lesson/sort`, param)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
  });
};

const cloneLesson = (id) => {
  return new Promise((resolve) => {
    axiosInstance
      .post(`${API_URL}/studios/lesson/clone/${id}`)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
  });
};

const deleteLesson = (id) => {
  return new Promise((resolve) => {
    axiosInstance
      .delete(`${API_URL}/studios/lesson/${id}`)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
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

const getPlans = (lessonId, cursor, keyword) => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/studios/plan/all?lessonId=${lessonId}&limit=${limit}${cursorTemp}${keywordTemp}`).then((response) => {
      resolve(response.data);
    });
  });
};

const getMonthPlans = (lessonId, month, keyword) => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/studios/plan/month/all?lessonId=${lessonId}&date=${month}${keywordTemp}`).then((response) => {
      resolve(response.data);
    });
  });
};

const getPlan = (id) => {
  return new Promise((resolve) => {
    axiosInstance
      .get(`${API_URL}/studios/plan/${id}`)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
  });
};

/**
 *
 * @param {*} param : Docs 참고
 * @returns
 */
const setPlan = (method, param) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: method === 'new' ? 'post' : 'put',
        url: `${API_URL}/studios/plan`,
        data: param,
      })
      .then((response) => {
        if (response?.data?.status === 200) {
          resolve(response?.data?.value || {});
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const setMultiPlan = (body) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`${API_URL}/studios/plan/multi`, body)
      .then((response) => {
        if (response?.data?.status === 200) {
          resolve(response?.data?.value || {});
        } else {
          reject(response);
        }
      })
      .catch(() => {
        resolve({});
      });
  });
};

const deletePlan = (id) => {
  return new Promise((resolve) => {
    axiosInstance
      .delete(`${API_URL}/studios/plan/${id}`)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
  });
};

const clonePlan = (id) => {
  return new Promise((resolve) => {
    axiosInstance
      .post(`${API_URL}/studios/plan/clone/${id}`)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
  });
};

const onAttendance = (param) => {
  return new Promise((resolve) => {
    axiosInstance
      .put(`${API_URL}/studios/plan/attendance`, param)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
  });
};

const onComment = (param) => {
  return new Promise((resolve) => {
    axiosInstance
      .put(`${API_URL}/studios/plan/comment`, param)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
  });
};

/**
 *  *************************************
 *  Order Status Service
 *  *************************************
 */
const getPlanCaledar = (studiosId, date, lessonId) => {
  const lessonIdTemp = lessonId ? `&lessonId=${lessonId}` : '';

  return new Promise((resolve) => {
    axiosInstance
      .get(`${API_URL}/studios/plan/calendar?studiosId=${studiosId}&date=${date}&=${lessonIdTemp}`)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
  });
};

const getPlanCaledarDayInfo = (studiosId, date) => {
  return new Promise((resolve) => {
    axiosInstance
      .get(`${API_URL}/studios/plan/calendar/dayInfo?studiosId=${studiosId}&date=${date}`)
      .then((response) => {
        resolve(response?.data?.value || {});
      })
      .catch(() => {
        resolve({});
      });
  });
};

const ProductService = {
  getStudios,
  getStudio,
  setStudio,
  sortStudio,
  cloneStudio,
  deleteStudio,

  // Special
  getSpecialList,
  sortSpecial,

  // Lesson
  getLessonsAll,
  getLessons,
  getLesson,
  setLesson,
  sortLesson,
  cloneLesson,
  deleteLesson,

  // Plan
  getMonthPlans,
  getPlans,
  getPlan,
  setPlan,
  clonePlan,
  deletePlan,
  setMultiPlan,

  //
  onAttendance,
  onComment,

  // Order Status
  getPlanCaledar,
  getPlanCaledarDayInfo,
};

export default ProductService;
