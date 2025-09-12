import React, { useEffect } from "react";
import { Modal, Form, Input, Switch } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  createCategory,
  createSegment,
  createSubCategory,
  updateCategory,
  updateSegment,
  updateSubCategory,
} from "../../redux/segmentSlice";

interface SegmentModalProps {
  isOpen: boolean;
  type: "create" | "update" | "delete" | null;
  record: any | null;
  onClose: () => void;
}

const SegmentModal: React.FC<SegmentModalProps> = ({
  isOpen,
  type,
  record,
  onClose,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (type === "create" && record?.type === "Segment") {
      form.setFieldsValue({
        name: "",
        segmentId: record?.segment.id,
        segmentName: record?.segment.name,
      });
    }
    if (type === "create" && record?.type === "Category") {
      form.setFieldsValue({
        name: "",
        segmentId: record?.segment.id,
        segmentName: record?.segment.name,
        categoryName: record?.category.name,
        categoryId: record?.category.id,
      });
    }
    if (type === "update" && record?.type === "Segment") {
      form.setFieldsValue({
        id: record.key,
        name: record.name,
        isActive: record.isActive,
      });
    }
    if (type === "update" && record?.type === "Category") {
      form.setFieldsValue({
        id: record.key,
        name: record.name,
        segmentId: record?.segment.id,
        segmentName: record?.segment.name,
        isActive: record.isActive,
      });
    }
    if (type === "update" && record?.type === "SubCategory") {
      form.setFieldsValue({
        id: record.key,
        name: record.name,
        segmentId: record?.segment.id,
        segmentName: record?.segment.name,
        categoryId: record?.category.id,
        categoryName: record?.category.name,
        isActive: record.isActive,
      });
    }
  }, [record, form, type]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (type === "create") {
          if (!record) {
            dispatch(createSegment({ name: values.name }));
          } else if (record?.type === "Segment") {
            dispatch(
              createCategory({
                name: values.name,
                segmentId: values.segmentId,
              })
            );
          } else if (record?.type === "Category") {
            dispatch(
              createSubCategory({
                name: values.name,
                segmentId: values.segmentId,
                categoryId: values.categoryId,
              })
            );
          }
        }

        if (type === "update") {
          if (record?.type === "Segment") {
            dispatch(
              updateSegment({
                id: values.id,
                segmentData: {
                  name: values.name,
                  isActive: true,
                },
              })
            );
          }
          if (record?.type === "Category") {
            dispatch(
              updateCategory({
                id: values.id,
                categoryData: {
                  name: values.name,
                  isActive: values.isActive,
                  segmentId: values.segmentId,
                },
              })
            );
          }
          if (record?.type === "SubCategory") {
            dispatch(
              updateSubCategory({
                id: values.id,
                subCategoryData: {
                  name: values.name,
                  isActive: values.isActive,
                  segmentId: values.segmentId,
                  categoryId: values.categoryId,
                },
              })
            );
          }
        }

        form.resetFields();
        onClose();
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };

  const renderInput = () => {
    if (type === "create") {
      if (!record) {
        return (
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Phân khúc"
              rules={[
                { required: true, message: "Vui lòng nhập tên phân khúc" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        );
      }

      if (record.type === "Segment") {
        return (
          <Form form={form} layout="vertical">
            <Form.Item name="segmentId" hidden>
              <Input />
            </Form.Item>

            <Form.Item name="segmentName" label="Phân khúc">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="name"
              label="Danh mục"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        );
      }

      if (record.type === "Category") {
        return (
          <Form form={form} layout="vertical">
            <Form.Item name="segmentId" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="categoryId" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="segmentName" label="Phân khúc">
              <Input disabled />
            </Form.Item>
            <Form.Item name="categoryName" label="Danh mục">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="name"
              label="Danh mục phụ"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục phụ" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        );
      }
    }

    if (type === "update") {
      if (record.type === "Segment") {
        return (
          <Form form={form} layout="vertical">
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="name"
              label="Phân khúc"
              rules={[
                { required: true, message: "Vui lòng nhập tên phân khúc" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              layout="horizontal"
              name="isActive"
              label="Trạng thái"
              valuePropName="checked"
            >
              <Switch size="small" />
            </Form.Item>
          </Form>
        );
      }
      if (record.type === "Category") {
        return (
          <Form form={form} layout="vertical">
            <Form.Item name="segmentId" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="segmentName"
              label="Phân khúc"
              rules={[
                { required: true, message: "Vui lòng nhập tên phân khúc" },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item name="id" hidden>
              <Input hidden />
            </Form.Item>
            <Form.Item
              name="name"
              label="Danh mục"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              layout="horizontal"
              name="isActive"
              label="Trạng thái"
              valuePropName="checked"
            >
              <Switch size="small" />
            </Form.Item>
          </Form>
        );
      }
      if (record.type === "SubCategory") {
        return (
          <Form form={form} layout="vertical">
            <Form.Item name="segmentId" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="segmentName"
              label="Phân khúc"
              rules={[
                { required: true, message: "Vui lòng nhập tên phân khúc" },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item name="categoryId" hidden>
              <Input hidden />
            </Form.Item>
            <Form.Item
              name="categoryName"
              label="Danh mục"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục con" },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item name="id" hidden>
              <Input hidden />
            </Form.Item>
            <Form.Item
              name="name"
              label="Danh mục"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục con" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              layout="horizontal"
              name="isActive"
              label="Trạng thái"
              valuePropName="checked"
            >
              <Switch size="small" />
            </Form.Item>
          </Form>
        );
      }
    }
  };

  return (
    <Modal
      open={isOpen}
      title={
        type === "create"
          ? `Tạo ${!record ? "phân khúc" : record.type === "Segment" ? "danh mục" : "danh mục phụ"}`
          : type === "update"
            ? `Cập nhật`
            : `Xác nhận xóa`
      }
      onCancel={onClose}
      onOk={handleOk}
      centered
    >
      {type !== "delete" ? (
        renderInput()
      ) : (
        <p>Bạn có chắc chắn muốn xóa {record?.name} không?</p>
      )}
    </Modal>
  );
};

export default SegmentModal;
