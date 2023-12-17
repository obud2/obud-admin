import React, { useState, useEffect } from "react";

import { ADMIN, getUserId } from "../constants/config";

import UserService from "../services/UserService";

export const UserContext = React.createContext();

/**
 *
 * @param {} props
 * @returns 로그인 유저 정보
 */
const UserContextPrivider = (props) => {
  const userId = getUserId() || "";

  const [data, setData] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchData(userId);
    }
  }, [userId]);

  // 유저 정보 호출
  const fetchData = async (id) => {
    try {
      await setIsLoading(true);
      const res = await UserService.getUser(id);

      if (res?.group === ADMIN) setIsAdmin(true);

      await setData(res);
      await setIsLoading(false);
    } catch (error) {
      await setIsLoading(false);
    }
  };

  // 유정 정보 호출 안될 시 호출 API
  const getUser = async (id) => {
    if (id) {
      return new Promise((resolve) => {
        fetchData(id);
        resolve(true);
      });
    }
  };

  // 유저 정보 업데이트 API
  const updateUser = async (param) => {
    return new Promise((resolve) => {
      UserService.setUserInfo(param).then((res) => {
        fetchData(userId);
        resolve(res);
      });
    });
  };

  const clearUser = () => {
    setData({});
  };

  return (
    <UserContext.Provider
      value={{
        user: data || {},
        isAdmin: isAdmin,
        isLoading: isLoading,

        getUser,
        updateUser,
        clearUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextPrivider;
