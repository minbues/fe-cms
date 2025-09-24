import React from "react";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import useMenuItems from "../config/menuConfig";
import { Login } from "../config/routeConfig";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { clearAuth, logoutUser } from "../redux/authSlice";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const menuItems = useMenuItems();
  const location = useLocation();
  const currentPath = location.pathname;
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    navigate(Login);
    dispatch(logoutUser());
    dispatch(clearAuth());
  };

  return (
    <Sider
      width={250}
      style={{
        background: "#fff",
        maxHeight: "100vh",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          fontWeight: "bold",
        }}
      >
        <span
          className="brand-name"
          style={{
            marginLeft: "10px",
            fontSize: "28px",
            fontWeight: 600,
            fontFamily: "'Lobster', cursive",
            color: "black",
            cursor: "pointer",
            userSelect: "none",
            letterSpacing: "1.5px",
          }}
          onClick={() => navigate("/")}
        >
          TrendX
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentPath]}
          defaultOpenKeys={[currentPath]}
          items={menuItems}
          onClick={({ key }) => {
            if (key === "logout") {
              handleLogout();
            } else {
              navigate(key);
            }
          }}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;
