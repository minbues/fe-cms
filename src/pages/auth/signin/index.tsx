import React, { useEffect } from "react";
import { Form, Input, Button, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { getIsAuth, loginUser } from "../../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { Dashboard } from "src/config/routeConfig";

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(getIsAuth);
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    const resultAction = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate(Dashboard);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(Dashboard);
    }
  }, [isAuthenticated]);

  return (
    <Card style={{ width: 400 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 0 16px 0",
          fontWeight: "bold",
        }}
      >
        <span
          className="brand-name"
          style={{
            fontSize: "28px",
            fontWeight: 600,
            fontFamily: "'Lobster', cursive",
            color: "#d1567c",
            cursor: "pointer",
            userSelect: "none",
            letterSpacing: "1.5px",
          }}
        >
          Pinky
        </span>
      </div>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        validateTrigger={["onBlur"]}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SignIn;
