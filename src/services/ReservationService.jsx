import { API_URL } from '../constants/config';

import axiosInstance from '../constants/axiosInstance';

const limit = 20;

const getReservationAll = (type) => {
  return new Promise((resolve) => {
    const typeTemp = type === 'pass' ? '/old' : '';

    axiosInstance.get(`${API_URL}/reservation/complete${typeTemp}`).then((response) => {
      resolve(response?.data?.value || []);
    });
  });
};

const getReservation = (cursor, keyword) => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/reservation/complete?limit=${limit}${cursorTemp}${keywordTemp}`).then((response) => {
      resolve(response?.data || {});
    });
  });
};

const getOldReservation = (cursor, keyword) => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/reservation/complete/old?limit=${limit}${cursorTemp}${keywordTemp}`).then((response) => {
      resolve(response?.data || {});
    });
  });
};

const getCancelReservationAll = (type) => {
  const typeTemp = type === 'canceling' ? 'canceling' : 'cancel';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/reservation/${typeTemp}`).then((response) => {
      resolve(response?.data?.value || []);
    });
  });
};

const getCancelReservation = (cursor, keyword) => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/reservation/cancel?limit=${limit}${cursorTemp}${keywordTemp}`).then((response) => {
      resolve(response?.data || {});
    });
  });
};

const getCancelingReservation = (cursor, keyword) => {
  const keywordTemp = keyword ? `&keyword=${keyword}` : '';
  const cursorTemp = cursor ? `&cursor=${cursor}` : '';

  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/reservation/canceling?limit=${limit}${cursorTemp}${keywordTemp}`).then((response) => {
      resolve(response?.data || {});
    });
  });
};

const getRefusalReservation = (cursor, keyword) => {
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
const orderCancelCheck = (param) => {
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
const orderRefusal = (param) => {
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
const orderCanceling = (param) => {
  return new Promise((resolve) => {
    axiosInstance.put(`${API_URL}/order/canceling`, param).then((response) => {
      resolve(response?.data || {});
    });
  });
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
};

export default ReservationService;
