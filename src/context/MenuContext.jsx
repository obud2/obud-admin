import React, { useState, useEffect } from 'react';

import { NavigationConfig, NavigationMenu } from '../config/NavigationConfig';

export const MenuContext = React.createContext();

/**
 *
 * @param {} props
 * @returns 메뉴
 */
const MenuContextPrivider = (props) => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const concat = NavigationConfig.concat(NavigationMenu);
    const temp = Object.assign({}, concat);

    Object.values(temp).forEach((value, i) => {
      const key = `0-${i}`;

      value['key'] = key;

      value?.children?.forEach((c, i) => {
        const keyC = `${key}-${i}`;
        c['key'] = keyC;
      });
    });

    setMenu(Object.values(temp));
  }, []);

  return <MenuContext.Provider value={{ menu: menu || [] }}>{props.children}</MenuContext.Provider>;
};

export default MenuContextPrivider;
