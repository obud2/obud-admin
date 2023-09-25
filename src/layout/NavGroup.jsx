import React from 'react';

import NavCollapse from './NavCollapse';
import NavItem from './NavItem';

import { SNavGroup } from './NavGroup.styled';

const NavGroup = (props) => {
  const { item } = props;

  return (
    item?.isShow && (
      <SNavGroup>
        {item.children &&
          item.children.map((item) => (
            <React.Fragment key={item.id}>
              {item.type === 'collapse' && <NavCollapse item={item} />}

              {(item.type === 'item' || item.type === 'link') && <NavItem item={item} />}
            </React.Fragment>
          ))}
      </SNavGroup>
    )
  );
};

export default React.memo(NavGroup);
