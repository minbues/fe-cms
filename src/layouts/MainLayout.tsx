import { Layout, Spin, theme } from "antd";

import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
const { Content } = Layout;
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { getMasterData } from "../redux/appSlice";
import { Suspense, useEffect } from "react";
import { getSegments } from "../redux/segmentSlice";

const MainLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getMasterData());
    dispatch(getSegments());
  }, []);

  return (
    <Layout style={{ flex: 1, minHeight: "100vh" }}>
      <Layout
        style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Sidebar />
        <Content
          style={{
            padding: "24px",
            flex: 1,
            background: "#f0f2f5",
          }}
        >
          <Suspense fallback={<Spin size="large" fullscreen={true} />}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
      <ToastContainer draggable draggableDirection="y" />
    </Layout>
  );
};

export default MainLayout;
