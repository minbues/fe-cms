import { Progress } from "antd";

const Loader = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 9999,
      background: "#1677ff",
      height: 4,
    }}
  >
    <Progress
      percent={100}
      status="active"
      showInfo={false}
      strokeColor="white"
    />
  </div>
);

export default Loader;
