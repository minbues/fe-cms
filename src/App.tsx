import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import router from "./routers";
import "./App.css";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import "./config/i18nConfig";
import { IntlProvider } from "react-intl";
import { PersistGate } from "redux-persist/integration/react";
import { SocketProvider } from "./providers/socketProvider";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          colorBgContainer: "#ffffff",
        },
        algorithm: undefined,
      }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <IntlProvider locale="vi-VN">
            <SocketProvider>
              <RouterProvider router={router} />
            </SocketProvider>
          </IntlProvider>
        </PersistGate>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
