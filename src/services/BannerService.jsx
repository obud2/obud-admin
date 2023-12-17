import { API_URL } from "../constants/config";

import axiosInstance from "../constants/axiosInstance";

const info = (id) => {
  return new Promise((resolve) => {
    axiosInstance.get(`${API_URL}/banner/${id}`).then((response) => {
      resolve(response?.data?.value || {});
    });
  });
};

const saveItem = (type, param) => {
  return new Promise((resolve, reject) => {
    if (param.createdAt) delete param.createdAt;
    axiosInstance
      .request({
        method: type === "new" ? "post" : "put",
        url: `${API_URL}/banner/`,
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

const BannerService = {
  info,
  saveItem,
};

export default BannerService;
