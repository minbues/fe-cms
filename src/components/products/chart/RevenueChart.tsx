import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Chart as ChartJS,
} from "chart.js";
import { Select, Spin, DatePicker } from "antd";
import dayjs from "dayjs";

import { AppDispatch } from "../../../redux/store";
import {
  getRevenueData,
  getRevenueDataSelector,
} from "../../../redux/analyticSlice";
import { RevenueType } from "src/shared/enum";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Option } = Select;
const { RangePicker } = DatePicker;

const RevenueChart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector(getRevenueDataSelector);
  const [period, setPeriod] = useState<RevenueType>(RevenueType.MONTH);
  const currentYear = new Date().getFullYear();

  // State cho ngày bắt đầu và kết thúc khi chọn range
  const [range, setRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  useEffect(() => {
    if (period === RevenueType.RANGE) {
      if (range && range[0] && range[1]) {
        dispatch(
          getRevenueData({
            type: RevenueType.RANGE,
            start: range[0].format("YYYY-MM-DD"),
            end: range[1].format("YYYY-MM-DD"),
          })
        );
      }
    } else {
      dispatch(getRevenueData({ type: period, year: currentYear }));
    }
  }, [dispatch, period, currentYear, range]);

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: data.map((d) => Number(d.revenue)),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Doanh thu theo ${
          period === RevenueType.MONTH
            ? "tháng"
            : period === RevenueType.QUARTER
              ? "quý"
              : period === RevenueType.YEAR
                ? "năm"
                : "khoảng"
        }${period !== RevenueType.RANGE ? ` năm ${currentYear}` : ""}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => {
            const num = typeof value === "number" ? value : Number(value);
            return num.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
              minimumFractionDigits: 0,
            });
          },
        },
      },
    },
  };

  return (
    <>
      <Select
        size="small"
        value={period}
        style={{ width: 140, marginBottom: 16, marginRight: 10 }}
        onChange={(value) => {
          setPeriod(value as any);
          setRange(null); // reset range khi đổi period
        }}
      >
        <Option value={RevenueType.MONTH}>Theo tháng</Option>
        <Option value={RevenueType.QUARTER}>Theo quý</Option>
        <Option value={RevenueType.YEAR}>Theo năm</Option>
        <Option value={RevenueType.RANGE}>Theo khoảng</Option>
      </Select>

      {period === RevenueType.RANGE && (
        <RangePicker
          size="small"
          style={{ marginBottom: 16 }}
          onChange={(dates) => setRange(dates)}
          value={range}
          allowClear
          disabledDate={(current) => current && current > dayjs().endOf("day")}
        />
      )}

      {loading ? <Spin /> : <Line data={chartData} options={options} />}
    </>
  );
};

export default RevenueChart;
