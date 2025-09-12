import { Row, Col } from "antd";
import PageContent from "../../components/common/PageContent";
import { t } from "i18next";
import RevenueChart from "../../components/products/chart/RevenueChart";
import TopProductsChart from "../../components/products/chart/TopProductsChart";
import BasicAnalytic from "../../components/products/chart/BasicAnalytics";
import ProductInventory from "../../components/products/chart/ProductInventory";

const DashboardPage = () => {
  return (
    <PageContent
      title={t("dashboard")}
      contentSX={{
        backgroundColor: "#F0F2F5",
        border: "none",
        boxShadow: "none",
      }}
      bodySX={{
        padding: 0,
      }}
    >
      <Row gutter={[16, 16]}>
        <BasicAnalytic />
        <Col span={12}>
          <div
            style={{
              borderRadius: 8,
              boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.04)",
              backgroundColor: "#FFFFFF",
              padding: 16,
            }}
          >
            <RevenueChart />
          </div>
        </Col>
        <Col span={12}>
          <div
            style={{
              borderRadius: 8,
              boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.04)",
              backgroundColor: "#FFFFFF",
              padding: 16,
            }}
          >
            <TopProductsChart />
          </div>
        </Col>

        <Col span={24}>
          <ProductInventory />
        </Col>
      </Row>
    </PageContent>
  );
};

export default DashboardPage;
