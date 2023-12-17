import { API_URL } from "../constants/config";

import axiosInstance from "../constants/axiosInstance";

/**
 *
 * @param {*} param  {
 *                        toEmail:
 *                        name:
 *                    }
 * @returns
 */
const findPassword = (param) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`${API_URL}/email/findPassword`, param)
      .then((response) => {
        resolve(response?.data);
      })
      .catch(() => {
        resolve({});
      });
  });
};

const EmailService = {
  findPassword,
};

export default EmailService;
