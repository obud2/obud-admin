// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, useContext } from 'react';

import { getNavigationConfig, getNavigationMenu } from '../config/NavigationConfig';
import { UserContext } from '@/context/UserContext.tsx';

export const MenuContext = React.createContext();

function updateMenu(isAdmin: boolean, setMenu: (value: ((prevState: any[]) => any[]) | any[]) => void) {
  const concat = getNavigationConfig(isAdmin).concat(getNavigationMenu(isAdmin));
  const temp = { ...concat };

  Object.values(temp).forEach((value, i) => {
    const key = `0-${i}`;

    value.key = key;

    value?.children?.forEach((c, i) => {
      const keyC = `${key}-${i}`;
      c.key = keyC;
    });
  });

  setMenu(Object.values(temp));
}

const MenuContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [menu, setMenu] = useState([]);
  const { isAdmin } = useContext(UserContext);

  useEffect(() => {
    updateMenu(isAdmin, setMenu);
  }, [isAdmin]);

  return <MenuContext.Provider value={{ menu: menu || [] }}>{children}</MenuContext.Provider>;
};

export default MenuContextProvider;
