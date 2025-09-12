import PageContent from "../../components/common/PageContent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ListProduct from "./List";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";

const ProductPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <PageContent title={t("product_list")}>
      <ListProduct navigate={navigate} dispatch={dispatch} />
    </PageContent>
  );
};

export default ProductPage;
