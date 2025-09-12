import { Modal, Form, Input, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons"; // icon check và loading
import { BankMap } from "../../shared/constants";
import { PaymentModalProps } from "../../props/Banks/PaymentModalProps";
import { checkAccountInfo } from "../../services/vietqr";
import { showToast, ToastType } from "../../shared/toast";

const PaymentFormModal = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isLoadingAction = false,
}: PaymentModalProps) => {
  const [form] = Form.useForm();
  const [loadingCheck, setLoadingCheck] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
    }
  }, [initialValues, form]);

  const handleCheckAccount = async () => {
    const accountNo = form.getFieldValue("accountNo");
    const acqId = form.getFieldValue("acqId");

    if (!accountNo || !acqId) {
      return showToast(
        ToastType.INFO,
        "Vui lòng nhập số tài khoản và chọn ngân hàng"
      );
    }

    setLoadingCheck(true);

    try {
      const result = await checkAccountInfo(accountNo, acqId);

      if (result.success) {
        form.setFieldsValue({ accountName: result.accountName });
        showToast(ToastType.ERROR, "Số tài khoản hợp lệ");
      } else {
        form.setFieldsValue({ accountName: "" });
        showToast(ToastType.ERROR, result.errorMessage);
      }
    } catch (error) {
      form.setFieldsValue({ accountName: "" });
      showToast(ToastType.ERROR, "Có lỗi xảy ra khi kiểm tra số tài khoản");
    } finally {
      setLoadingCheck(false);
    }
  };

  return (
    <Modal
      title={initialValues ? "Cập nhật tài khoản" : "Tạo tài khoản"}
      open={open}
      onCancel={onClose}
      onOk={() => {
        form.submit();
      }}
      afterClose={() => {
        form.resetFields();
      }}
      okText={"Lưu"}
      cancelText="Hủy"
      confirmLoading={isLoadingAction}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {initialValues?.id && (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        )}

        <Form.Item
          label="Ngân hàng"
          name="acqId"
          rules={[{ required: true, message: "Vui lòng chọn ngân hàng" }]}
          validateTrigger="onSubmit"
        >
          <Select
            showSearch
            placeholder="Chọn ngân hàng"
            optionFilterProp="children"
            onChange={() => form.setFieldValue("accountName", "")}
          >
            {Object.entries(BankMap).map(([acqId, bankName]) => (
              <Select.Option key={acqId} value={Number(acqId)}>
                {bankName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Số tài khoản"
          name="accountNo"
          rules={[{ required: true, message: "Vui lòng nhập số tài khoản" }]}
          validateTrigger="onSubmit"
        >
          <Input
            placeholder="05844059999"
            suffix={
              loadingCheck ? (
                <LoadingOutlined style={{ color: "#1890ff", fontSize: 24 }} />
              ) : (
                <CheckCircleOutlined
                  style={{ color: "#1890ff", cursor: "pointer" }}
                  onClick={handleCheckAccount}
                />
              )
            }
          />
        </Form.Item>

        <Form.Item
          label="Chủ sở hữu"
          name="accountName"
          rules={[
            { required: true, message: "Không xác định được chủ sở hữu" },
          ]}
          validateTrigger="onSubmit"
        >
          <Input
            placeholder="NGUYEN VAN A"
            value={form.getFieldValue("accountName")?.toUpperCase()}
            onChange={(e) =>
              form.setFieldsValue({ accountName: e.target.value.toUpperCase() })
            }
          />
        </Form.Item>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>Trạng thái hoạt động</span>
          <Form.Item name="isActive" valuePropName="checked" noStyle>
            <Switch />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default PaymentFormModal;
