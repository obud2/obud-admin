import { API_URL } from '../constants/config';

import axiosInstance from '../constants/axiosInstance';
import swal from '@sweetalert/with-react';

const getListByType = (type) => {
  return new Promise((resolve, reject) => {
    axiosInstance.get(`${API_URL}/bbs/contact/`).then((response) => {
      if (response.data && response.data.value) {
        resolve(response.data.value.filter((d) => d?.type === type));
      }
    });
  });
};

const info = (id) => {
  return new Promise((resolve, reject) => {
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

const deleteItem = (id) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .delete(`${API_URL}/bbs/contact/${id}`, {
        headers: { Pragma: 'no-cache' },
      })
      .then((response) => {
        if (response.status === 200) {
          swal('삭제되었습니다.', {
            icon: 'success',
          });
          resolve();
        }
      });
  });
};

const AboutService = {
  getListByType,
  info,
  deleteItem,
  saveItem,
};

export default AboutService;
