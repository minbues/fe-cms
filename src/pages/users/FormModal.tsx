import { Modal, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { UserModalProps } from "../../props/Users/UserModalProps";
import { UserType } from "../../shared/enum";
import { capitalizeFirstLetter } from "src/shared/common";

const UserFormModal = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isViewMode = false,
  isLoadingAction = false,
}: UserModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        role: initialValues.role?.id,
        id: initialValues.id,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  return (
    <Modal
      title={
        isViewMode
          ? "Chi tiết người dùng"
          : initialValues
            ? "Cập nhật người dùng"
            : "Tạo người dùng"
      }
      open={open}
      onCancel={onClose}
      onOk={() => {
        if (!isViewMode) form.submit();
        else onClose();
      }}
      afterClose={() => form.resetFields()}
      okText={isViewMode ? "Đóng" : "Lưu"}
      cancelText="Hủy"
      confirmLoading={isLoadingAction && !isViewMode}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input disabled={isViewMode} />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            {
              validator: (_, value) =>
                !value || /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
                  ? Promise.resolve()
                  : Promise.reject("Email không đúng định dạng"),
            },
          ]}
          validateTrigger="onSubmit"
        >
          <Input disabled={isViewMode} />
        </Form.Item>
        {!initialValues && (
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
            ]}
            validateTrigger="onSubmit"
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select disabled={isViewMode}>
            {Object.entries(UserType)
              .filter(([, value]) => typeof value === "number")
              .map(([key, value]) => (
                <Select.Option key={value} value={value}>
                  {capitalizeFirstLetter(key)}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
