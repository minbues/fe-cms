import { useState, useEffect, useRef } from "react";
import { Collapse, Button, FormInstance } from "antd";
import PageContent from "../../components/common/PageContent";
import { useTranslation } from "react-i18next";
import Basic from "../../components/products/update/Basic";
import Sale from "../../components/products/update/Sale";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { getSegments, getListSegment } from "../../redux/segmentSlice";
import TitleComponent from "../../components/common/Title";
import {
  detailProduct,
  getLoading,
  getProduct,
  updateProduct,
} from "../../redux/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../../config/routeConfig";

const UpdateProduct = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [activeKeys, setActiveKeys] = useState<string[]>(["1", "2"]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const refBasicInfo = useRef<HTMLDivElement>(null);
  const refSaleInfo = useRef<HTMLDivElement>(null);
  const isLoading = useSelector(getLoading);
  const product = useSelector(getProduct);
  const segmentList = useSelector(getListSegment);

  const basicInfoFormRef = useRef<FormInstance>(null);
  const saleInfoFormRef = useRef<FormInstance>(null);

  useEffect(() => {
    if (!segmentList.length) {
      dispatch(getSegments());
    }
    if (id) {
      dispatch(detailProduct(id));
    }
  }, [id]);

  useEffect(() => {
    if (product && segmentList.length > 0) {
      const selectedSegment = segmentList.find(
        (seg) => seg.id === product.segment.id
      );
      const selectedCategory = selectedSegment?.categories?.find(
        (cat) => cat.id === product.segment.category.id
      );
      const selectedSubCategory = selectedCategory?.subCategories?.find(
        (sub) => sub.id === product.segment.category.subCategory.id
      );

      basicInfoFormRef.current?.setFieldsValue({
        name: product.name,
        price: product.price,
        segmentId: selectedSegment?.id,
        categoryId: selectedCategory?.id,
        subCategoryId: selectedSubCategory?.id,
        description: product.description,
        isActive: product.isActive,
      });

      saleInfoFormRef.current?.setFieldsValue({
        discount: product.discount,
        variants: product.variants,
      });
    }
  }, [product, segmentList]);

  const handleSubmit = async () => {
    try {
      await basicInfoFormRef.current?.validateFields();
      await saleInfoFormRef.current?.validateFields();

      const saleInfoData = await saleInfoFormRef.current?.getFieldsValue();
      const basicInfoData = await basicInfoFormRef.current?.getFieldsValue();

      if (!basicInfoData || !saleInfoData) return;

      const finalData = { ...basicInfoData, ...saleInfoData };
      await dispatch(updateProduct({ productId: id!, productData: finalData }));
    } catch (error) {
      console.error("Lỗi khi submit form:", error);
    }
  };

  return (
    <PageContent title={t("product_update")}>
      <Collapse activeKey={activeKeys} onChange={setActiveKeys}>
        <Collapse.Panel
          header={<TitleComponent text={t("product_info_basic")} level={5} />}
          key="1"
        >
          <div ref={refBasicInfo}>
            <Basic ref={basicInfoFormRef} />
          </div>
        </Collapse.Panel>
        <Collapse.Panel
          header={<TitleComponent text={t("product_info_sale")} level={5} />}
          key="2"
        >
          <div ref={refSaleInfo}>
            <Sale ref={saleInfoFormRef} />
          </div>
        </Collapse.Panel>
      </Collapse>

      <div style={{ textAlign: "right" }}>
        <Button
          type="default"
          style={{ marginTop: 10 }}
          onClick={() => navigate(Product)}
        >
          {t("back")}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          style={{ marginTop: 10, marginLeft: 8 }}
          onClick={handleSubmit}
        >
          {t("submit_update")}
        </Button>
      </div>
    </PageContent>
  );
};

export default UpdateProduct;
