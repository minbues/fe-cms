import { Modal, Form, Input, DatePicker, Col, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { disabledPastDate } from "../../shared/common";
import { EventTypeLabel, formatDateTime } from "../../shared/constants";
import dayjs from "dayjs";
import { EventModalProps } from "../../props/Events/EventModalProps";
import { DiscountEventEnum } from "../../shared/enum";
import {
  getAllCategory,
  getAllSubCategory,
  getListCategory,
  getListSubCategory,
} from "../../redux/segmentSlice";
import { useSelector } from "react-redux";
import {
  UpdateCategoryResponse,
  UpdateSubCategoryResponse,
} from "../../interfaces/segment.interface";

const EventFormModal = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isLoadingAction = false,
  dispatch,
  readOnly = false,
}: EventModalProps & { readOnly?: boolean }) => {
  const [form] = Form.useForm();
  const categoryRedux = useSelector(getListCategory);
  const subCategoryRedux = useSelector(getListSubCategory);
  const [category, setCategory] = useState<UpdateCategoryResponse[]>([]);
  const [subCategory, setSubCategory] = useState<UpdateSubCategoryResponse[]>(
    []
  );

  const selectedType = Form.useWatch("type", form);

  useEffect(() => {
    dispatch(getAllCategory());
    dispatch(getAllSubCategory());
  }, [dispatch]);

  useEffect(() => {
    setCategory(categoryRedux);
    setSubCategory(subCategoryRedux);
  }, [categoryRedux, subCategoryRedux]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startTime: initialValues.startTime
          ? dayjs(initialValues.startTime)
          : undefined,
        endTime: initialValues.endTime
          ? dayjs(initialValues.endTime)
          : undefined,
      });
    }
  }, [initialValues, form]);

  return (
    <Modal
      title={initialValues ? "Chi tiết sự kiện" : "Tạo sự kiện"}
      open={open}
      onCancel={onClose}
      onOk={() => {
        if (!readOnly) form.submit();
        else onClose();
      }}
      afterClose={() => {
        form.resetFields();
      }}
      okText={initialValues ? (readOnly ? "Đóng" : "Ok") : "Xác nhận"}
      cancelText={readOnly ? null : "Hủy"}
      cancelButtonProps={readOnly ? { style: { display: "none" } } : undefined}
      confirmLoading={isLoadingAction}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên sự kiện"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sự kiện" }]}
        >
          <Input placeholder="Sự kiện giảm giá" />
        </Form.Item>

        <Form.Item
          label="Loại mã khuyến mại"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại mã" }]}
        >
          <Select placeholder="Chọn loại mã">
            {Object.entries(DiscountEventEnum)
              .filter(([, value]) => typeof value === "string")
              .map(([value]) => (
                <Select.Option key={value} value={value}>
                  {EventTypeLabel[value as DiscountEventEnum]}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        {selectedType === DiscountEventEnum.CATEGORY && (
          <Form.Item
            label="Chọn danh mục"
            name="pid"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select
              showSearch
              placeholder="Tìm kiếm danh mục"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {category.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {selectedType === DiscountEventEnum.SUBCATEGORY && (
          <Form.Item
            label="Chọn danh mục con"
            name="subCategoryId"
            rules={[{ required: true, message: "Vui lòng chọn danh mục con" }]}
          >
            <Select
              showSearch
              placeholder="Tìm kiếm danh mục con"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {subCategory.map((sub) => (
                <Select.Option key={sub.id} value={sub.id}>
                  {sub.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label="Mức giảm giá (%)"
          name="discount"
          rules={[{ required: true, message: "Vui lòng nhập mức giảm giá" }]}
        >
          <Input type="number" placeholder="10" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Thời gian bắt đầu"
              name="startTime"
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
              name="endTime"
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
      </Form>
    </Modal>
  );
};

export default EventFormModal;
