import { useEffect, useState } from "react";
import {
  Button,
  Space,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Input,
  Modal,
} from "antd";
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  archiveProduct,
  getListActiveProduct,
  getLoading,
  getPagination,
  getProducts,
} from "../../redux/productSlice";
import { ProductNew, ProductUpdate } from "../../config/routeConfig";
import { IProductResponse } from "../../interfaces/product.interface";
import { ListProductProps } from "../../props/Products/ListProductProps";
import { FormattedNumber } from "react-intl";
import { getDefaultPerPage } from "../../redux/appSlice";

const ListProduct = ({ navigate, dispatch }: ListProductProps) => {
  const products = useSelector(getProducts);
  const pagination = useSelector(getPagination);
  const isLoading = useSelector(getLoading);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(useSelector(getDefaultPerPage));
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData(currentPage, perPage, searchText);
  }, [currentPage, perPage]);

  const fetchData = (page: number, perPage: number, name?: string) => {
    dispatch(getListActiveProduct({ page, perPage, name }));
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
    fetchData(1, perPage, searchText);
  };

  const handleClear = () => {
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
    fetchData(1, perPage, "");
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPerPage(pagination.pageSize);
  };

  const handleArchived = (record: IProductResponse) => {
    Modal.confirm({
      title: "Xác nhận lưu trữ sản phẩm",
      content: `Bạn có chắc muốn lưu trữ sản phẩm "${record.name}" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        await dispatch(archiveProduct(record.id));
        fetchData(currentPage, perPage, searchText);
      },
    });
  };

  // const handleFilterChange = (changedValues: any) => {
  //   setFilters({ ...filters, ...changedValues });
  // };

  const columns: TableProps<IProductResponse>["columns"] = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phân loại",
      dataIndex: "segment",
      key: "segment",
      render: (_, record) => (
        <Space>
          <Tag color="volcano">
            {record.segment.name} - {record.segment.category.name} -{" "}
            {record.segment.category.subCategory.name}
          </Tag>
          {/* <Tag color="green">{record.segment.category.name}</Tag>
          <Tag color="volcano">{record.segment.category.subCategory.name}</Tag> */}
        </Space>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <FormattedNumber value={price} style="currency" currency="VND" />
      ),
    },
    {
      title: "SL Sản phẩm",
      dataIndex: "totalInventory",
      key: "totalInventory",
      render: (_, record) => (
        <Tag color="blue">{record.totalInventory} Sản phẩm</Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <Space>
          <Tag color={record.isActive ? "green" : "red"}>
            {record.isActive ? "Đăng Bán" : "Ngừng Bán"}
          </Tag>
          {record.totalInventory === 0 && <Tag color="default">Hết Hàng</Tag>}
        </Space>
      ),
    },
    {
      title: "Tiện ích",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chi tiết sản phẩm">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => navigate(ProductUpdate.replace(":id", record.id))}
            />
          </Tooltip>
          <Tooltip title="Xóa sản phẩm">
            <Button
              type="link"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleArchived(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Space>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            onPressEnter={handleSearch}
            allowClear
            onClear={handleClear}
          />
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
          {/* <Button
            icon={<FilterOutlined />}
            onClick={() => setIsDrawerVisible(true)}
          >
            Tìm kiếm nâng cao
          </Button> */}
        </Space>

        <Tooltip title="Thêm mới">
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => navigate(ProductNew)}
          />
        </Tooltip>
      </div>

      {/* <Drawer
        title="Bộ lọc nâng cao"
        placement="right"
        closable
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
        width={350}
      >
        <Form layout="vertical" onValuesChange={handleFilterChange}>
          <Form.Item label="Phân loại" name="segment">
            <Select allowClear placeholder="Chọn phân loại">
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Danh mục" name="category">
            <Select allowClear placeholder="Chọn danh mục">
              <Select.Option value="Áo">Áo</Select.Option>
              <Select.Option value="Quần">Quần</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Danh mục con" name="subcategory">
            <Select allowClear placeholder="Chọn danh mục con">
              <Select.Option value="Áo Thun">Áo Thun</Select.Option>
              <Select.Option value="Áo Polo">Áo Polo</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Trạng thái" name="isActive">
            <Select allowClear placeholder="Chọn trạng thái">
              <Select.Option value="true">Đang bán</Select.Option>
              <Select.Option value="false">Ngừng bán</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="isOutOfStock" valuePropName="checked">
            <Checkbox>Chỉ hiển thị sản phẩm hết hàng</Checkbox>
          </Form.Item>

          <Button type="primary" block onClick={handleSearch}>
            Áp dụng bộ lọc
          </Button>
        </Form>
      </Drawer> */}

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: "max-content" }}
        pagination={{
          size: "small",
          current: currentPage,
          pageSize: perPage,
          total: pagination.totalItems,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default ListProduct;
