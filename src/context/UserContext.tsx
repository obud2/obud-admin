import React, { useState, useEffect, useMemo } from 'react';

import { getUserId, isAdminUser } from '../constants/config';

import UserService from '../services/UserService';
import { User } from '@/entities/user';

export const UserContext = React.createContext<{
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  getUser: (id: string) => Promise<boolean>;
}>({
  user: null,
  isAdmin: false,
  isLoading: false,
  getUser: () => Promise.resolve(false),
});

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const userId = getUserId() || '';

  const [data, setData] = useState<User | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchData(userId);
    }
  }, [userId]);

  // 유저 정보 호출
  const fetchData = async (id: string) => {
    try {
      await setIsLoading(true);
      const user = await UserService.getUser(id);

      setIsAdmin(isAdminUser(user));
      await setData(user);
      await setIsLoading(false);
    } catch (error) {
      await setIsLoading(false);
    }
  };

  // 유정 정보 호출 안될 시 호출 API
  const getUser = async (id: string) => {
    if (id) {
      await fetchData(id);
      return true;
    }
    return false;
  };

  const context = useMemo(
    () => ({
      user: data,
      isAdmin,
      isLoading,
      getUser,
    }),
    [data, isAdmin, isLoading],
  );
  return <UserContext.Provider value={context}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
