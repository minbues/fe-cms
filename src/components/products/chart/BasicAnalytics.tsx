import { Col, Card, Statistic } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getAnalyticInMonth,
  getDataAnalyticInMonth,
} from "../../../redux/analyticSlice";
import { useEffect } from "react";
import { AppDispatch } from "../../../redux/store";

const BasicAnalytic = () => {
  const analyticInMonth = useSelector(getDataAnalyticInMonth);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getAnalyticInMonth());
  }, [dispatch]);

  return (
    <>
      <Col span={6}>
        <Card style={{ backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" }}>
          <Statistic
            style={{ cursor: "default" }}
            title="Tổng doanh thu"
            value={analyticInMonth.totalRevenue}
            prefix="₫"
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" }}>
          <Statistic
            title="Sản phẩm đã bán"
            style={{ cursor: "default" }}
            value={analyticInMonth.totalProductSold}
            suffix="SP"
            valueStyle={{ color: "#faad14" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" }}>
          <Statistic
            title="Khách hàng mới"
            style={{ cursor: "default" }}
            value={analyticInMonth.totalNewCustomers}
            suffix="KH"
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" }}>
          <Statistic
            title="Đơn hàng"
            style={{ cursor: "default" }}
            value={analyticInMonth.totalOrders}
            suffix="ĐH"
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>
      </Col>
    </>
  );
};

export default BasicAnalytic;
