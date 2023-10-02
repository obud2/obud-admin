import axios from "axios";

import {
  ALLTALK_API_KEY,
  ALLTALK_GROUP,
  API_URL,
  getJwt,
  setJwt,
} from "./index";
import { Auth } from "aws-amplify";

import awsconfig from "../../aws-exports";

Auth.configure(awsconfig);

const USER_TOKEN = getJwt();

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 1000 * 30,
  headers: {
    Pragma: "no-cache",
    CacheControl: "no-cache",
    Expires: "0",
    usertype: "admin",
    Authorization: USER_TOKEN,
    apikey: ALLTALK_API_KEY,
    groupId: ALLTALK_GROUP,
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    config.headers.usertype = "admin";
    config.headers.Authorization = USER_TOKEN;
    config.headers.Bucket = awsconfig.aws_user_files_s3_bucket;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      if (
        error.response.status === 401 ||
        error.response.data.errorCode === "COMMON_ACCESS_DENIED"
      ) {
        console.log("Token expired");
        tokenRefresh()
          .then(() => {
            console.log("Refresh token succeed");

            setTimeout(() => {
              window.location.reload();
            }, 5000);
          })
          .catch((err) => {
            alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
            window.location.href = "/pages/auth/login";
            return Promise.reject(err);
          });
      }
    }

    return Promise.reject(error.response);
  }
);

export const tokenRefresh = async () => {
  try {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    const currentSession = await Auth.currentSession();

    return new Promise((resolve, reject) => {
      cognitoUser.refreshSession(
        currentSession.getRefreshToken(),
        (err: any, session: any) => {
          if (session) {
            const { idToken } = session;

            setJwt(idToken.jwtToken);
            resolve(idToken.jwtToken);
          } else {
            reject(err.message);
            console.log(
              "Error occured while refresh token: ",
              JSON.stringify(err, null, 2)
            );
          }
        }
      );
    });
  } catch (e) {
    console.log("Unable to refresh Token: ", JSON.stringify(e, null, 2));
  }
};

export default axiosInstance;
