import { API_URL } from '../constants/config';

import axiosInstance from '../constants/axiosInstance';

const info = (id) => {
  return new Promise((resolve, reject) => {
    axiosInstance.get(`${API_URL}/bbs/info/${id}`).then((response) => {
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
        url: `${API_URL}/bbs/info/`,
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

const InfoService = {
  info,
  saveItem,
};

export default InfoService;
