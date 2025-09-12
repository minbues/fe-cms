import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import PageContent from "../../components/common/PageContent";
import ListOrder from "./List";

const OrdersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <PageContent title={t("manage_orders")}>
      <ListOrder dispatch={dispatch} navigate={navigate} />
    </PageContent>
  );
};

export default OrdersPage;
