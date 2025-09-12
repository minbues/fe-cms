import PageContent from "../../../components/common/PageContent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import ListUser from "../List";
import { UserType } from "../../../shared/enum";

const CustomerPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <PageContent title={t("customer_list")}>
      <ListUser navigate={navigate} dispatch={dispatch} type={UserType.USER} />
    </PageContent>
  );
};

export default CustomerPage;
