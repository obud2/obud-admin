// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useContext, useEffect, useState } from 'react';

import Amplify, { Auth } from 'aws-amplify';
import awsmobile from '../../aws-exports';

import { useNavigate } from 'react-router-dom';
import { MenuContext } from '../context/MenuContext';
import { UserContext } from '../context/UserContext';
import { userLogout } from '../constants/config';

import swal from 'sweetalert';

import GroupService from '../services/GroupService';

Amplify.configure(awsmobile);

const useMenuByRole = () => {
  const navigate = useNavigate();

  const [navigation, setNavation] = useState([]);
  const [isAccess, setIsAccess] = useState(true);

  const { user } = useContext(UserContext);
  const { menu } = useContext(MenuContext);

  // 메뉴 및 그룹 확인 후 메뉴 표시 여부 체크
  useEffect(() => {
    if (menu?.length && user?.group) {
      const getInit = async () => {
        GroupService.getItem(user?.group).then((res) => {
          const select = res?.auth || [];

          if (!select?.length > 0) {
            swal({
              text: '접근이 불가능합니다.',
            }).then(() => {
              userLogout();

              Auth.signOut().then(() => {
                navigate('/pages/auth/login');
              });
            });

            return;
          }

          setNavation(menu);
        });
      };

      getInit();
    }
  }, [menu, user]);

  // 해당 페이지에 권한 있는지 체크
  useEffect(() => {
    if (navigation && navigation?.length > 0) {
      const pathname = location.pathname;
      let nowPage = '';

      navigation?.forEach((a) => {
        if (a?.url === pathname) {
          nowPage = a;
          return;
        }

        a?.children?.forEach((b) => {
          if (b?.url === pathname) {
            nowPage = b;
          }
        });
      });

      // 모바일 Drawer 접근 처리
      if (pathname === '/mobile/menu') {
        nowPage = {
          isShow: true,
        };
      }

      setIsAccess(nowPage?.isShow);
    }
  }, [navigation, location]);

  return {
    menu: navigation,
    isAccess,
  };
};

export default useMenuByRole;
