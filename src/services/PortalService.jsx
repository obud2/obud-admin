import axios from 'axios';
import axiosInstance from '../constants/axiosInstance';
import { ALLTALK_GROUP } from '../constants/config';

const CNS_SERVER = 'https://talkapi.lgcns.com';
const CNS_SN = 'squid';
const API_TOKEN = 'V6SPN3wK0tT9qgQzmJATYw==';
const API = 'https://api.alltalk.co.kr';
// const API = 'http://localhost:6005';
const requestToken = (channelId, phoneNumber) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'post',
        url: `${API}/portal/requestToken`,
        data: { channelId, phoneNumber },
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
const addChannel = (data) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'post',
        url: `${API}/portal/addChannel`,
        data,
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(err.data);
        alert(err.data.message);
        reject(err.message);
      });
  });
};
const addService = (data) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'post',
        url: `${API}/portal/addService`,
        data,
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(err.data);
        alert(err.data.message);
        reject(err.message);
      });
  });
};

const addGroup = (data) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'post',
        url: `${API}/portal/addGroup`,
        data,
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(err.data);
        alert(err.data.message);
        reject(err.message);
      });
  });
};

const getCategory = (channelId, phoneNumber) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'get',
        url: `${API}/portal/category`,
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
const getChannelList = (groupId) => {
  const param = `?groupId=${groupId}`;
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'get',
        url: `${API}/portal/channel${param}`,
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
const deleteChannel = (groupId, channelId) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'delete',
        url: `${API}/portal/deleteChannel?groupId=${groupId}&channelId=${channelId}`,
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(err);
        alert(err.data.message);
        reject(err);
      });
  });
};

const deleteService = (serviceId, groupId, channelId, tit) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'delete',
        url: `${API}/portal/deleteService?serviceId=${serviceId}&groupId=${groupId}&channelId=${channelId}&tit=${tit}`,
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(err);
        alert(err.data.message);
        reject(err);
      });
  });
};
const sendSMS = (data, type) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'post',
        url: `${API}/sms/${type === 'LMS' ? 'lms' : ''}`,
        data,
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(err);
        alert(err.data.message);
        reject(err.message);
      });
  });
};
const sendFriendTalk = (data) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'post',
        url: `${API}/friendTalk/`,
        data,
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(err.data);
        alert(err.data.message);
        reject(err.message);
      });
  });
};
const sendAlimTalk = (data) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'post',
        url: `${API}/alimTalk/`,
        data,
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(err.data);
        alert(err.data.message);
        reject(err.message);
      });
  });
};
const addTemplate = (data, imgSize) => {
  return new Promise((resolve, reject) => {
    const url = imgSize > 0 ? `${API}/portal/addTemplateWithImage/` : `${API}/portal/addTemplate/`;
    axiosInstance
      .request({
        method: 'post',
        url: `${url}`,
        data,
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(err.data);
        alert(err.data.message);
        reject(err.message);
      });
  });
};
const requestRelease = (data) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'post',
        url: `${API}/portal/requestRelease/`,
        data,
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(err.data);
        alert(err.data.message);
        reject(err.message);
      });
  });
};

const getTemplateList = (channelId) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        method: 'get',
        url: `${API}/portal/templateList?channelId=${channelId}&groupId=${ALLTALK_GROUP}`,
      })
      .then((response) => {
        console.log(response);
        resolve(response.data.data.list);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
const uploadImage = (uploadList) => {
  const formData = new FormData();
  if (uploadList.length > 0) {
    formData.append('image', uploadList[0].originFileObj);
  } else {
    return new Promise((resolve) => {
      resolve();
    });
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${CNS_SERVER}/friendTalk/uploadWideImage/kakao.bin`, formData, {
        headers: {
          authToken: API_TOKEN,
          serverName: CNS_SN,
        },
      })
      .then(async (result) => {
        console.log(result.data);
        resolve(result.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const getSendList = (groupId, searchItem, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const keyword = searchItem?.keyword ? `&keyword=${searchItem.keyword}` : '';
    const _groupId = groupId ? `groupId=${groupId}` : '';
    const start = startDate ? `&startDate=${startDate}` : '';
    const end = endDate ? `&endDate=${endDate}` : '';
    console.log(startDate, endDate);
    axiosInstance.get(`${API}/send/all?${_groupId}${keyword}${start}${end}`).then((response) => {
      if (response.data && response.data.value) {
        const val = response.data.value.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

        resolve({
          list: val,
          total: response.data.count > 0 ? response.data.count : response.data.total,
          cursor: response.data.cursor,
          backCursor: response.data.backCursor,
        });
      }
    });
  });
};

const getGroupInfo = (id) =>
  new Promise((resolve, reject) => {
    axiosInstance
      .get(`${API}/group/${id}`)
      .then((response) => resolve(response.data.value))
      .catch(reject);
  });

const getCodeListByGroup = (group) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API}/code/group/${group}`)
      .then((res) => resolve(res.data?.value))
      .catch(reject);
  });
};

const PortalService = {
  requestToken,
  getCategory,
  addChannel,
  getChannelList,
  deleteChannel,
  sendFriendTalk,
  addService,
  deleteService,
  addGroup,
  addTemplate,
  getTemplateList,
  requestRelease,
  sendAlimTalk,
  uploadImage,
  sendSMS,
  getSendList,
  getGroupInfo,
  getCodeListByGroup,
};

export default PortalService;
