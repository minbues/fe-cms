import { Menu, Modal, InputNumber, Table, TableProps, Tag, Layout } from "antd";
import { FormattedNumber } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { IProductInventory } from "../../../interfaces/analytic.interface";
import {
  bulkUpdateDiscount,
  getInventory,
  getInventorySelector,
} from "../../../redux/analyticSlice";
import { useEffect, useState } from "react";
import { AppDispatch } from "../../../redux/store";
import { getDefaultPerPage } from "../../../redux/appSlice";
import { MoreOutlined } from "@ant-design/icons";
const { Content } = Layout;

const ProductInventory = () => {
  const { data, loading, pagination } = useSelector(getInventorySelector);
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(useSelector(getDefaultPerPage));
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [discountValue, setDiscountValue] = useState<number | null>(null);

  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [currentPage, perPage]);

  const fetchData = (page: number, perPage: number) => {
    dispatch(getInventory({ page, perPage }));
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPerPage(pagination.pageSize);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleDiscountConfirm = async () => {
    if (discountValue != null && selectedRowKeys.length > 0) {
      await dispatch(
        bulkUpdateDiscount({
          ids: selectedRowKeys as string[],
          discount: discountValue,
        })
      ).unwrap();

      fetchData(currentPage, perPage);

      setIsModalVisible(false);
      setDiscountValue(null);
      setSelectedRowKeys([]);
    }
  };

  const renderOption = (props: {
    setSelectedKeys: (selectedKeys: React.Key[]) => void;
    selectedKeys: React.Key[];
    confirm: () => void;
    clearFilters?: () => void;
  }) => {
    const { setSelectedKeys, selectedKeys, confirm } = props;

    const handleClick = ({ key }: { key: string }) => {
      if (key === "1" && selectedRowKeys.length > 0) {
        setIsModalVisible(true);
      }
      setSelectedKeys([key]);
      confirm();
    };

    const menuItems = [
      {
        key: "1",
        label: (
          <span
            style={{ color: selectedRowKeys.length > 0 ? "inherit" : "#ccc" }}
          >
            Thiết lập giảm giá
          </span>
        ),
        disabled: selectedRowKeys.length === 0,
      },
    ];

    return (
      <Menu
        onClick={handleClick}
        selectedKeys={selectedKeys as string[]}
        items={menuItems}
      />
    );
  };

  const columns: TableProps<IProductInventory>["columns"] = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
      render: (_, record: IProductInventory) => (
        <FormattedNumber
          value={Number(record.price)}
          style="currency"
          currency="VND"
        />
      ),
    },
    {
      title: "Giảm giá (%)",
      dataIndex: "discount",
      key: "discount",
      align: "center",
      render: (_, record: IProductInventory) =>
        record.discount != null ? `${record.discount}%` : "-",
    },
    {
      title: "Giá bán",
      dataIndex: "discount_price",
      key: "discount_price",
      render: (_, record: IProductInventory) => {
        const discount = record.discount || 0;
        const price = Number(record.price);
        const finalPrice = price - (price * discount) / 100;

        return (
          <FormattedNumber value={finalPrice} style="currency" currency="VND" />
        );
      },
    },
    {
      title: "SL Có sẵn",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      align: "center",
      render: (value) => <Tag color="blue">{value} SP</Tag>,
    },
    {
      title: "SL Đã bán",
      dataIndex: "totalSoldQuantity",
      key: "totalSoldQuantity",
      align: "center",
      render: (value) => <Tag color="green">{value} SP</Tag>,
    },
    {
      title: "SL Còn lại",
      dataIndex: "totalInventory",
      key: "totalInventory",
      align: "center",
      render: (value) => (
        <Tag color={value > 0 ? "volcano" : "red"}>{value} SP</Tag>
      ),
      filterDropdown: (props) => (
        <div style={{ padding: 8 }}>{renderOption(props)}</div>
      ),
      filterIcon: () => <MoreOutlined style={{ fontSize: 18 }} />,
    },
  ];

  return (
    <Content style={{ backgroundColor: "#FFFFFF" }}>
      <Table
        className="custom-pagination-table"
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          size: "small",
          showSizeChanger: true,
          pageSizeOptions: ["20", "50", "100"],
          locale: {
            items_per_page: "",
          },
          showQuickJumper: false,
          current: currentPage,
          pageSize: perPage,
          total: pagination.totalItems,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title="Nhập giá muốn giảm (%)"
        open={isModalVisible}
        onOk={handleDiscountConfirm}
        onCancel={() => setIsModalVisible(false)}
        okText="Áp dụng"
        cancelText="Hủy"
        centered
      >
        <InputNumber
          min={1}
          max={100}
          placeholder="VD: 10"
          value={discountValue || undefined}
          onChange={(value) => setDiscountValue(value)}
          style={{ width: "100%" }}
        />
      </Modal>

      <style>
        {`
          .ant-table-wrapper .ant-table-pagination.ant-pagination {
            margin-right: 16px;
          }
       `}
      </style>
    </Content>
  );
};

export default ProductInventory;
