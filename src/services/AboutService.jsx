import { API_URL } from '../constants/config';

import axiosInstance from '../constants/axiosInstance';

const getListByType = (type) => {
  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/bbs/contact/`).then((response) => {
      if (response.data && response.data.value) {
        resolve(response.data.value.filter((d) => d?.type === type));
      }
    });
  });
};

const info = (id) => {
  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/bbs/contact/${id}`).then((response) => {
      if (response.data && response.data.value) {
        resolve(response.data.value);
      }
    });
  });
};

const saveItem = (type, param) => {
  return new Promise((resolve, reject) => {
    if (param.createdAt) delete param.createdAt;
    axiosInstance
      .request({
        method: type === 'new' ? 'post' : 'put',
        url: `${API_URL}/bbs/contact/`,
        data: param,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const AboutService = {
  getListByType,
  info,
  saveItem,
};

export default AboutService;
