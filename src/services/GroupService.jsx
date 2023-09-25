import { API_URL } from '../constants';
import axiosInstance from '../constants/axiosInstance';

const getList = () =>
  new Promise((resolve, reject) => {
    axiosInstance
      .get(API_URL + '/user/group')
      .then((response) => {
        resolve(response.data.value.sort((a, b) => a?.id > b?.id));
      })
      .catch(reject);
  });

const getItem = (id) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .get(API_URL + '/user/group/' + id)
      .then((response) => resolve(response.data.value))
      .catch(reject);
  });

const createItem = (param) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .post(API_URL + '/user/group', param)
      .then((response) => resolve(response.data.value))
      .catch(reject);
  });

const updateItem = (param) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .put(API_URL + '/user/group/', param)
      .then((response) => resolve(response.data.value))
      .catch(reject);
  });

const deleteItem = (id) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .delete(API_URL + '/user/group/' + id)
      .then(resolve)
      .catch(reject);
  });

const GroupService = {
  getList,
  getItem,
  createItem,
  updateItem,
  deleteItem,
};

export default GroupService;
