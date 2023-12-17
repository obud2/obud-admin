import React, { useContext } from "react";

import { UserContext } from "../context/UserContext";
import { GlobalContext } from "../context/GlobalContext";
import { NavigationContext } from "../context/NavigationContext";

import { SAvatarMenu } from "./AvatarMenu.styled";
import { userLogout } from "../constants/config";

import { useNavigate } from "react-router-dom";

import Amplify, { Auth } from "aws-amplify";
import awsconfig from "../../aws-exports";
import useDrawer from "../store/useDrawer";

import Skeleton from "../components/common/skeleton/Skeleton";

import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { BsMoonFill } from "react-icons/bs";
import { BsSun } from "react-icons/bs";

import SubMain from "../sub-main";

Amplify.configure(awsconfig);

const AvatarMenu = () => {
  const navigate = useNavigate();

  const { user, isLoading } = useContext(UserContext);
  const { open } = useContext(NavigationContext);
  const { theme, themeSwitchHandler } = useContext(GlobalContext);

  const { isDrawerOpen } = useDrawer((state) => ({
    isDrawerOpen: state.isDrawerOpen,
  }));

  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  const onClickThemeSwitch = () => {
    handleToggle();
    themeSwitchHandler(theme === "dark" ? "light" : "dark");
  };

  const logout = () => {
    userLogout();

    Auth.signOut().then((r) => {
      navigate("/pages/auth/login");
    });
  };

  return (
    <SAvatarMenu open={open || isDrawerOpen}>
      <button className="avatar-user-data-container" onClick={handleToggle}>
        <Avatar icon={<UserOutlined />} />

        <p className="user-info">
          {isLoading ? (
            <Skeleton type="text" width="70px" />
          ) : (
            user?.name || user?.id
          )}
        </p>
      </button>

      {isOpen && (
        <SubMain>
          <SAvatarMenu>
            <div className="avatar-option-background" onClick={handleToggle} />

            <div className="avatar-option-container">
              <div className="user-info-container">
                <p className="user-email">{user?.email || "-"}</p>
                <p className="user-name">{user?.name || "-"}</p>
              </div>

              <button className="button" onClick={onClickThemeSwitch}>
                <span>
                  {theme === "light" ? <p>다크테마</p> : <p>라이트테마</p>}
                </span>
                {theme === "light" ? <BsMoonFill /> : <BsSun />}
              </button>

              <span className="line" />

              <button className="button" onClick={logout}>
                로그아웃
              </button>
            </div>
          </SAvatarMenu>
        </SubMain>
      )}
    </SAvatarMenu>
  );
};

export default AvatarMenu;
