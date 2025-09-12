import PageContent from "../../components/common/PageContent";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import ListEvent from "./List";

const ScheduleEventPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  return (
    <PageContent title={t("schedule_management")}>
      <ListEvent navigate={navigate} dispatch={dispatch} />
    </PageContent>
  );
};
export default ScheduleEventPage;
