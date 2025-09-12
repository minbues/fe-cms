import { Outlet } from "react-router-dom";
import { Layout, Spin } from "antd";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";

const { Content } = Layout;

const MinimalLayout = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "#eef2f6",
      }}
    >
      <Content>
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Suspense fallback={<Spin size="large" fullscreen={true} />}>
            <Outlet />
          </Suspense>
        </div>
      </Content>
      <ToastContainer draggable draggableDirection="y" />
    </Layout>
  );
};

export default MinimalLayout;
