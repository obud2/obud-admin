import { API_URL } from '../constants/config';
import axiosInstance from '../constants/axiosInstance';

const getItem = (id) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .get(`${API_URL}/user/group/${id}`)
      .then((response) => resolve(response.data.value))
      .catch(reject);
  });

const updateItem = (param) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .put(`${API_URL}/user/group/`, param)
      .then((response) => resolve(response.data.value))
      .catch(reject);
  });

const GroupService = {
  getItem,
  updateItem,
};

export default GroupService;
