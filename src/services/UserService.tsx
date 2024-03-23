import { API_URL, INSTRUCTOR } from '../constants/config';

import axiosInstance from '../constants/axiosInstance';
import { LegacyCommonResponse } from '@/entities/common';
import { User } from '@/entities/user';

const limit = 20;

const getUserExcel = () => {
  return new Promise((resolve) => {
    axiosInstance
      .get(`${API_URL}/user/all`)
      .then((response) => {
        resolve(response?.data?.value || []);
      })
      .catch(() => {
        resolve([]);
      });
  });
};

// type ListUsersRequest = {
//   cursor: string;
//   keyword: string; // 이름 or 전화번호
// };

// TODO: fix method name to listUsers
const getUserAll = (cursor: string, keyword: string): Promise<{ value: User[] }> => {
  return new Promise((resolve) => {
    const keywordTemp = keyword ? `&keyword=${keyword}` : '';
    const cursorTemp = cursor ? `&cursor=${cursor}` : '';

    axiosInstance
      .get(`${API_URL}/user/all?limit=${limit}${cursorTemp}${keywordTemp}`)
      .then((response) => {
        resolve(response?.data || { value: [] });
      })
      .catch(() => {
        resolve({ value: [] });
      });
  });
};

const getStudioInstructor = (cursor: string, keyword: string) => {
  return new Promise((resolve) => {
    const keywordTemp = keyword ? `&keyword=${keyword}` : '';
    const cursorTemp = cursor ? `&cursor=${cursor}` : '';

    axiosInstance
      .get(`${API_URL}/user?limit=${limit}${cursorTemp}${keywordTemp}`)
      .then((response) => {
        resolve(response?.data || []);
      })
      .catch(() => {
        resolve([]);
      });
  });
};

const getUserList = (cursor: string, keyword: string, group: string, role: string) => {
  return new Promise((resolve) => {
    const keywordTemp = keyword ? `&keyword=${keyword}` : '';
    const cursorTemp = cursor ? `&cursor=${cursor}` : '';
    const groupTemp = group ? `&group=${group}` : '';

    const path = role.toLowerCase() === 'admin' ? '/user/admin' : '/user';
    axiosInstance
      .get(`${API_URL}${path}?limit=${limit}${cursorTemp}${groupTemp}${keywordTemp}`)
      .then((response) => {
        resolve(response?.data || []);
      })
      .catch(() => {
        resolve([]);
      });
  });
};

const getInstructor = () => {
  return new Promise((resolve) => {
    axiosInstance
      .get(`${API_URL}/user?group=${INSTRUCTOR}`)
      .then((response) => {
        resolve(response?.data?.value || []);
      })
      .catch(() => {
        resolve([]);
      });
  });
};

const getAdminStudiosInstructor = (studiosAdminId: string) => {
  return new Promise((resolve) => {
    axiosInstance
      .get(`${API_URL}/user/instructor?studiosAdminId=${studiosAdminId}`)
      .then((response) => {
        resolve(response?.data?.value || []);
      })
      .catch(() => {
        resolve([]);
      });
  });
};

const getUser = (id: string) => {
  return axiosInstance.get<LegacyCommonResponse<User>>(`${API_URL}/user/${id}`).then((response): User => {
    return response.data.value;
  });
};

const setUser = (method: string, param: string) => {
  return new Promise((resolve) => {
    axiosInstance
      .request({
        method: method === 'new' ? 'post' : 'put',
        url: `${API_URL}/user/`,
        data: param,
      })
      .then((response) => {
        if (response?.data?.status === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
  });
};

const setInstructor = (body: any) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .put(`${API_URL}/user/instructor`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error.data.message);
      });
  });
};

/**
 *
 * @param {*} body : {
 *                        강사 ID
 *                        instructorId
 *
 *                        스튜디오 관리자 ID
 *                        studiosAdminId
 *                    }
 * @returns
 */
const deleteInstructor = (body: any) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .delete(`${API_URL}/user/instructor?instructorId=${body?.instructorId}&studiosAdminId=${body?.studiosAdminId}`)
      .then((response) => {
        resolve(response?.data || []);
      })
      .catch((error) => {
        reject(error.data.message);
      });
  });
};

type ListUsersFromNameAndPhoneRequest = {
  name: string;
  phone: string;
};

type ListUsersFromNameAndPhoneResponse = {
  value: {
    id: User['id'];
    name: User['name'];
    phone: User['phone'];
    email: User['email'];
  }[];
};

const listUsersFromNameAndPhone = async (req: ListUsersFromNameAndPhoneRequest): Promise<ListUsersFromNameAndPhoneResponse['value']> => {
  const searchParams = new URLSearchParams();
  searchParams.set('name', req.name);
  searchParams.set('phone', req.phone);

  const response = await axiosInstance.get<ListUsersFromNameAndPhoneResponse>(`${API_URL}/user/find?${searchParams.toString()}`);

  return response.data.value;
};

const UserService = {
  getUserExcel,
  getUserAll,
  getUserList,
  getUser,
  getInstructor,
  getStudioInstructor,
  getAdminStudiosInstructor,
  setUser,
  setInstructor,
  deleteInstructor,
  listUsersFromNameAndPhone,
};

export default UserService;
