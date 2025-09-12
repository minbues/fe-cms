import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageContent from "src/components/common/PageContent";
import { AppDispatch } from "src/redux/store";
import ListVoucher from "./List";

const VoucherPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <PageContent title={t("voucher_list")}>
      <ListVoucher navigate={navigate} dispatch={dispatch} />
    </PageContent>
  );
};

export default VoucherPage;
