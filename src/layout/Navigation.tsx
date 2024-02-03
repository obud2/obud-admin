import React, { useContext, useEffect } from 'react';

import _ from 'lodash';

import useMenuByRole from '../hook/useMenuByRole';
import useDrawer from '../store/useDrawer';

import { LayoutContext } from '../context/LayoutContext';

import AvatarMenu from './AvatarMenu';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup';
import NavItem from './NavItem';
import NavTitle from './NavTitle';

import { SNavigation } from './Navigation.style';

type Props = {
  open?: boolean;
  handleDrawerToggle?: () => void;
};

const Navigation = ({ open, handleDrawerToggle }: Props) => {
  const { matchese } = useContext(LayoutContext);

  const { menu, isAccess } = useMenuByRole();
  const { isDrawerOpen, onChangeDrawer } = useDrawer((state) => ({
    isDrawerOpen: state.isDrawerOpen,
    onChangeDrawer: state.onChangeDrawer,
  }));

  const onChangeDrawerHandler = (e: boolean) => {
    if (matchese) return;
    onChangeDrawer(e);
  };

  useEffect(() => {
    // if (!isAccess) navigator("/");
  }, [isAccess]);

  return (
    <SNavigation open={open || isDrawerOpen}>
      <div className="navigation-topbar">
        <div className="navigation-title">
          <img src="/img/obud_logo.png" />
        </div>
      </div>

      <div
        className="navigation-menu-container"
        onMouseOver={() => onChangeDrawerHandler(true)}
        onMouseOut={() => onChangeDrawerHandler(false)}
      >
        {!_.isEmpty(menu) ? (
          // TODO: type
          menu.map((item: any, i) => (
            <React.Fragment key={`menu_${item?.id}_${i}`}>
              {/* 그룹 아이템  : isShow 포함 */}
              {item.type === 'group' && <NavGroup item={item} />}

              {/* 제목 포함 아이템 */}
              {item.type === 'group_title' && <NavTitle item={item} />}

              {/* 하위 메뉴 아이템 : isShow 포함 */}
              {item.type === 'collapse' && <NavCollapse item={item} />}

              {/* 메뉴 아이템 : isShow 포함 */}
              {(item.type === 'item' || item.type === 'link') && <NavItem item={item} />}
            </React.Fragment>
          ))
        ) : (
          <p />
        )}
      </div>

      <div className="navigation-avatar-container">
        <AvatarMenu />
      </div>

      <div className="navigation-footer-container">
        <div className="navition-drawer-toggle-container" onClick={handleDrawerToggle}>
          <button>
            <span className="arrow-icons" />
            <span className="arrow-icons" />
            <span className="arrow-icons" />
          </button>
        </div>
      </div>
    </SNavigation>
  );
};

export default Navigation;
