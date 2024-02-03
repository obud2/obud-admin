import axios from 'axios';
import { API_URL } from '../constants/config';
import axiosInstance from '../constants/axiosInstance';

const getList = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/code`)
      .then((res) => resolve(res?.data))
      .catch(reject);
  });
};

const getItem = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/code/${id}`)
      .then((res) => resolve(res?.data))
      .catch(reject);
  });
};

const getListByGroup = (group) => {
  //console.log("getListByGroup:", group);
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/code/group/${group}`)
      .then((res) => resolve(res.data?.value))
      .catch(reject);
  });
};

const saveItem = (type, param) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: type === 'new' ? 'post' : 'put',
        url: `${API_URL}/code`,
        data: param,
      })
      .then((response) => {
        resolve(response.data.value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteItem = (id) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'delete',
        url: `${API_URL}/code/${id}`,
      })
      .then((response) => {
        resolve(response.data.value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const dashBorder = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/code/dash`)
      .then((res) => resolve(res?.data?.value || ''))
      .catch(reject);
  });
};

const CodeService = {
  getList,
  getItem,
  getListByGroup,
  saveItem,
  deleteItem,

  dashBorder,
};

export default CodeService;
