import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  RadioChangeEvent,
  Col,
  Row,
} from "antd";
import { useEffect, useState } from "react";
import { VoucherType } from "../../shared/enum";
import { disabledPastDate } from "../../shared/common";
import { formatDateTime, VoucherTypeLabel } from "../../shared/constants";
import { VoucherModalProps } from "src/props/Vouchers/VoucherModalProps";
import dayjs from "dayjs";

const VoucherFormModal = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isLoadingAction = false,
}: VoucherModalProps) => {
  const [form] = Form.useForm();
  const [limitType, setLimitType] = useState<"unlimit" | "limited">("unlimit");

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startDate: initialValues.startDate
          ? dayjs(initialValues.startDate)
          : undefined,
        endDate: initialValues.endDate
          ? dayjs(initialValues.endDate)
          : undefined,
        quantity: initialValues.quantity,
      });

      if (initialValues.quantity) {
        setLimitType("limited");
      } else {
        setLimitType("unlimit");
      }
    }
  }, [initialValues, form]);

  const handleLimitChange = (e: RadioChangeEvent) => {
    setLimitType(e.target.value);
  };

  return (
    <Modal
      title={initialValues ? "Cập nhật mã khuyến mãi" : "Tạo mã khuyến mãi"}
      open={open}
      onCancel={onClose}
      onOk={() => {
        form.submit();
      }}
      afterClose={() => {
        form.resetFields();
        setLimitType("unlimit");
      }}
      okText={"Lưu"}
      cancelText="Hủy"
      confirmLoading={isLoadingAction}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Loại mã khuyến mại"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại mã" }]}
        >
          <Select>
            {Object.entries(VoucherType)
              .filter(([, value]) => typeof value === "string")
              .map(([value]) => (
                <Select.Option key={value} value={value}>
                  {VoucherTypeLabel[value as VoucherType]}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Mã khuyến mãi"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi" }]}
        >
          <Input placeholder="VC10K-START-END" />
        </Form.Item>

        <Form.Item
          label="Mức giảm giá (% hoặc K)"
          name="discount"
          rules={[{ required: true, message: "Vui lòng nhập mức giảm giá" }]}
        >
          <Input type="number" placeholder="10 or 100000" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Thời gian bắt đầu"
              initialValue={dayjs()}
              name="startDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu" },
              ]}
            >
              <DatePicker
                showTime
                format={formatDateTime}
                style={{ width: "100%" }}
                disabledDate={disabledPastDate}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Thời gian kết thúc"
              initialValue={dayjs().add(1, "hour")}
              name="endDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc" },
              ]}
            >
              <DatePicker
                showTime
                format={formatDateTime}
                style={{ width: "100%" }}
                disabledDate={disabledPastDate}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Số lượng mã khuyến mãi" required>
          <Radio.Group onChange={handleLimitChange} value={limitType}>
            <Radio value="unlimit">Không giới hạn</Radio>
            <Radio value="limited">Có số lượng nhất định</Radio>
          </Radio.Group>
        </Form.Item>

        {limitType === "limited" && (
          <Form.Item
            label="Nhập số lượng"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default VoucherFormModal;
