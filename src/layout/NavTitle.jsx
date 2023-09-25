import React, { useState, useEffect } from 'react';

import NavCollapse from './NavCollapse';
import NavItem from './NavItem';

import { SNavTitle } from './NavTitle.styled';

const NavTitle = ({ item }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    const EVENT_ID = sessionStorage.getItem('EVENT_ID');
    const EVENT_NM = sessionStorage.getItem('EVENT_NM');

    if (EVENT_ID && EVENT_NM) {
      setTitle(`${EVENT_ID} - ( ${EVENT_NM} )`);
    }
  }, []);

  return (
    <React.Fragment>
      <SNavTitle>
        <p className="nav-group-title">
          {item?.title}
          <b className="nav-group-evt-title">{title}</b>
        </p>
      </SNavTitle>
      {item.children &&
        item.children.map((item) => (
          <React.Fragment key={item.id}>
            {item.type === 'collapse' && <NavCollapse item={item} />}

            {item.type === 'item' && <NavItem item={item} />}
          </React.Fragment>
        ))}
    </React.Fragment>
  );
};

export default React.memo(NavTitle);
