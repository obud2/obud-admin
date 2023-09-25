import { API_URL } from '../constants';

import axiosInstance from '../constants/axiosInstance';
import swal from '@sweetalert/with-react';

const getListAll = () => {
  return new Promise((resolve, reject) => {
    axiosInstance.get(`${API_URL}/bbs/info/`).then((response) => {
      if (response.data && response.data.value) {
        resolve(response.data.value);
      }
    });
  });
};

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

const deleteItem = (id) => {
  return new Promise((resolve, reject) => {
    axiosInstance.delete(`${API_URL}/bbs/info/${id}`, { headers: { Pragma: 'no-cache' } }).then((response) => {
      if (response.status === 200) {
        swal('삭제되었습니다.', {
          icon: 'success',
        });
        resolve();
      }
    });
  });
};

const InfoService = {
  getListAll,
  info,
  deleteItem,
  saveItem,
};

export default InfoService;
