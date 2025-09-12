import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; // đổi Line thành Bar
import { useDispatch, useSelector } from "react-redux";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Chart as ChartJS,
} from "chart.js";
import { Select, Spin, DatePicker } from "antd";
import dayjs from "dayjs";

import { AppDispatch } from "../../../redux/store";
import { RevenueType } from "../../../shared/enum";
import {
  getTopProductsData,
  getTopProductsDataSelector,
} from "../../../redux/analyticSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Option } = Select;
const { RangePicker } = DatePicker;

const TopProductsChart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector(getTopProductsDataSelector);
  const [period, setPeriod] = useState<RevenueType>(RevenueType.MONTH);
  const currentYear = new Date().getFullYear();
  const [range, setRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  useEffect(() => {
    if (period === RevenueType.RANGE) {
      if (range && range[0] && range[1]) {
        dispatch(
          getTopProductsData({
            type: RevenueType.RANGE,
            start: range[0].format("YYYY-MM-DD"),
            end: range[1].format("YYYY-MM-DD"),
            limit: 15,
          })
        );
      }
    } else {
      dispatch(
        getTopProductsData({
          type: period,
          year: currentYear,
          limit: 15,
        })
      );
    }
  }, [dispatch, period, currentYear, range]);

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Số lượng bán",
        data: data.map((d) => Number(d.quantitySold)),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Sản phẩm bán chạy nhất theo ${
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
      x: {
        ticks: {
          display: false, // 👈 Ẩn nhãn trục X
        },
        grid: {
          display: false, // Tuỳ chọn: ẩn luôn lưới dọc nếu muốn
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
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
          setPeriod(value as RevenueType);
          setRange(null);
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

      {loading ? <Spin /> : <Bar data={chartData} options={options} />}
    </>
  );
};

export default TopProductsChart;
