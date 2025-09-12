import { Form, Input, Select, InputNumber, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useTranslation } from "react-i18next";
import { BasicInfoRef } from "../../../props/Products/BasicInfoProps";
import { useSelector } from "react-redux";
import { getListSegment } from "../../../redux/segmentSlice";
import { forwardRef, useState, useImperativeHandle } from "react";
import { ICategory, ISubcategory } from "../../../interfaces/segment.interface";

const Basic = forwardRef<BasicInfoRef>((_, ref) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const segmentList = useSelector(getListSegment);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subcategories, setSubcategories] = useState<ISubcategory[]>([]);

  useImperativeHandle(ref, () => ({
    validateFields: () => form.validateFields(),
    getFieldsValue: () => form.getFieldsValue(),
  }));

  const handleSegmentChange = (value: string) => {
    const selectedSegment = segmentList.find((seg) => seg.id === value);

    setCategories(selectedSegment?.categories || []);
    setSubcategories([]);
    form.setFieldsValue({
      segmentId: value,
      categoryId: undefined,
      subCategoryId: undefined,
    });
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find((cat) => cat.id === value);

    setSubcategories(selectedCategory?.subCategories || []);

    form.setFieldsValue({
      categoryId: value,
      subCategoryId: undefined,
    });
  };

  const handleSubcategoryChange = (value: string) => {
    form.setFieldsValue({ subCategoryId: value });
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 21 }}
      layout="horizontal"
      style={{ maxWidth: "100%", width: "100%", marginTop: "20px" }}
      initialValues={{ price: undefined }}
    >
      <Form.Item
        label={t("product_name")}
        name="name"
        required
        rules={[{ required: true, message: t("product_name_required") }]}
        validateTrigger="onBlur"
      >
        <Input placeholder={t("product_name")} />
      </Form.Item>

      <Form.Item
        label={t("product_price")}
        name="price"
        required
        rules={[{ required: true, message: t("product_price_required") }]}
        validateTrigger="onBlur"
      >
        <InputNumber style={{ width: "20%" }} min={1} />
      </Form.Item>

      <Form.Item
        name="segmentId"
        style={{ flex: 1 }}
        rules={[{ required: true, message: t("product_sex_required") }]}
        label={t("product_sex")}
        validateTrigger="onBlur"
      >
        <Select
          placeholder={t("product_sex")}
          style={{ width: "50%" }}
          onChange={handleSegmentChange}
          allowClear
        >
          {segmentList.map((seg) => (
            <Select.Option key={seg.id} value={seg.id}>
              {seg.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Chọn category */}
      <Form.Item
        name="categoryId"
        style={{ flex: 1 }}
        rules={[{ required: true, message: t("product_category_required") }]}
        label={t("product_category")}
        validateTrigger="onBlur"
      >
        <Select
          placeholder={t("product_category")}
          style={{ width: "50%" }}
          onChange={handleCategoryChange}
          disabled={!categories.length}
          allowClear
        >
          {categories.map((cat) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="subCategoryId"
        style={{ flex: 1 }}
        rules={[{ required: true, message: t("product_subcategory_required") }]}
        label={t("product_sub_category")}
        validateTrigger="onBlur"
      >
        <Select
          placeholder={t("product_sub_category")}
          style={{ width: "50%" }}
          disabled={!subcategories.length}
          onChange={handleSubcategoryChange}
          allowClear
        >
          {subcategories.map((sub) => (
            <Select.Option key={sub.id} value={sub.id}>
              {sub.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={t("product_description")}
        name="description"
        required
        rules={[{ required: true, message: t("product_description_required") }]}
        validateTrigger="onBlur"
      >
        <TextArea rows={4} placeholder={t("product_description")} />
      </Form.Item>

      <Form.Item
        label={t("product_display")}
        name="isActive"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch size="small" />
      </Form.Item>
    </Form>
  );
});

export default Basic;
